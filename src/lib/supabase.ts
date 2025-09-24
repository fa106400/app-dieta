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
    console.error('Supabase environment variables não disponíveis')
    return null
  }
  
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Helper function to validate session before making requests
export async function validateSession() {
  if (!supabase) {
    console.error('Supabase client não disponível');
    throw new Error('Supabase client não disponível')
  }
  
  // NEW APPROACH: Skip getSession() entirely and try refreshSession() first
  try {
    // Try refreshSession first - this is more reliable after browser minimization
    const refreshPromise = supabase.auth.refreshSession();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout de refresh de sessão após 5 segundos')), 5000)
    );
    
    const result = await Promise.race([refreshPromise, timeoutPromise]) as { data: { session: Session | null }, error: Error | null };
    
    const { data: { session }, error } = result;
    
    if (error) {
      console.error('Erro ao refreshar sessão:', error);
      console.error('Detalhes do erro:', {
        message: error.message
      });
      throw error
    }
    
    if (!session) {
      console.error('Nenhuma sessão válida após o refresh');
      throw new Error('Nenhuma sessão válida encontrada')
    }
    
    return session
  } catch (err) {
    console.error('Refresh falhou, tentando getSession como fallback:', err);
    
    // If refresh fails, try getSession as fallback
    try {
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout de get de sessão após 3 segundos')), 3000)
      );
      
      const result = await Promise.race([sessionPromise, timeoutPromise]) as { data: { session: Session | null }, error: Error | null };
      const { data: { session }, error } = result;
      
      if (error) throw error;
      if (!session) throw new Error('Nenhuma sessão válida encontrada');
      
      return session;
    } catch (fallbackErr) {
      console.error('Refresh and getSession falharam:', fallbackErr);
      
      // Final fallback: create fresh client and try refresh
      try {
        const freshClient = createFreshSupabaseClient();
        if (freshClient) {
          const { data: { session }, error } = await freshClient.auth.refreshSession();
          
          if (error) throw error;
          if (!session) throw new Error('Nenhuma sessão válida encontrada');
          
          return session;
        }
      } catch (freshErr) {
        console.error('Fresh client também falhou:', freshErr);
      }
    }
    
    throw err;
  }
}
