import { NextResponse } from 'next/server'

// With @supabase/ssr, session cookies are auto-managed. Keep endpoint for compatibility.
export async function POST() {
  return NextResponse.json({ ok: true })
}
