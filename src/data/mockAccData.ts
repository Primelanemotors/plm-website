import type { Lead, Dealership, Commission, Activity } from '../types/acc';

/**
 * Isolated Mock Data Layer for PLM ACC
 * Easily replaceable by Supabase client hooks and RPC queries in Phase 2.
 */

export const mockLeads: Lead[] = [
  {
    id: 'PLM-1042',
    lead_code: 'PLM-1042',
    do_not_contact: false,
    customer_name: 'John Smith',
    phone: '+27824918820',
    email: 'john.smith@example.com',
    vehicle_interest: 'VW Polo 1.0 TSI',
    vehicle_year: 2024,
    lead_source: 'Instagram Direct',
    lead_score: 87,
    temperature: 'HOT',
    pipeline_stage: 'QUALIFIED',
    last_contact_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    message_sequence: 'Seq 3/3 Delivered',
    call_window: '10:00 – 12:00 SAST',
    last_customer_response: 'Let me think about it',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'PLM-1048',
    lead_code: 'PLM-1048',
    do_not_contact: false,
    customer_name: 'Sarah Jenkins',
    phone: '+27839912345',
    email: 'sarah.j@example.com',
    vehicle_interest: 'VW T-Cross 1.0 TSI',
    vehicle_year: 2024,
    lead_source: 'TikTok Inbound',
    lead_score: 82,
    temperature: 'WARM',
    pipeline_stage: 'CONTACTED',
    last_contact_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    message_sequence: 'Seq 2/3 Delivered',
    last_customer_response: 'Looking at options for finance',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'PLM-1051',
    lead_code: 'PLM-1051',
    do_not_contact: false,
    customer_name: 'Sipho Khumalo',
    phone: '+27725556789',
    vehicle_interest: 'VW Polo GTI DSG',
    vehicle_year: 2023,
    lead_source: 'WhatsApp Direct',
    lead_score: 91,
    temperature: 'HOT',
    pipeline_stage: 'APPLICATION',
    last_contact_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    message_sequence: 'Pre-approval in progress',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  }
];

export const mockDealerships: Dealership[] = [
  {
    id: 'dealer-01',
    name: 'Barons VW Sandton',
    sla_hours_threshold: 48,
  }
];

export const mockCommissions: Commission[] = [
  {
    id: 'comm-01',
    lead_id: 'PLM-1020',
    dealership_id: 'dealer-02',
    amount: 7500,
    currency: 'ZAR',
    status: 'AWAITING_PAYMENT',
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'act-01',
    lead_id: 'PLM-1042',
    activity_type: 'MESSAGE_SENT',
    description: 'Final automated sequence message delivered via Instagram DM',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    created_by: 'PLM Agent Coach',
  }
];
