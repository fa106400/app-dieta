import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient, Session } from '@supabase/supabase-js'
import type { Database } from '../../supabase'

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Client-side Supabase client (SSR-aware browser client only)
export const supabase: SupabaseClient<Database> | null = supabaseUrl && supabaseAnonKey
  ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

// Function to create a fresh Supabase client
export function createFreshSupabaseClient(): SupabaseClient<Database> | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('🔍 Missing Supabase environment variables')
    return null
  }
  
  console.log('🔍 Creating fresh Supabase client...')
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Helper function to validate session before making requests
export async function validateSession() {
  console.log('🔍 validateSession - Starting session validation...');
  console.log('🔍 validateSession - Supabase client exists:', !!supabase);
  
  if (!supabase) {
    console.error('🔍 validateSession - Supabase client not available');
    throw new Error('Supabase client not available')
  }
  
  // NEW APPROACH: Skip getSession() entirely and try refreshSession() first
  console.log('🔍 validateSession - Attempting refreshSession() instead of getSession()...');
  
  try {
    // Try refreshSession first - this is more reliable after browser minimization
    const refreshPromise = supabase.auth.refreshSession();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Session refresh timeout after 5 seconds')), 5000)
    );
    
    console.log('🔍 validateSession - Waiting for refresh response...');
    const result = await Promise.race([refreshPromise, timeoutPromise]) as { data: { session: Session | null }, error: Error | null };
    
    const { data: { session }, error } = result;
    
    console.log('🔍 validateSession - Refresh response received:', {
      hasSession: !!session,
      hasError: !!error,
      errorMessage: error?.message
    });
    
    if (error) {
      console.error('🔍 validateSession - Session refresh error:', error);
      console.error('🔍 validateSession - Error details:', {
        message: error.message
      });
      throw error
    }
    
    if (!session) {
      console.error('🔍 validateSession - No valid session after refresh');
      throw new Error('No valid session found')
    }
    
    console.log('🔍 validateSession - Session refresh successful:', {
      userId: session.user?.id,
      email: session.user?.email,
      expiresAt: session.expires_at,
      accessToken: session.access_token ? 'Present' : 'Missing'
    });
    
    return session
  } catch (err) {
    console.error('🔍 validateSession - Refresh failed, trying getSession as fallback:', err);
    
    // If refresh fails, try getSession as fallback
    try {
      console.log('🔍 validateSession - Attempting getSession() as fallback...');
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session get timeout after 3 seconds')), 3000)
      );
      
      const result = await Promise.race([sessionPromise, timeoutPromise]) as { data: { session: Session | null }, error: Error | null };
      const { data: { session }, error } = result;
      
      if (error) throw error;
      if (!session) throw new Error('No valid session found');
      
      console.log('🔍 validateSession - getSession fallback successful!');
      return session;
    } catch (fallbackErr) {
      console.error('🔍 validateSession - Both refresh and getSession failed:', fallbackErr);
      
      // Final fallback: create fresh client and try refresh
      console.log('🔍 validateSession - Attempting final fallback with fresh client...');
      try {
        const freshClient = createFreshSupabaseClient();
        if (freshClient) {
          console.log('🔍 validateSession - Fresh client created, trying refresh...');
          const { data: { session }, error } = await freshClient.auth.refreshSession();
          
          if (error) throw error;
          if (!session) throw new Error('No valid session found');
          
          console.log('🔍 validateSession - Fresh client refresh successful!');
          return session;
        }
      } catch (freshErr) {
        console.error('🔍 validateSession - Fresh client also failed:', freshErr);
      }
    }
    
    throw err;
  }
}
