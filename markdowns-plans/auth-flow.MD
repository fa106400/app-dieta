### What each file is for

- **`src/contexts/AuthContext.tsx`**
  - Provides a global React Context with `{ user, session, loading, isAuthenticated, error, signIn, signUp, signOut }`.
  - Wraps the whole app in `AuthProvider` (via `src/app/layout.tsx`) so any component can read auth state.

- **`src/hooks/useAuth.ts`**
  - Single source of truth for client-side auth state.
  - Creates the Supabase client, loads the initial session, subscribes to `onAuthStateChange`, and exposes actions (`signIn`, `signUp`, `signOut`, `resetPassword`, `updatePassword`).
  - Persists and updates `user`, `session`, `loading`, `error`.
  - Calls profile helpers (e.g., `createProfileAfterSignup`) after successful sign-in/sign-up.

- **`src/components/auth/ProtectedRoute.tsx`**
  - Wrapper to guard app pages. If `loading` → show spinner; if `!isAuthenticated` → redirect to `/login`; else render children.
  - Used by private pages like `/(app)/profile/page.tsx`.

- **`src/components/auth/PublicRoute.tsx`**
  - Wrapper for public auth pages. If `isAuthenticated` → redirect to the app (e.g., `/home`); else render children.
  - Used by `/(public)/login`, `/(public)/signup`, etc.

- **`src/components/auth/AuthStatus.tsx`**
  - Small UI component that reads `AuthContext` and displays current auth info (email, status). Useful for debugging or a user-menu badge.

- **`src/app/api/auth/me/route.ts` (and related API routes)**
  - Server endpoints used by the UI to read/update auth-related data.
  - `GET /api/auth/me`: verifies the access token from cookies, loads user + profile from Supabase, returns 401 if missing/invalid.
  - `PUT /api/auth/me`: updates user metadata and profile.
  - Also relevant: `POST /api/auth/logout`, `POST /api/auth/refresh`, and (optionally) `GET /api/auth/status`.

- **`src/lib/auth.ts`**
  - Thin wrapper around Supabase auth methods for the client UI and API routes.
  - Centralizes cookie/session helpers (`cookieUtils`, `sessionUtils`) and common error handling.

- **`src/lib/user-profile.ts`**
  - Profile CRUD utilities (get/create/update). Called from `useAuth` after sign-in to ensure a profile exists.

- **`src/lib/supabase.ts`**
  - Creates Supabase clients (browser and server) using env vars; returns `null` safely if misconfigured.

- **`middleware.ts`**
  - Runs on every request (server-side) before a route is handled.
  - Can gate paths by reading cookies and redirect unauthenticated users away from protected routes.
  - Complements, but doesn’t replace, `ProtectedRoute` (middleware protects at the edge; `ProtectedRoute` protects in the client).

### How they relate

- `AuthProvider` (from `AuthContext.tsx`) wraps the app in `layout.tsx` → inside, `useAuth` manages real-time session state → components read that state via `useAuthContext`.
- Route wrappers (`ProtectedRoute` and `PublicRoute`) read the context to decide render vs redirect.
- Pages/components call API routes (e.g., `/api/auth/me`) to fetch/update server data; those API routes use server-side Supabase and cookie parsing.
- `middleware.ts` can early-redirect before page code runs, enforcing protection even on first SSR hit.

### Execution order: user signs in (from `/login`)

1. Request to `/login`:
   - Middleware runs first. Since it’s a public route, it allows the request.
   - The page renders inside `AuthProvider`.
2. On first render:
   - `useAuth` runs its effect:
     - Initializes Supabase, calls `supabase.auth.getSession()`, sets `{user, session}` if present.
     - Subscribes to `onAuthStateChange`.
3. User submits the login form:
   - UI calls `signIn` from `useAuth` (via `AuthContext`), which uses `src/lib/auth.ts` → `supabase.auth.signInWithPassword`.
   - Supabase establishes a session (client-side) and triggers `onAuthStateChange('SIGNED_IN')`.
4. `useAuth` subscriber handles `'SIGNED_IN'`:
   - Updates `session`/`user`, sets `isAuthenticated: true`.
   - Calls `createProfileAfterSignup` (from `src/lib/user-profile.ts`) if needed.
   - Finishes `loading: false`.
5. Route wrapper behavior:
   - Because `/login` uses `PublicRoute`, it detects `isAuthenticated: true` and redirects the user to the app (e.g., `/home`).
6. The app may fetch user data:
   - Client components or effects call `GET /api/auth/me` to load the latest user + profile.
   - That route reads cookies/token and returns 200 with profile or 401 if missing.

Notes:
- If cookies are not present server-side, API routes will return 401 even if the client has a session in memory. Ensure the sign-in flow sets the expected cookies or the client includes the header-based token when calling server routes. Your `cookieUtils`/`sessionUtils` are responsible for bridging this.

### Execution order: user visits a protected page like `/profile`

1. Request to `/profile`:
   - Middleware runs:
     - If it detects no valid auth cookies/token, it redirects to `/login` immediately (server-side).
     - Otherwise it allows the request.
2. Page render:
   - Wrapped with `ProtectedRoute`. It reads `AuthContext`:
     - If `loading` → show a loader.
     - If `!isAuthenticated` (e.g., user reloaded and client hasn’t restored session yet) → temporary loader, then redirect to `/login` if session remains missing.
     - If `isAuthenticated` → render page.
3. Data fetching:
   - The page calls `GET /api/auth/me` to load profile/settings.
   - The API route validates the cookie access token and returns data; on 401, the page can redirect or show a re-auth prompt.

### Why you’re seeing 401s now

- The screenshot/terminal shows `GET /api/auth/me 401` with “No access token found” and the only cookie present is `__next_hmr_refresh_hash__`. That means server-side requests are missing Supabase auth cookies. The client appears logged-in (context shows `user: Present`) but the server doesn’t see a token.

Typical causes:
- The Supabase auth session is only in localStorage (client) but not mirrored to HTTP-only cookies for API routes.
- Cookies domain/path or `SameSite` attributes prevent them from being sent.
- Custom cookie-sync in `sessionUtils` isn’t being called on sign-in.
- Calling the API route from a different origin/port, or `fetch` missing `credentials: 'include'`.

Quick checks:
- Ensure your sign-in flow writes the access token to cookies that your API routes read (or add an Authorization header to those calls).
- Ensure `fetch('/api/auth/me', { credentials: 'include' })` on the client.
- Verify `middleware.ts` and API routes agree on cookie names.
- If you want automatic cookie management, consider `@supabase/ssr` helpers for Next App Router.

If you want, I can inspect `lib/auth.ts` and the API route to line up cookie names and add a tiny client helper to always include credentials on API requests.