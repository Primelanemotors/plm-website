import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Lead, Activity, CallOutcome } from '../types/acc';
import { mockLeads } from '../data/mockAccData';

export interface UseRealtimeLeadsReturn {
  leads: Lead[];
  activities: Activity[];
  loading: boolean;
  isConnected: boolean;
  lastUpdated: Date | null;
  logCallOutcome: (leadId: string, outcome: CallOutcome, staffName?: string) => Promise<boolean>;
  updateLeadStage: (leadId: string, newStage: Lead['pipeline_stage']) => Promise<boolean>;
  refreshLeads: () => Promise<void>;
}

/**
 * Custom hook managing real-time subscriptions for PLM ACC leads and activities.
 * Connects to Supabase Realtime via postgres_changes.
 * Gracefully falls back to cached/mock data if database connection or credentials are in demo mode.
 */
export const useRealtimeLeads = (): UseRealtimeLeadsReturn => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 1. Fetch initial leads & activities
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      // Query leads ordered by priority (lead_score DESC, created_at DESC)
      const { data: leadsData, error: leadsError } = await supabase
        .from('plm_leads')
        .select('*')
        .order('lead_score', { ascending: false });

      if (leadsError) {
        console.warn('[PLM Realtime] Could not fetch remote leads, using fallback dataset:', leadsError.message);
      } else if (leadsData && leadsData.length > 0) {
        setLeads(leadsData as unknown as Lead[]);
      }

      // Query recent activities
      const { data: actData, error: actError } = await supabase
        .from('plm_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!actError && actData) {
        setActivities(actData as unknown as Activity[]);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('[PLM Realtime Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Setup Supabase Realtime Channels
  useEffect(() => {
    fetchInitialData();

    // Subscribe to plm_leads table updates
    const leadsChannel = supabase
      .channel('plm_leads_realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'plm_leads',
        },
        (payload) => {
          setLastUpdated(new Date());
          const { eventType, new: newRecord, old: oldRecord } = payload;

          if (eventType === 'INSERT') {
            const incomingLead = newRecord as unknown as Lead;
            setLeads((prev) => {
              // Deduplicate and place at top if score is high
              const filtered = prev.filter((item) => item.id !== incomingLead.id && item.lead_code !== incomingLead.lead_code);
              return [incomingLead, ...filtered].sort((a, b) => b.lead_score - a.lead_score);
            });
          } else if (eventType === 'UPDATE') {
            const updatedLead = newRecord as unknown as Lead;
            setLeads((prev) =>
              prev.map((lead) => (lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead))
            );
          } else if (eventType === 'DELETE') {
            setLeads((prev) => prev.filter((lead) => lead.id !== oldRecord.id));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsConnected(false);
        }
      });

    // Subscribe to plm_activities table for instant audit logs
    const activitiesChannel = supabase
      .channel('plm_activities_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'plm_activities',
        },
        (payload) => {
          const newActivity = payload.new as unknown as Activity;
          setActivities((prev) => [newActivity, ...prev].slice(0, 30));
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(activitiesChannel);
    };
  }, [fetchInitialData]);

  // 3. Action: Atomic Call Outcome RPC trigger
  const logCallOutcome = async (
    leadId: string,
    outcome: CallOutcome,
    staffName: string = 'Zain'
  ): Promise<boolean> => {
    try {
      // Execute PostgreSQL stored procedure plm_log_call_outcome
      const { error } = await supabase.rpc('plm_log_call_outcome', {
        p_lead_id: leadId,
        p_outcome: outcome,
        p_staff_name: staffName,
      });

      if (error) {
        console.warn('[PLM RPC Call Outcome Error]:', error.message);
        // Optimistic UI fallback
        setLeads((prev) =>
          prev.map((l) => {
            if (l.id === leadId) {
              const nextStage =
                outcome === 'INTERESTED'
                  ? 'QUALIFIED'
                  : outcome === 'FINANCE_ENQUIRY'
                  ? 'APPLICATION'
                  : outcome === 'NOT_INTERESTED'
                  ? 'ARCHIVED'
                  : 'CONTACTED';
              return { ...l, pipeline_stage: nextStage, last_contact_at: new Date().toISOString() };
            }
            return l;
          })
        );
        return false;
      }

      return true;
    } catch (err) {
      console.error('[PLM RPC Exception]:', err);
      return false;
    }
  };

  // 4. Action: Manual stage transition
  const updateLeadStage = async (
    leadId: string,
    newStage: Lead['pipeline_stage']
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('plm_leads')
        .update({ pipeline_stage: newStage, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) {
        console.error('[PLM Stage Update Error]:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('[PLM Stage Update Exception]:', err);
      return false;
    }
  };

  return {
    leads,
    activities,
    loading,
    isConnected,
    lastUpdated,
    logCallOutcome,
    updateLeadStage,
    refreshLeads: fetchInitialData,
  };
};
