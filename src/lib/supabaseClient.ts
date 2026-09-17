import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client Initialization
 * Strictly uses public environment variables for client-side execution.
 * Never expose the SUPABASE_SERVICE_ROLE_KEY here.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'plm_acc_auth_token',
  },
});

export default supabase;
