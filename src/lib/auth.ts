import { supabase } from './supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | null
}

export interface SignUpData {
  email: string
  password: string
  name?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface PasswordResetData {
  email: string
}

export interface PasswordUpdateData {
  password: string
}

// Authentication functions
export const auth = {
  // Sign up with email/password
  async signUp({ email, password, name }: SignUpData) {
    
    if (!supabase) {
      console.error('Supabase não configurado!')
      throw new Error('Supabase não configurado')
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0]
        }
      }
    })
    
    if (error) {
      console.error('Erro ao cadastrar usuário:', error)
      throw error
    }
    return data
  },

  // Sign in with email/password
  async signIn({ email, password }: SignInData) {
    if (!supabase) throw new Error('Supabase não configurado')
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    if (!supabase) throw new Error('Supabase não configurado')
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Send password reset email
  async resetPassword({ email }: PasswordResetData) {
    if (!supabase) throw new Error('Supabase não configurado')
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    
    if (error) throw error
  },

  // Update password (for reset password flow)
  async updatePassword({ password }: PasswordUpdateData) {
    if (!supabase) throw new Error('Supabase não configurado')
    
    const { error } = await supabase.auth.updateUser({
      password
    })
    
    if (error) throw error
  },

  // Get current session
  async getSession() {
    if (!supabase) throw new Error('Supabase não configurado')
    
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  // Get current user
  async getUser() {
    if (!supabase) throw new Error('Supabase não configurado')
    
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    if (!supabase) throw new Error('Supabase não configurado')
    
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Session management utilities
export const sessionUtils = {
  // Check if user is authenticated
  isAuthenticated(session: Session | null): boolean {
    return !!session?.user
  },

  // Check if session is expired
  isSessionExpired(session: Session | null): boolean {
    if (!session) return true
    const expiresAt = session.expires_at
    if (!expiresAt) return true
    return new Date(expiresAt * 1000) < new Date()
  },

  // Get user ID from session
  getUserId(session: Session | null): string | null {
    return session?.user?.id || null
  },

  // Get user email from session
  getUserEmail(session: Session | null): string | null {
    return session?.user?.email || null
  }
}

// Cookie utilities for server-side auth
export const cookieUtils = {
  // Extract access token from cookies
  getAccessToken(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null
    
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      if (key && value) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, string>)
    
    // Try multiple possible cookie names for Supabase
    const accessToken = cookies['sb-access-token'] || 
                       cookies['sb-access-token.0'] || 
                       cookies['sb-access-token.1'] ||
                       cookies['access_token']
    
    return accessToken
  },

  // Extract refresh token from cookies
  getRefreshToken(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null
    
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      if (key && value) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, string>)
    
    // Try multiple possible cookie names for Supabase
    const refreshToken = cookies['sb-refresh-token'] || 
                        cookies['sb-refresh-token.0'] || 
                        cookies['sb-refresh-token.1'] ||
                        cookies['refresh_token']
    
    return refreshToken
  }
}
