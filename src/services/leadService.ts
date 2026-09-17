import { supabase } from '../lib/supabaseClient';
import type { LeadSource } from '../types/acc';

export interface WebsiteEnquiryPayload {
  customer_name: string;
  phone: string;
  email?: string;
  vehicle_interest: string;
  vehicle_year?: number;
  lead_source?: LeadSource;
  comments?: string;
}

export interface SubmissionResult {
  success: boolean;
  leadCode?: string;
  error?: string;
}

/**
 * Generates an internal sequential-style lead tracking code
 * Format: PLM-XXXX (e.g. PLM-8492)
 */
const generateLeadCode = (): string => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `PLM-${randomSuffix}`;
};

/**
 * Ingests a new public enquiry into plm_leads and logs an initial audit activity.
 * Allowed by Supabase RLS policy for anonymous visitors ('anon').
 */
export const submitPublicEnquiry = async (
  payload: WebsiteEnquiryPayload
): Promise<SubmissionResult> => {
  try {
    const leadCode = generateLeadCode();
    
    // Clean and normalize phone number for South African format (+27)
    let cleanPhone = payload.phone.replace(/[\s-]/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 10) {
      cleanPhone = `+27${cleanPhone.slice(1)}`;
    }

    // 1. Insert new lead record
    const { data: leadData, error: leadError } = await supabase
      .from('plm_leads')
      .insert([
        {
          lead_code: leadCode,
          customer_name: payload.customer_name.trim(),
          phone: cleanPhone,
          email: payload.email?.trim() || null,
          vehicle_interest: payload.vehicle_interest.trim(),
          vehicle_year: payload.vehicle_year || new Date().getFullYear(),
          lead_source: payload.lead_source || 'Website Enquiry',
          lead_score: 65, // Standard baseline score for direct website submissions
          temperature: 'WARM',
          pipeline_stage: 'NEW',
          message_sequence: 'Seq 1/3 Queued',
          last_customer_response: payload.comments ? payload.comments.trim() : 'Initial web submission received',
          do_not_contact: false,
        },
      ])
      .select('id, lead_code')
      .single();

    if (leadError) {
      console.error('[PLM Ingestion Error] Failed inserting lead:', leadError.message);
      return { success: false, error: leadError.message };
    }

    // 2. Insert initial activity audit trail
    if (leadData?.id) {
      await supabase.from('plm_activities').insert([
        {
          lead_id: leadData.id,
          activity_type: 'NOTE_ADDED',
          description: `Web enquiry captured via ${payload.lead_source || 'Website Enquiry'}. Vehicle: ${payload.vehicle_interest}. Comments: "${payload.comments || 'None'}"`,
          created_by: 'Public Web Gateway',
        },
      ]);
    }

    return {
      success: true,
      leadCode: leadData?.lead_code || leadCode,
    };
  } catch (err: any) {
    console.error('[PLM Ingestion Exception]:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred during submission.',
    };
  }
};
