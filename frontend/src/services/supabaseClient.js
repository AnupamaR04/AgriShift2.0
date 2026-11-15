import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validates whether genuine Supabase project credentials are configured
export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    !supabaseUrl.includes('your-project-id')
  );
};

// Create client if configured, otherwise provide safe fallback object
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Local fallback store key for local development when credentials are not yet populated
const LOCAL_STORAGE_KEY = 'agrishift_farmer_session';

export const localAuthService = {
  getSession: () => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveSession: (sessionData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionData));
  },
  clearSession: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem('agrishift_farmer_farm');
  },
};
