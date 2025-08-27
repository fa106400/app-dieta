import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase: SupabaseClient<Database> = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Server-side Supabase client (for API routes)
export const createServerSupabaseClient = (): SupabaseClient<Database> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Database types (will be generated from Supabase)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          name: string
          age: number
          height_cm: number
          weight_start_kg: number
          goal: 'lose_weight' | 'maintain' | 'gain_muscle' | 'health'
          dietary_preferences: string[]
          activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | null
          food_dislikes: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          age: number
          height_cm: number
          weight_start_kg: number
          goal: 'lose_weight' | 'maintain' | 'gain_muscle' | 'health'
          dietary_preferences?: string[]
          activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | null
          food_dislikes?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          name?: string
          age?: number
          height_cm?: number
          weight_start_kg?: number
          goal?: 'lose_weight' | 'maintain' | 'gain_muscle' | 'health'
          dietary_preferences?: string[]
          activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | null
          food_dislikes?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      diets: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          tags: string[]
          category: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          duration_weeks: number | null
          popularity_score: number
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          tags?: string[]
          category: string
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          duration_weeks?: number | null
          popularity_score?: number
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          tags?: string[]
          category?: string
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          duration_weeks?: number | null
          popularity_score?: number
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: 'monthly' | 'quarterly' | 'semiannual'
          status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing'
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan: 'monthly' | 'quarterly' | 'semiannual'
          status?: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'monthly' | 'quarterly' | 'semiannual'
          status?: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
