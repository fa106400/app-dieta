import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../supabase'

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Client-side Supabase client (SSR-aware browser client only)
export const supabase: SupabaseClient<Database> | null = supabaseUrl && supabaseAnonKey
  ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to validate session before making requests
export async function validateSession() {
  if (!supabase) {
    throw new Error('Supabase client not available')
  }
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('🔍 Session validation error:', error)
    throw error
  }
  
  if (!session) {
    console.error('🔍 No valid session found')
    throw new Error('No valid session found')
  }
  
  return session
}
