import React, { useState, useEffect } from 'react';
import { useRealtimeLeads } from '../hooks/useRealtimeLeads';
import type { CallOutcome, Lead } from '../types/acc';

/**
 * Prime Lane Motors — Mobile AI Agent Command Centre (/acc)
 * Phase 5 Implementation: Connected with useRealtimeLeads for live Supabase sync,
 * optimistic updates, dynamic incoming lead alerts, and real-time state transitions.
 */

// 1. HEADER COMPONENT WITH LIVE STATUS INDICATOR
export const AccHeader: React.FC<{
  isConnected: boolean;
  lastUpdated: Date | null;
  onRefresh?: () => void;
  onExit?: () => void;
}> = ({ isConnected, lastUpdated, onRefresh, onExit }) => (
  <header className="sticky top-0 z-40 bg-[#131313] border-b border-[#2e2e2e] px-4 py-3 flex items-center justify-between text-white">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 bg-white text-black font-black text-sm flex items-center justify-center rounded">
        PLM
      </div>
      <div>
        <h1 className="text-base font-bold tracking-tight leading-none">PLM ACC</h1>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="text-[10px] text-zinc-400 font-medium tracking-wide">
            {isConnected ? 'LIVE SYNC' : 'OFFLINE / DEMO'}
          </span>
          {lastUpdated && (
            <span className="text-[9px] text-zinc-500 hidden sm:inline">
              • {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          aria-label="Refresh Data"
          className="p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 transition-colors"
          title="Force refresh leads"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}
      <button
        type="button"
        aria-label="Notifications"
        className="p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 transition-colors relative"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5" />
      </button>
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          className="px-2.5 py-1 text-xs font-semibold rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 transition-colors"
        >
          Exit
        </button>
      )}
    </div>
  </header>
);

// 2. MORNING BRIEFING COMPONENT (DYNAMIC STATS)
export const MorningBriefing: React.FC<{
  leads: Lead[];
  activeFilter: string;
  onFilterChange: (f: string) => void;
}> = ({ leads, activeFilter, onFilterChange }) => {
  const hotCount = leads.filter((l) => l.temperature === 'HOT').length;
  const warmCount = leads.filter((l) => l.temperature === 'WARM').length;
  const callRequiredCount = leads.filter(
    (l) => l.pipeline_stage === 'NEW' || l.pipeline_stage === 'CONTACTED' || l.pipeline_stage === 'QUALIFIED'
  ).length;

  return (
    <section className="bg-[#1a1a1a] border border-[#2b2b2b] rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium tracking-wider">
        <span className="flex items-center gap-1 text-zinc-300 font-semibold uppercase">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          Morning Briefing
        </span>
        <span className="text-[11px] text-zinc-500">Live Active Queue</span>
      </div>
      <p className="text-sm text-zinc-200 mb-3 leading-relaxed">
        Good morning, <strong className="text-white">Zain</strong>. {leads.length} active leads synchronized in CRM:{' '}
        <span className="text-red-400 font-semibold">{hotCount} HOT</span>,{' '}
        <span className="text-amber-400 font-semibold">{warmCount} WARM</span>. Immediate calls queued for high-priority applicants.
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: `All Leads (${leads.length})` },
          { id: 'hot', label: `HOT Leads (${hotCount})` },
          { id: 'calls', label: `Actionable Calls (${callRequiredCount})` },
        ].map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => onFilterChange(btn.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === btn.id
                ? 'bg-white text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </section>
  );
};

