import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes do not require authentication
const publicRoutes: string[] = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/plans',
  '/terms',
  '/privacy',
  '/faq',
  '/api/healthz'
]

// Routes intended for authenticated users should redirect away if already logged in
const authOnlyLandingRoutes: string[] = ['/login', '/signup', '/forgot-password', '/reset-password']

// Prefix considered protected (app area)
const protectedPrefix = '/(app)'

function isPublicPath(pathname: string): boolean {
  return publicRoutes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function isAuthLandingPath(pathname: string): boolean {
  return authOnlyLandingRoutes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Read Supabase cookies (presence implies session).
  // These names are set by supabase-js/auth helpers.
  const hasAccessToken = Boolean(req.cookies.get('sb-access-token')?.value)

  const isProtected = pathname.startsWith('/(app)')
  const isPublic = isPublicPath(pathname)
  const isAuthLanding = isAuthLandingPath(pathname)

  // Gate protected routes by auth
  if (isProtected && !hasAccessToken) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // If already logged in, keep users away from auth pages to app home
  if (hasAccessToken && isAuthLanding) {
    const url = req.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  // Public routes pass through
  if (isPublic) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Run on everything in app, plus auth/public pages we care about
    '/((public|app).*)',
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/plans',
    '/terms',
    '/privacy',
    '/faq',
    '/api/healthz'
  ]
}


