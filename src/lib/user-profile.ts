import { supabase } from './supabase'
import type { Database } from '../../supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export interface CreateProfileData {
  user_id: string
  name: string
  age: number
  height_cm: number
  weight_start_kg: number
  goal: 'lose_weight' | 'maintain' | 'gain_muscle' | 'health'
  dietary_preferences?: string[]
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'
  food_dislikes?: string
  estimated_calories?: number
}

export const userProfile = {
  // Create a new user profile
  async create(data: CreateProfileData): Promise<Profile> {
    if (!supabase) throw new Error('Supabase não configurado')
    
    const profileData: ProfileInsert = {
      ...data,
      onboarding_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) throw error
    return profile
  },

  // Get user profile by user ID
  async getByUserId(userId: string): Promise<Profile | null> {
    if (!supabase) throw new Error('Supabase não configurado')
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      throw error
    }

    return profile
  },

  // Update user profile
  async update(userId: string, updates: Partial<ProfileUpdate>): Promise<Profile> {
    if (!supabase) throw new Error('Supabase não configurado')
    
    const updateData: ProfileUpdate = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return profile
  },

  // Mark onboarding as completed
  async completeOnboarding(userId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase não configurado')
    
    const { error } = await supabase
      .from('profiles')
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      } as ProfileUpdate)
      .eq('user_id', userId)

    if (error) throw error
  },

  // Check if user has completed onboarding
  async hasCompletedOnboarding(userId: string): Promise<boolean> {
    const profile = await this.getByUserId(userId)
    return profile?.onboarding_completed ?? false
  }
}

// Helper function to create profile after signup
export async function createProfileAfterSignup(
  userId: string, 
  userMetadata: { name?: string }
): Promise<void> {
  try {
    // Check if profile already exists
    const existingProfile = await userProfile.getByUserId(userId)
    if (existingProfile) return

    // Create basic profile with default values
    await userProfile.create({
      user_id: userId,
      name: userMetadata.name || 'User',
      age: 25, // Default age
      height_cm: 170, // Default height
      weight_start_kg: 70, // Default weight
      goal: 'maintain', // Default goal
      dietary_preferences: [],
      activity_level: 'moderately_active',
      food_dislikes: undefined
    })
  } catch (error) {
    console.error('Erro ao criar perfil após o signup:', error)
    // Don't throw - profile creation failure shouldn't block signup
  }
}