// 3. AI AGENT COACH DIRECTIVE
export const AiAgentCoach: React.FC<{ topLead?: Lead }> = ({ topLead }) => {
  if (!topLead) return null;

  return (
    <div className="bg-[#181818] border-l-4 border-amber-500 rounded-r-xl p-3.5 mb-4 text-xs text-zinc-300">
      <div className="flex items-center gap-1.5 font-bold text-white mb-1">
        <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] flex items-center justify-center font-black">AI</span>
        PLM Agent Coach • Real-Time Directive
      </div>
      <p className="leading-snug text-zinc-300">
        <strong className="text-white">{topLead.customer_name}</strong> is your top priority in Gauteng ({topLead.lead_source}).
        Interested in <strong className="text-white">{topLead.vehicle_interest}</strong>.
        {topLead.last_customer_response ? ` Note: "${topLead.last_customer_response}"` : ''}
      </p>
      <div className="mt-2 text-amber-400 font-semibold flex items-center gap-1">
        ⚡ Recommended window: {topLead.call_window || 'Immediate Contact'} to qualify before weekend dispatch.
      </div>
    </div>
  );
};

// 4. LEAD PRIORITY CARD
export const LeadPriorityCard: React.FC<{
  lead: Lead;
  onCallInitiated?: (lead: Lead) => void;
  onArchiveLead?: (leadId: string) => void;
}> = ({ lead, onCallInitiated, onArchiveLead }) => {
  const isHot = lead.temperature === 'HOT' || lead.lead_score >= 80;

  return (
    <article
      className={`bg-[#181818] border ${
        isHot ? 'border-red-900/50 shadow-red-950/20' : 'border-zinc-800'
      } rounded-xl p-4 mb-4 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isHot ? 'bg-red-500 animate-ping' : 'bg-amber-400'
            }`}
          />
          <span
            className={`text-[11px] font-bold uppercase tracking-wide ${
              isHot ? 'text-red-400' : 'text-amber-400'
            }`}
          >
            {isHot ? 'High-Intent Priority' : 'Active Prospect'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="bg-zinc-800 text-zinc-400 text-[10px] font-mono px-2 py-0.5 rounded uppercase">
            {lead.pipeline_stage}
          </span>
          <span
            className={`${
              isHot ? 'bg-red-950/80 border border-red-800/60 text-red-300' : 'bg-zinc-800 text-zinc-300'
            } text-[10px] font-black px-2 py-0.5 rounded`}
          >
            SCORE: {lead.lead_score} {lead.temperature}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-lg font-black text-white leading-tight">{lead.customer_name}</h2>
          <p className="text-xs text-zinc-400">Ref: #{lead.id} • Via {lead.lead_source}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-zinc-200">{lead.vehicle_interest}</div>
          <div className="text-xs text-zinc-400">{lead.vehicle_year || 2024} Spec</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-zinc-900/70 border border-zinc-800 rounded-lg p-2.5 mb-3 text-xs">
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase">Last Interaction</span>
          <span className="text-zinc-300 font-medium truncate block">
            {lead.last_customer_response || 'Initial submission logged'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-zinc-500 block text-[10px] uppercase">Automated Sequence</span>
          <span className="text-zinc-300 font-medium">{lead.message_sequence || 'Standby'}</span>
        </div>
      </div>

      {/* Primary Native Calling Dispatch */}
      <a
        href={`tel:${lead.phone}`}
        onClick={() => onCallInitiated && onCallInitiated(lead)}
        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-extrabold text-sm py-3 px-4 rounded-xl mb-2.5 transition-colors shadow"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        CALL NOW ({lead.phone})
      </a>

      <div className="grid grid-cols-3 gap-2">
        <a
          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold py-2 rounded-lg border border-zinc-700/60 transition-colors"
        >
          WhatsApp
        </a>
        <button
          type="button"
          onClick={() => alert(`Customer Dossier: ${lead.customer_name}\nPhone: ${lead.phone}\nVehicle: ${lead.vehicle_interest}\nStage: ${lead.pipeline_stage}`)}
          className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold py-2 rounded-lg border border-zinc-700/60 transition-colors"
        >
          Dossier
        </button>
        <button
          type="button"
          onClick={() => onArchiveLead && onArchiveLead(lead.id)}
          className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 text-xs font-semibold py-2 rounded-lg border border-zinc-700/60 transition-colors"
        >
          Archive
        </button>
      </div>
    </article>
  );
};

// 5. CALL OUTCOME LOGGER (CONNECTED TO SUPABASE RPC)
export const CallOutcomeLogger: React.FC<{
  selectedLead: Lead;
  onSelectOutcome: (outcome: CallOutcome) => void;
  isSubmitting?: boolean;
}> = ({ selectedLead, onSelectOutcome, isSubmitting = false }) => {
  const outcomes: { key: CallOutcome; label: string; desc: string }[] = [
    { key: 'INTERESTED', label: 'Interested', desc: 'Move to Qualified & F&I' },
    { key: 'NEEDS_TIME', label: 'Needs Time', desc: '14-Day Nurture Stream' },
    { key: 'OTHER_OPTIONS', label: 'Other Options', desc: 'Stock Matching Agent' },
    { key: 'FINANCE_ENQUIRY', label: 'Finance Enquiry', desc: 'WesBank Link Dispatched' },
    { key: 'NO_ANSWER', label: 'No Answer', desc: 'Auto-retry in 4 Hours' },
    { key: 'NOT_INTERESTED', label: 'Not Interested', desc: 'Archive & Suppress' },
  ];

  return (
    <section className="bg-[#181818] border border-zinc-800 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Log Outcome ({selectedLead.customer_name})
        </h3>
        {isSubmitting ? (
          <span className="text-[10px] text-amber-400 animate-pulse font-medium">Updating DB...</span>
        ) : (
          <span className="text-[10px] text-zinc-500 font-medium">1-tap auto execute</span>
        )}
      </div>
      <p className="text-xs text-zinc-400 mb-3">Post-call trigger to auto-progress pipeline in Supabase:</p>

      <div className="grid grid-cols-2 gap-2">
        {outcomes.map((item) => (
          <button
            key={item.key}
            type="button"
            disabled={isSubmitting}
            onClick={() => onSelectOutcome(item.key)}
            className="text-left bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg p-2.5 transition-colors group disabled:opacity-50"
          >
            <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
              {item.label}
            </div>
            <div className="text-[10px] text-zinc-500">{item.desc}</div>
          </button>
        ))}
      </div>
    </section>
  );
};

// 6. AI DRAFT APPROVAL (LEVEL 2 HUMAN-IN-THE-LOOP)
export const AiDraftApproval: React.FC<{
  lead: Lead;
  onSendApproved: (text: string) => void;
}> = ({ lead, onSendApproved }) => {
  const [draft, setDraft] = useState(
    `"Hi ${lead.customer_name.split(' ')[0]}, Prime Lane Motors here. Checking in regarding the ${lead.vehicle_interest} options we sent over. Would you still like us to assist you with vehicle finance, or should we pause your search for now?"`
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setDraft(
      `"Hi ${lead.customer_name.split(' ')[0]}, Prime Lane Motors here. Checking in regarding the ${lead.vehicle_interest} options we sent over. Would you still like us to assist you with vehicle finance, or should we pause your search for now?"`
    );
  }, [lead]);

  return (
    <article className="bg-[#181818] border border-zinc-800 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-400 text-xs">🤖</span>
          <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
            AI Draft Ready For Approval
          </span>
        </div>
        <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded">
          SCORE: {lead.lead_score} {lead.temperature}
        </span>
      </div>

      <div className="flex justify-between items-baseline mb-2">
        <h4 className="text-sm font-bold text-white">{lead.customer_name}</h4>
        <span className="text-xs text-zinc-400">#{lead.id} • {lead.lead_source}</span>
      </div>

      <div className="bg-black/50 border border-zinc-800 rounded-lg p-3 mb-3">
        <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">WhatsApp Copy Draft</div>
        {isEditing ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full bg-zinc-900 text-xs text-zinc-200 border border-zinc-700 rounded p-2 focus:outline-none focus:border-white"
            rows={4}
          />
        ) : (
          <p className="text-xs italic text-zinc-300 leading-relaxed">{draft}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onSendApproved(draft)}
        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs py-2.5 px-4 rounded-lg mb-2 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Approve & Send WhatsApp
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold py-1.5 rounded-lg border border-zinc-700 transition-colors"
        >
          {isEditing ? 'Save Changes' : 'Edit Draft'}
        </button>
        <a
          href={`tel:${lead.phone}`}
          className="text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold py-1.5 rounded-lg border border-zinc-700 transition-colors"
        >
          Call Instead
        </a>
      </div>
    </article>
  );
};

// 7. NETWORK & DEALERSHIP ALERTS
export const NetworkAlerts: React.FC = () => (
  <section className="space-y-2 mb-4">
    <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">
      Network & Dealership Alerts
    </div>
    <div className="bg-[#181818] border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
      <div>
        <div className="text-xs font-bold text-white flex items-center gap-1.5">
          <span className="text-amber-400">🏢</span> Barons VW Sandton
        </div>
        <div className="text-[11px] text-zinc-400">Referral PLM-R-00124 • 48h SLA aging</div>
      </div>
      <button
        type="button"
        className="px-3 py-1.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-700 transition-colors"
      >
        Nudge Dealer
      </button>
    </div>

    <div className="bg-[#181818] border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
      <div>
        <div className="text-xs font-bold text-white flex items-center gap-1.5">
          <span className="text-emerald-400">💰</span> Commission Verification
        </div>
        <div className="text-[11px] text-zinc-400">Hatfield VW: R7,500 pending EFT settlement</div>
      </div>
      <button
        type="button"
        className="px-3 py-1.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-700 transition-colors"
      >
        View Ledger
      </button>
    </div>
  </section>
);

// 8. SALES COACH CONVERSATIONAL INPUT
export const SalesCoachInput: React.FC<{
  onCommand: (cmd: string) => void;
}> = ({ onCommand }) => {
  const [inputVal, setInputVal] = useState('');

  const quickPrompts = [
    "'Start My Day'",
    "'Who do I call today?'",
    "'Show hottest leads'",
  ];

  return (
    <div className="sticky bottom-16 z-30 bg-[#131313]/95 backdrop-blur border-t border-zinc-800 pt-2 pb-2 px-3">
      <div className="flex gap-2 overflow-x-auto pb-1.5 mb-1.5 scrollbar-none text-xs">
        {quickPrompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onCommand(p.replace(/'/g, ''))}
            className="px-2.5 py-1 rounded-full bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 whitespace-nowrap text-[11px] transition-colors"
          >
            ⚡ {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputVal.trim()) {
            onCommand(inputVal);
            setInputVal('');
          }
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask Sales Coach or type natural command..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
          />
        </div>
        <button
          type="submit"
          aria-label="Send natural command"
          className="p-2 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </form>
    </div>
  );
};

// 9. BOTTOM NAVIGATION DOCK (STRICT 5 TABS)
export const AccBottomNav: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'leads', label: 'Leads', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'agents', label: 'Agents', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'pipeline', label: 'Pipeline', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'more', label: 'More', icon: 'M4 6h16M4 12h16M4 18h16' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#131313] border-t border-[#2e2e2e] h-16 flex items-center justify-around px-2 max-w-md mx-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
              isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 1.75} d={tab.icon} />
            </svg>
            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

// 10. PRIMARY CONNECTED ACC DASHBOARD CONTAINER (PHASE 5)
export const AccDashboard: React.FC<{ onExit?: () => void }> = ({ onExit }) => {
  // Integrate Phase 4 Real-time Supabase Hook
  const {
    leads,
    loading,
    isConnected,
    lastUpdated,
    logCallOutcome,
    updateLeadStage,
    refreshLeads,
  } = useRealtimeLeads();

  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('home');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSubmittingOutcome, setIsSubmittingOutcome] = useState(false);

  // Apply real-time client filtering
  const filteredLeads = leads.filter((l) => {
    if (filter === 'hot') return l.temperature === 'HOT' || l.lead_score >= 80;
    if (filter === 'calls') return l.pipeline_stage === 'NEW' || l.pipeline_stage === 'CONTACTED' || l.pipeline_stage === 'QUALIFIED';
    return true;
  });

  const primaryLead = filteredLeads[0] || leads[0];
  const secondaryLead = filteredLeads[1] || leads[1];

  const handleOutcome = async (outcome: CallOutcome) => {
    if (!primaryLead) return;

    setIsSubmittingOutcome(true);
    setFeedbackMessage(`Logging "${outcome}" for ${primaryLead.customer_name}...`);

    const ok = await logCallOutcome(primaryLead.id, outcome, 'Zain');
    setIsSubmittingOutcome(false);

    if (ok) {
      setFeedbackMessage(`✓ "${outcome}" logged to Supabase for ${primaryLead.customer_name}. Lead stage progressed.`);
    } else {
      setFeedbackMessage(`✓ Updated UI optimistically ("${outcome}"). Syncing with server...`);
    }

    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleArchive = async (leadId: string) => {
    await updateLeadStage(leadId, 'ARCHIVED');
    setFeedbackMessage('Lead moved to Archive stage in CRM.');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleCommand = (cmd: string) => {
    if (cmd.toLowerCase().includes('hot')) {
      setFilter('hot');
      setFeedbackMessage('Filtered to HOT high-intent leads.');
    } else if (cmd.toLowerCase().includes('call')) {
      setFilter('calls');
      setFeedbackMessage('Showing leads with pending phone touchpoints.');
    } else {
      setFeedbackMessage(`Sales Coach processing: "${cmd}"`);
    }
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleSendDraft = (draftText: string) => {
    if (!secondaryLead) return;
    const cleanPhone = secondaryLead.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(draftText.replace(/^"|"$/g, ''));
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    setFeedbackMessage(`WhatsApp dispatched for ${secondaryLead.customer_name}.`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#101010] text-zinc-100 flex justify-center selection:bg-white selection:text-black">
      {/* 390px Mobile constraint frame */}
      <div className="w-full max-w-md min-h-screen flex flex-col relative pb-28 border-x border-zinc-900 bg-[#121212]">
        <AccHeader
          isConnected={isConnected}
          lastUpdated={lastUpdated}
          onRefresh={refreshLeads}
          onExit={onExit}
        />

        {feedbackMessage && (
          <div className="sticky top-14 z-50 bg-emerald-500 text-black font-bold text-xs py-2 px-4 text-center shadow-lg transition-all animate-bounce">
            {feedbackMessage}
          </div>
        )}

        <main className="p-4 flex-1">
          {loading && leads.length === 0 ? (
            <div className="py-20 text-center text-zinc-400">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs uppercase tracking-wider font-semibold">Connecting to PLM Realtime Bus...</p>
            </div>
          ) : (
            <>
              <MorningBriefing
                leads={leads}
                activeFilter={filter}
                onFilterChange={setFilter}
              />

              <AiAgentCoach topLead={primaryLead} />

              {primaryLead ? (
                <>
                  <LeadPriorityCard
                    lead={primaryLead}
                    onArchiveLead={handleArchive}
                  />
                  <CallOutcomeLogger
                    selectedLead={primaryLead}
                    onSelectOutcome={handleOutcome}
                    isSubmitting={isSubmittingOutcome}
                  />
                </>
              ) : (
                <div className="bg-[#181818] border border-zinc-800 rounded-xl p-6 text-center text-zinc-400 text-xs mb-4">
                  No leads matching the current filter.
                </div>
              )}

              {secondaryLead && (
                <AiDraftApproval
                  lead={secondaryLead}
                  onSendApproved={handleSendDraft}
                />
              )}

              <NetworkAlerts />
            </>
          )}
        </main>

        <SalesCoachInput onCommand={handleCommand} />
        <AccBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default AccDashboard;
