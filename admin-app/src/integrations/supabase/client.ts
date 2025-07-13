// Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables with bulletproof fallback
function getEnvOrDummy(env: string | undefined, dummy: string) {
  return (env && env.trim().length > 0) ? env : dummy;
}

const supabaseUrl = getEnvOrDummy(import.meta.env.VITE_SUPABASE_URL, "https://dummy.supabase.co");
const supabaseAnonKey = getEnvOrDummy(import.meta.env.VITE_SUPABASE_ANON_KEY, "dummy-anon-key");

console.log("Supabase URL used:", supabaseUrl);

// Create and export the Supabase client with error handling
// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

let supabase;
try {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  console.log(`Supabase client initialized with URL: ${supabaseUrl.substring(0, 20)}...`);
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Create a mock client that won't throw errors
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            then: () => Promise.resolve({ data: [], error: null }),
          }),
          then: () => Promise.resolve({ data: [], error: null }),
        }),
        single: () => ({
          then: () => Promise.resolve({ data: null, error: null }),
        }),
        limit: () => ({
          then: () => Promise.resolve({ data: [], error: null }),
        }),
        then: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () => ({
            then: () => Promise.resolve({ data: {}, error: null }),
          }),
          then: () => Promise.resolve({ data: [], error: null }),
        }),
        then: () => Promise.resolve({ data: null, error: null }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => ({
              then: () => Promise.resolve({ data: {}, error: null }),
            }),
            then: () => Promise.resolve({ data: [], error: null }),
          }),
          then: () => Promise.resolve({ data: null, error: null }),
        }),
        then: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    auth: {
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  };
}

export { supabase };

// Export a function to check connection
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('programs').select('count').limit(1);
    if (error) throw error;
    return { connected: true, message: 'Connected to Supabase' };
  } catch (error) {
    console.error('Supabase connection error:', error);
    return { 
      connected: false, 
      message: error instanceof Error ? error.message : 'Unknown error connecting to Supabase' 
    };
  }
}
