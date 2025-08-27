// Central database types mirroring Supabase schema (public schema)

export type Goal = 'lose_weight' | 'maintain' | 'gain_muscle' | 'health'
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'
export type PlanInterval = 'monthly' | 'quarterly' | 'semiannual'
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing'
export type DietDifficulty = 'beginner' | 'intermediate' | 'advanced'

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
          goal: Goal
          dietary_preferences: string[]
          activity_level: ActivityLevel | null
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
          goal: Goal
          dietary_preferences?: string[]
          activity_level?: ActivityLevel | null
          food_dislikes?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Database['public']['Tables']['profiles']['Row'], 'user_id'>> & {
          user_id?: string
        }
      }

      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: PlanInterval
          status: SubscriptionStatus
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['subscriptions']['Row']>
      }

      diets: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          tags: string[]
          category: string
          difficulty: DietDifficulty | null
          duration_weeks: number | null
          popularity_score: number
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['diets']['Row']> & {
          slug: string
          title: string
          description: string
        }
        Update: Partial<Database['public']['Tables']['diets']['Row']>
      }

      diet_variants: {
        Row: {
          id: string
          diet_id: string
          calories_total: number
          macros: Record<string, number>
          week_plan: unknown
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['diet_variants']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['diet_variants']['Row']>
      }

      meals: {
        Row: {
          id: string
          diet_variant_id: string
          day_index: number
          meal_index: number
          title: string
          description: string | null
          ingredients: unknown
          macros: Record<string, number>
          calories: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['meals']['Row'], 'id' | 'created_at' | 'description' | 'meal_type'> & {
          id?: string
          description?: string | null
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['meals']['Row']>
      }

      favorites: {
        Row: {
          user_id: string
          diet_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['favorites']['Row']>
      }

      user_current_diet: {
        Row: {
          id: string
          user_id: string
          diet_id: string
          diet_variant_id: string
          started_at: string
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['user_current_diet']['Row'], 'id' | 'started_at' | 'is_active'> & {
          id?: string
          started_at?: string
          is_active?: boolean
        }
        Update: Partial<Database['public']['Tables']['user_current_diet']['Row']>
      }

      user_meal_log: {
        Row: {
          id: string
          user_id: string
          diet_id: string
          meal_id: string
          date: string
          completed: boolean
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_meal_log']['Row'], 'id' | 'created_at' | 'notes' | 'completed'> & {
          id?: string
          notes?: string | null
          completed?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['user_meal_log']['Row']>
      }

      weights: {
        Row: {
          id: string
          user_id: string
          measured_at: string
          weight_kg: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['weights']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['weights']['Row']>
      }

      badges: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          icon_name: string | null
          criteria: unknown
          category: 'consistency' | 'milestone' | 'achievement' | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['badges']['Row'], 'id' | 'created_at' | 'icon_name' | 'category'> & {
          id?: string
          icon_name?: string | null
          category?: 'consistency' | 'milestone' | 'achievement' | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['badges']['Row']>
      }

      user_badges: {
        Row: {
          user_id: string
          badge_id: string
          awarded_at: string
        }
        Insert: Database['public']['Tables']['user_badges']['Row']
        Update: Partial<Database['public']['Tables']['user_badges']['Row']>
      }

      diet_recommendations: {
        Row: {
          id: string
          user_id: string
          diet_id: string
          score: number
          reasoning: string | null
          generated_at: string
          last_refreshed: string
        }
        Insert: Omit<Database['public']['Tables']['diet_recommendations']['Row'], 'id' | 'generated_at' | 'last_refreshed' | 'reasoning'> & {
          id?: string
          reasoning?: string | null
          generated_at?: string
          last_refreshed?: string
        }
        Update: Partial<Database['public']['Tables']['diet_recommendations']['Row']>
      }

      leaderboard_metrics: {
        Row: {
          id: string
          period: 'weekly' | 'monthly'
          metric: 'consistency' | 'weight_loss_abs' | 'weight_loss_pct'
          snapshot_at: string
          entries: unknown
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['leaderboard_metrics']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['leaderboard_metrics']['Row']>
      }

      user_metrics: {
        Row: {
          id: string
          user_id: string
          period_start: string
          period_end: string
          adherence_percentage: number | null
          weight_lost_kg: number | null
          meals_completed: number
          total_meals: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_metrics']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['user_metrics']['Row']>
      }
    }
  }
}

// Convenience entity types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Diet = Database['public']['Tables']['diets']['Row']
export type DietVariant = Database['public']['Tables']['diet_variants']['Row']
export type Meal = Database['public']['Tables']['meals']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type CurrentDiet = Database['public']['Tables']['user_current_diet']['Row']
export type MealLog = Database['public']['Tables']['user_meal_log']['Row']
export type Weight = Database['public']['Tables']['weights']['Row']
export type Badge = Database['public']['Tables']['badges']['Row']
export type UserBadge = Database['public']['Tables']['user_badges']['Row']
export type DietRecommendation = Database['public']['Tables']['diet_recommendations']['Row']
export type LeaderboardMetrics = Database['public']['Tables']['leaderboard_metrics']['Row']
export type UserMetrics = Database['public']['Tables']['user_metrics']['Row']


