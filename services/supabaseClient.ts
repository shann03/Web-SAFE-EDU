
import { createClient } from '@supabase/supabase-js';

// These are placeholders. In a real app, use import.meta.env.VITE_SUPABASE_URL
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://grtnofqyehjjhddabdzr.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OICHSnydUPa9YZvL6R2MeQ_O0hz7uM5';

// Mock Supabase client if configuration is missing or invalid
const createSafeClient = () => {
  try {
    if (!SUPABASE_URL || SUPABASE_URL.includes('your-project') || !SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase configuration');
    }
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (error) {
    console.warn('Supabase client initialization failed. Falling back to mock client.', error);
    // Return a proxy that handles common Supabase calls to prevent crashes
    return {
      from: () => ({
        select: () => ({ order: () => ({ single: () => Promise.resolve({ data: null, error: null }), eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }), data: [], error: null }), data: [], error: null }),
        insert: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
        update: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
      }),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Mock login only') }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      }
    } as any;
  }
};

export const supabase = createSafeClient();
