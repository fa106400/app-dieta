import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { NextRequest, NextResponse } from 'next/server'
import type { Database } from '../../supabase'

type CookieOptions = {
  domain?: string
  path?: string
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'lax' | 'strict' | 'none'
  maxAge?: number
  expires?: Date
}

export function createRouteSupabaseClient(
  req: NextRequest,
  res: NextResponse
): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) return null

  const client = (createServerClient as unknown as (
    u: string,
    k: string,
    o: unknown
  ) => SupabaseClient<Database>)(url, anon, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          res.cookies.set({ name, value, ...options })
        } catch {
          // noop
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          res.cookies.set({ name, value: '', ...options, maxAge: 0 })
        } catch {
          // noop
        }
      },
    } as unknown,
  })

  return client as SupabaseClient<Database>
}


