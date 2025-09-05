'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { auth, sessionUtils } from '@/lib/auth'
import { createProfileAfterSignup } from '@/lib/user-profile'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import type { SignUpData, SignInData, PasswordResetData, PasswordUpdateData } from '@/lib/auth'

export interface UseAuthReturn {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | null
  signUp: (data: SignUpData) => Promise<void>
  signIn: (data: SignInData) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (data: PasswordResetData) => Promise<void>
  updatePassword: (data: PasswordUpdateData) => Promise<void>
  isAuthenticated: boolean
  isSessionExpired: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
  
      try {
        setLoading(true)
        
        // Check if Supabase is configured
        if (!supabase) {
      
          setError(new Error('Supabase not configured') as AuthError)
          setLoading(false)
          return
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
        
            setSession(session)
            setUser(session?.user ?? null)
            
            // Create profile after successful signup
            if (event === 'SIGNED_IN' && session?.user) {
          
              try {
                await createProfileAfterSignup(
                  session.user.id,
                  session.user.user_metadata
                )
              } catch (error) {
            
                console.error('Error creating profile after signup:', error)
              } finally {
                setLoading(false)
              }
            }

            setLoading(false)
          }
        )

        // Safety timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          if (loading) {
            setLoading(false);
          }
        }, 5000); // 5 second timeout

        return () => {
          subscription.unsubscribe()
          clearTimeout(timeoutId)
        }
      } catch (err) {
        console.error('useAuth signUp error:', err)
        setError(err as AuthError)
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Sign up function
  const signUp = useCallback(async (data: SignUpData) => {
    try {
      console.log('useAuth signUp called with:', data)
      console.log('Supabase client available:', !!supabase)
      setError(null)
      setLoading(true)
      await auth.signUp(data)
    } catch (err) {
      console.error('useAuth signUp error:', err)
      setError(err as AuthError)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Sign in function
  const signIn = useCallback(async (data: SignInData) => {
    try {
      setError(null)
      setLoading(true)
      await auth.signIn(data)
    } catch (err) {
      setError(err as AuthError)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      await auth.signOut()
      setUser(null)
      setSession(null)
    } catch (err) {
      setError(err as AuthError)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Reset password function
  const resetPassword = useCallback(async (data: PasswordResetData) => {
    try {
      setError(null)
      setLoading(true)
      await auth.resetPassword(data)
    } catch (err) {
      setError(err as AuthError)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update password function
  const updatePassword = useCallback(async (data: PasswordUpdateData) => {
    try {
      setError(null)
      setLoading(true)
      await auth.updatePassword(data)
    } catch (err) {
      setError(err as AuthError)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: sessionUtils.isAuthenticated(session),
    isSessionExpired: sessionUtils.isSessionExpired(session)
  }
}
