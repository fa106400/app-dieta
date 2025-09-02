export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      badges: {
        Row: {
          category: string | null
          created_at: string | null
          criteria: Json
          description: string
          icon_name: string | null
          id: string
          slug: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          criteria: Json
          description: string
          icon_name?: string | null
          id?: string
          slug: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          criteria?: Json
          description?: string
          icon_name?: string | null
          id?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      diet_recommendations: {
        Row: {
          diet_id: string
          generated_at: string | null
          id: string
          last_refreshed: string | null
          reasoning: string | null
          score: number
          user_id: string
        }
        Insert: {
          diet_id: string
          generated_at?: string | null
          id?: string
          last_refreshed?: string | null
          reasoning?: string | null
          score: number
          user_id: string
        }
        Update: {
          diet_id?: string
          generated_at?: string | null
          id?: string
          last_refreshed?: string | null
          reasoning?: string | null
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diet_recommendations_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diet_catalog_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_recommendations_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diets"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_variants: {
        Row: {
          calories_total: number
          created_at: string | null
          diet_id: string
          id: string
          macros: Json
          week_plan: Json
        }
        Insert: {
          calories_total: number
          created_at?: string | null
          diet_id: string
          id?: string
          macros: Json
          week_plan: Json
        }
        Update: {
          calories_total?: number
          created_at?: string | null
          diet_id?: string
          id?: string
          macros?: Json
          week_plan?: Json
        }
        Relationships: [
          {
            foreignKeyName: "diet_variants_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diet_catalog_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_variants_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diets"
            referencedColumns: ["id"]
          },
        ]
      }
      diets: {
        Row: {
          category: string
          created_at: string | null
          description: string
          difficulty: string | null
          duration_weeks: number | null
          id: string
          is_public: boolean | null
          popularity_score: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          difficulty?: string | null
          duration_weeks?: number | null
          id?: string
          is_public?: boolean | null
          popularity_score?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          difficulty?: string | null
          duration_weeks?: number | null
          id?: string
          is_public?: boolean | null
          popularity_score?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          diet_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          diet_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          diet_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diet_catalog_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diets"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_metrics: {
        Row: {
          created_at: string | null
          entries: Json
          id: string
          metric: string
          period: string
          snapshot_at: string
        }
        Insert: {
          created_at?: string | null
          entries: Json
          id?: string
          metric: string
          period: string
          snapshot_at: string
        }
        Update: {
          created_at?: string | null
          entries?: Json
          id?: string
          metric?: string
          period?: string
          snapshot_at?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          calories: number
          created_at: string | null
          day_index: number
          description: string | null
          diet_variant_id: string
          id: string
          ingredients: Json
          macros: Json
          meal_index: number
          meal_type: string | null
          title: string
        }
        Insert: {
          calories: number
          created_at?: string | null
          day_index: number
          description?: string | null
          diet_variant_id: string
          id?: string
          ingredients: Json
          macros: Json
          meal_index: number
          meal_type?: string | null
          title: string
        }
        Update: {
          calories?: number
          created_at?: string | null
          day_index?: number
          description?: string | null
          diet_variant_id?: string
          id?: string
          ingredients?: Json
          macros?: Json
          meal_index?: number
          meal_type?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_diet_variant_id_fkey"
            columns: ["diet_variant_id"]
            isOneToOne: false
            referencedRelation: "diet_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number
          created_at: string | null
          dietary_preferences: string[] | null
          food_dislikes: string | null
          goal: string
          height_cm: number
          name: string
          onboarding_completed: boolean | null
          updated_at: string | null
          user_id: string
          weight_start_kg: number
        }
        Insert: {
          activity_level?: string | null
          age: number
          created_at?: string | null
          dietary_preferences?: string[] | null
          food_dislikes?: string | null
          goal: string
          height_cm: number
          name: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
          user_id: string
          weight_start_kg: number
        }
        Update: {
          activity_level?: string | null
          age?: number
          created_at?: string | null
          dietary_preferences?: string[] | null
          food_dislikes?: string | null
          goal?: string
          height_cm?: number
          name?: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
          user_id?: string
          weight_start_kg?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string | null
          badge_id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string | null
          badge_id: string
          user_id: string
        }
        Update: {
          awarded_at?: string | null
          badge_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_current_diet: {
        Row: {
          diet_id: string
          diet_variant_id: string
          id: string
          is_active: boolean | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          diet_id: string
          diet_variant_id: string
          id?: string
          is_active?: boolean | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          diet_id?: string
          diet_variant_id?: string
          id?: string
          is_active?: boolean | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_current_diet_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diet_catalog_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_current_diet_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_current_diet_diet_variant_id_fkey"
            columns: ["diet_variant_id"]
            isOneToOne: false
            referencedRelation: "diet_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_meal_log: {
        Row: {
          completed: boolean | null
          created_at: string | null
          date: string
          diet_id: string
          id: string
          meal_id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          date: string
          diet_id: string
          id?: string
          meal_id: string
          notes?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          date?: string
          diet_id?: string
          id?: string
          meal_id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_meal_log_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diet_catalog_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_meal_log_diet_id_fkey"
            columns: ["diet_id"]
            isOneToOne: false
            referencedRelation: "diets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_meal_log_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_metrics: {
        Row: {
          adherence_percentage: number | null
          created_at: string | null
          id: string
          meals_completed: number | null
          period_end: string
          period_start: string
          total_meals: number | null
          user_id: string
          weight_lost_kg: number | null
        }
        Insert: {
          adherence_percentage?: number | null
          created_at?: string | null
          id?: string
          meals_completed?: number | null
          period_end: string
          period_start: string
          total_meals?: number | null
          user_id: string
          weight_lost_kg?: number | null
        }
        Update: {
          adherence_percentage?: number | null
          created_at?: string | null
          id?: string
          meals_completed?: number | null
          period_end?: string
          period_start?: string
          total_meals?: number | null
          user_id?: string
          weight_lost_kg?: number | null
        }
        Relationships: []
      }
      weights: {
        Row: {
          created_at: string | null
          id: string
          measured_at: string
          user_id: string
          weight_kg: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          measured_at: string
          user_id: string
          weight_kg: number
        }
        Update: {
          created_at?: string | null
          id?: string
          measured_at?: string
          user_id?: string
          weight_kg?: number
        }
        Relationships: []
      }
    }
    Views: {
      diet_catalog_view: {
        Row: {
          category: string | null
          description: string | null
          difficulty: string | null
          duration_weeks: number | null
          id: string | null
          max_calories: number | null
          min_calories: number | null
          popularity_score: number | null
          slug: string | null
          tags: string[] | null
          title: string | null
          variant_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_user_metrics: {
        Args: { p_end_date: string; p_start_date: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
