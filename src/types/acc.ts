/**
 * Prime Lane Motors (PLM) — Unified Domain Models & TypeScript Definitions
 * Master Source of Truth for Frontend, Backend Services, and Integrations
 */

export type PipelineStage =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'VEHICLE_MATCHED'
  | 'FINANCE_ENQUIRY'
  | 'APPLICATION'
  | 'DEALERSHIP'
  | 'APPROVAL'
  | 'DEAL_CLOSED'
  | 'LOST'
  | 'ARCHIVED';

export type LeadTemperature = 'HOT' | 'WARM' | 'COLD';

export type LeadSource =
  | 'Website Enquiry'
  | 'Find My Car'
  | 'WhatsApp Direct'
  | 'Instagram Direct'
  | 'Facebook Lead'
  | 'TikTok Inbound'
  | 'Referral'
  | 'Manual Entry';

export interface Lead {
  id: string;
  lead_code: string;
  customer_name: string;
  phone: string;
  email?: string | null;
  whatsapp_id?: string | null;
  vehicle_interest: string;
  vehicle_year: number;
  lead_source: LeadSource;
  lead_score: number; // 0 - 100
  temperature: LeadTemperature;
  pipeline_stage: PipelineStage;
  
  // Consent & POPIA Compliance
  do_not_contact: boolean;
  opted_out_at?: string | null;
  opt_out_source?: string | null;
  
  // Follow-up & AI context
  last_contact_at: string;
  next_follow_up_at?: string | null;
  message_sequence?: string | null;
  call_window?: string | null;
  last_customer_response?: string | null;
  assigned_to?: string | null;
  dealership_id?: string | null;
  
  created_at: string;
  updated_at: string;
}

export type ActivityType =
  | 'MESSAGE_RECEIVED'
  | 'MESSAGE_SENT'
  | 'CALL_ATTEMPTED'
  | 'CALL_COMPLETED'
  | 'FOLLOW_UP'
  | 'EMAIL_SENT'
  | 'APPLICATION_STARTED'
  | 'APPLICATION_SUBMITTED'
  | 'VEHICLE_MATCHED'
  | 'DEALERSHIP_SUBMITTED'
  | 'APPROVAL_RECEIVED'
  | 'DEAL_CLOSED'
  | 'COMMISSION_RECORDED'
  | 'NOTE_ADDED';

export interface Activity {
  id: string;
  lead_id: string;
  activity_type: ActivityType;
  description: string;
  external_event_id?: string | null;
  metadata?: Record<string, any>;
  created_by: string;
  created_at: string;
}

export type CallOutcome =
  | 'INTERESTED'
  | 'NEEDS_TIME'
  | 'OTHER_OPTIONS'
  | 'FINANCE_ENQUIRY'
  | 'NO_ANSWER'
  | 'NOT_INTERESTED';

export type FollowUpType = 'CALL' | 'WHATSAPP' | 'EMAIL' | 'DEALERSHIP_CHECK';
export type FollowUpStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface FollowUp {
  id: string;
  lead_id: string;
  type: FollowUpType;
  scheduled_at: string;
  status: FollowUpStatus;
  notes?: string;
  completed_at?: string;
}

export interface Dealership {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  referral_code_prefix?: string;
  sla_hours_threshold: number;
}

export interface Deal {
  id: string;
  deal_code: string;
  lead_id: string;
  vehicle_id?: string;
  dealership_id: string;
  deal_value: number;
  status: PipelineStage;
  finance_bank?: string;
  closed_at?: string;
}

export type CommissionStatus =
  | 'NOT_EARNED'
  | 'EARNED'
  | 'AWAITING_PAYMENT'
  | 'PAID'
  | 'DISPUTED';

export interface Commission {
  id: string;
  deal_id?: string;
  lead_id: string;
  dealership_id: string;
  amount: number;
  currency: string;
  status: CommissionStatus;
  paid_at?: string;
  notes?: string;
}

// AI Classifier & Rule Engine Response Model
export type CustomerIntent =
  | 'FINANCE'
  | 'INVENTORY'
  | 'SCHEDULE_CALL'
  | 'OPT_OUT'
  | 'GENERAL';

export interface AIClassificationResult {
  intent: CustomerIntent;
  confidence: number;
  scoreAdjustment: number;
  recommendedStage: PipelineStage;
  recommendedAction: string;
  responseSuggestion: string;
}
