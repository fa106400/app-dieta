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

        // Prime state with existing session to avoid flicker/redirects
        const { data: sessionData, error: getSessionError } = await supabase.auth.getSession()
        if (getSessionError) {
          console.error('🔍 Error getting session:', getSessionError)
          setError(getSessionError as AuthError)
        }
        
        console.log('🔍 Initial session check:', sessionData.session ? 'Session found' : 'No session')
        setSession(sessionData.session ?? null)
        setUser(sessionData.session?.user ?? null)

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('🔍 Auth state change:', event, session ? 'Session present' : 'No session')
            
            setSession(session)
            setUser(session?.user ?? null)
            
            // Handle session expiration
            if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
              console.log('🔍 Session event:', event)
            }
            
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
          console.log('🔍 Auth initialization timeout reached')
          setLoading(false)
        }, 5000)
        
        // Add visibility change handler to refresh session when browser regains focus
        const handleVisibilityChange = async () => {
          if (document.visibilityState === 'visible' && supabase) {
            console.log('🔍 Browser regained focus, refreshing session...')
            try {
              const { data: sessionData, error } = await supabase.auth.getSession()
              if (error) {
                console.error('🔍 Error refreshing session:', error)
              } else {
                console.log('🔍 Session refreshed:', sessionData.session ? 'Valid' : 'Invalid')
                setSession(sessionData.session ?? null)
                setUser(sessionData.session?.user ?? null)
              }
            } catch (err) {
              console.error('🔍 Error during session refresh:', err)
            }
          }
        }
        
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
          subscription.unsubscribe()
          clearTimeout(timeoutId)
          document.removeEventListener('visibilitychange', handleVisibilityChange)
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
