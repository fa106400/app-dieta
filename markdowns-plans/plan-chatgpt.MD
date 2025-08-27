# Original content of file plan-chatgpt.MD used to create this markdown file. Below, contains all business and tech information needed:
# System Architecture Specification

## 0) Executive Summary

Build a web SaaS using **Next.js (App Router) + React**, styled with **Tailwind CSS** and **shadcn/ui**, hosted on **Vercel**.
Use **Supabase** for Postgres DB + Auth + Email, and **Stripe** (hosted Checkout) for recurring subscriptions (BRL).
Minimize custom APIs: prefer **direct Supabase access** (client/server) with **Row Level Security (RLS)**, and **Stripe webhooks** on Vercel.

# Business Description & Business Rules

## Business Description

This application is a nutrition and diet management platform designed for users who want to lose weight, maintain weight, or gain muscle mass through structured diet plans. The system provides a catalog of pre-registered diets (low carb, ketogenic, Mediterranean, vegetarian, detox, etc.) with calorie variations. Users can browse these diets, view detailed meal plans, and access features like progress tracking, automated shopping lists, and gamification elements.

The platform monetizes through subscription plans, requiring users to subscribe before accessing any premium features. No free-tier is offered beyond the login screen.

The business differentiates itself by providing:

* A clean and intuitive user experience.
* AI-driven diet recommendations based on the user’s profile.
* Progress tracking with simple visualization tools.
* Gamification elements such as badges and rankings for engagement.
* Practical features like automated shopping lists for weekly preparation.

The first version (MVP) will target Portuguese-speaking users in Brazil, with payments in BRL processed via Stripe.

---

## Business Rules

1. **User Registration & Authentication**

   * Users must register with email and password through Supabase authentication.
   * Profile information required at registration: name, age, weight, height, and main goal (lose weight, maintain, gain muscle, health).
   * Authentication persists via Supabase sessions (JWT-based).

2. **Subscription & Access Control**

   * No free tier: users must subscribe to access any features beyond login/registration.
   * Subscription plans (all automatically recurring via Stripe):

     * Monthly: BRL 29.90
     * Quarterly: BRL 74.70 (equivalent to BRL 24.90/month, renews every 3 months)
     * Semiannual: BRL 119.40 (equivalent to BRL 19.90/month, renews every 6 months)
   * If a subscription is canceled, the user immediately loses access to all features.

3. **Diet Catalog & Recommendation**

   * All diets are pre-registered and stored in the Supabase database.
   * Users can browse diets with filters (e.g., calorie level, dietary restrictions, preferences).
   * An AI recommendation engine suggests the most suitable diet based on the user’s profile and preferences.
   * Users can update their personal data at any time (weight, goals, preferences).
   * However, the AI-generated diet recommendations can only be refreshed **once per week**.
   * This ensures consistency in diet guidance and avoids excessive API calls.

4. **Diet Visualization**

   * Each diet includes daily meal breakdowns with calorie and macronutrient information.
   * Recipes and substitution options are available inside the diet detail view.

5. **Progress Tracking**

   * Users can manually register their weight (weekly or on-demand).
   * The system generates a progress graph based on recorded weights.

6. **Gamification**

   * Users receive badges for milestones (e.g., 7 consecutive days on a plan, completing a month, losing 3kg).
   * Badges are displayed on the user’s profile.
   * Clicking a badge shows all earned and locked badges.

7. **Leaderboard**

   * Public ranking shows most consistent users and those with the most weight lost.
   * Ranking is visible to all subscribed users.

8. **Shopping List (Meal Prep)**

   * A weekly shopping list is automatically generated based on the user’s current diet.
   * The list can be exported as PDF.

9. **General Restrictions**

   * Only one user type exists: regular end-users.
   * No admin dashboard in the MVP. Administrative tasks (diet creation, data checks, etc.) will be done directly in the Supabase database.
   * No file uploads (images, documents) are allowed in the MVP.
   * Only Portuguese language is supported in the MVP.

---

Detailed List of all screens in the system is in the file ./screens-chatgpt.MD

## 1) Tech Stack (Final)

* **Framework:** Next.js (App Router, React 18+)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + shadcn/ui (Radix under the hood)
* **Icons:** lucide-react
* **Build & Lint:** ESLint (Next default), TypeScript. *(Note: Next.js handles build; Vite is **not** used for Next build. We keep ESLint.)*
* **Database:** Supabase Postgres
* **Auth:** Supabase Auth (email/password)
* **Object Storage:** Not used (no uploads in MVP)
* **Payments/Billing:** Stripe (hosted Checkout + Billing)
* **Analytics:** Vercel Analytics (free tier)
* **Emails:** Supabase built-in (SMTP managed by Supabase/Auth)
* **State Management:** Minimal; React state + **Context** where needed. No Redux/Zustand.
* **Data Fetching:** Next.js Server Components + `@supabase/auth-helpers-nextjs`; client-side `@supabase/supabase-js` where appropriate.
* **Validation & Forms:** `react-hook-form` + `zod`
* **Dates:** `date-fns`

---

## 2) Hosting, Build & Deployment

* **Host:** Vercel
* **Build command:** `next build`
* **Runtime:** Edge where feasible (middleware, simple RSC) and Node for webhooks that require it.
* **Environments:** `development`, `preview`, `production` (Vercel defaults)
* **CI/CD:** Vercel Git integration (deploy on push/PR)
* **Analytics:** Enable Vercel Analytics in all envs.

---

## 3) Authentication & Session

* **Provider:** Supabase Auth (email/password only in MVP)
* **Session Persistence:** Supabase Auth cookies via `@supabase/auth-helpers-nextjs`
* **Login flow:** Screen 1.1 posts to Supabase Auth; on success, redirect:

  * `firstLogin` → Onboarding (2.1)
  * otherwise → Home (3.1)
* **Password reset:** Supabase Auth built-in magic link → Screen 1.4

---

## 4) Authorization & Paywall

* **Row Level Security (RLS):** Enabled on all user-owned tables.
* **Public data:** Diet catalog tables are **readable without auth** (or with a safe anon key) but **UI still paywalled**.
* **Paywall policy:** All app features (except Landing, Login/Signup, Plans & Prices, Terms/Privacy, FAQ) require an **active subscription**.
* **Route protection:**

  * **Next.js middleware** checks Supabase Auth session.
  * Server-side check of **active subscription** before rendering protected routes (Diet Catalog, My Week, Shopping List, Ranking, Eu).
  * If not subscribed → redirect to **Plans & Prices (10.1)**.
* **Admin:** None in MVP (no back-office UI). Operational data queries done directly in DB as needed.

---

## 5) Billing (Stripe)

* **Currency:** BRL
* **Plans (Products/Prices in Stripe):**

  * **Monthly:** R\$ 29.90, billed every 1 month, auto-renew
  * **Quarterly:** R\$ 74.70 (equivalent R\$ 24.90/month), billed every 3 months, auto-renew
  * **Semiannual:** R\$ 119.40 (equivalent R\$ 19.90/month), billed every 6 months, auto-renew
* **Checkout:** **Stripe hosted Checkout** (no custom card forms).
* **Trials/Proration:** None in MVP.
* **Cancelation:** Immediate; reflect in DB upon webhook.
* **Webhooks (Vercel Function):**

  * `checkout.session.completed` → create/activate subscription record
  * `customer.subscription.updated` → sync status/period\_end
  * `customer.subscription.deleted` → mark as canceled
  * `invoice.payment_failed` → mark past\_due (gate access)
* **Customer linking:** store `stripe_customer_id` per user.
* **Compliance:** Tax handling N/A for MVP (Brazil taxes handled outside MVP scope).

---

## 6) Data Model (Supabase / Postgres)

> All `user_id` columns reference Supabase `auth.users.id` (UUID).
> Use **RLS** on user-owned tables. Diet catalog tables can be read publicly.

### 6.1 Core Tables

**`profiles`** (user profile & preferences)

* `user_id` (uuid, pk, fk → auth.users)
* `name` (text)
* `age` (int)
* `height_cm` (int)
* `weight_start_kg` (numeric(5,2))
* `goal` (enum: `lose_weight` | `maintain` | `gain_muscle` | `health`)
* `created_at` (timestamptz, default now())
* `updated_at` (timestamptz)

**`subscriptions`**

* `id` (uuid, pk)
* `user_id` (uuid, fk)
* `stripe_customer_id` (text)
* `stripe_subscription_id` (text)
* `plan` (enum: `monthly` | `quarterly` | `semiannual`)
* `status` (text: `active` | `past_due` | `canceled` | `incomplete` …)
* `current_period_start` (timestamptz)
* `current_period_end` (timestamptz)
* `cancel_at_period_end` (bool, default false)
* `created_at` (timestamptz, default now())
* **Rule:** only most recent active row considered for gating.

**`diets`** (catalog)

* `id` (uuid, pk)
* `slug` (text, unique)
* `title` (text)
* `tags` (text\[]) — e.g., `{low_carb, keto, vegetarian}`
* `description` (text)
* `is_public` (bool, default true)

**`diet_variants`** (prebuilt calorie ranges)

* `id` (uuid, pk)
* `diet_id` (uuid, fk → diets)
* `calories_total` (int) — e.g., 1500, 1800, 2200
* `macros` (jsonb) — e.g., `{protein: 120, carbs: 150, fat: 60}`
* `week_plan` (jsonb) — normalized representation: days → meals → items

**`meals`** *(optional if not embedding in `week_plan`)*
If you prefer normalization:

* `id` (uuid, pk)
* `diet_variant_id` (uuid, fk)
* `day_index` (int 0–6)
* `meal_index` (int)
* `title` (text)
* `items` (jsonb)

**`favorites`**

* `user_id` (uuid, pk part)
* `diet_id` (uuid, pk part)
* `created_at` (timestamptz)

**`weights`**

* `id` (uuid, pk)
* `user_id` (uuid, fk)
* `measured_at` (date)
* `weight_kg` (numeric(5,2))
* unique(user\_id, measured\_at)

**`badges`** (catalog)

* `id` (uuid, pk)
* `slug` (text, unique)
* `title` (text)
* `description` (text)
* `criteria` (jsonb) — e.g., `{streak_days:7}`

**`user_badges`**

* `user_id` (uuid, pk part)
* `badge_id` (uuid, pk part)
* `awarded_at` (timestamptz)

**`leaderboards`** *(optional materialized view or table refreshed daily)*

* `id` (uuid, pk)
* `period` (text: `weekly` | `monthly`)
* `metric` (text: `consistency` | `weight_loss_abs` | `weight_loss_pct`)
* `snapshot_at` (date)
* `entries` (jsonb) — top N {alias, value}

**`diet_recommendations`** 

* `id` (uuid, pk) - Unique identifier for the recommendation
* `user_id` (uuid, fk) - ID of the user who received the recommendation
* `diet_id` (uuid, fk) - ID of the suggested diet from the catalog
* `score` (float) - AI-generated compatibility score
* `generated_at` (timestamp) - Timestamp when the recommendation was generated

---

## 7) Row Level Security (RLS) – High Level

* **Enable RLS** on all user-owned tables: `profiles`, `subscriptions`, `favorites`, `weights`, `user_badges`.
* **Policies (examples):**

  * **Select/Insert/Update/Delete** where `auth.uid() = user_id`
  * For `subscriptions`: **Select** where `auth.uid() = user_id` (mutations only via webhooks/service role on server)
  * For public catalog (`diets`, `diet_variants`): `SELECT` allowed to anon (read-only), `INSERT/UPDATE/DELETE` disabled in public role.
* **Service role** (server-only) used in Stripe webhook to write `subscriptions`.

---

## 8) Application Structure (Next.js App Router)

```
/app
  /(public)
    / (Landing - S1)
    /login (1.1)
    /signup (1.2)
    /forgot-password (1.3)
    /reset-password (1.4)
    /plans (10.1)
    /terms (S3)
    /privacy (S3)
    /faq (S2)
  /(app)  [protected + paywalled]
    /home (3.1)
    /diets (4.1)
      /favorites (4.2)
      /[dietSlug] (5.1)
    /my-week (6.1)
    /shopping-list (7.1)
    /ranking (8.1)
    /me (9.1)
      /weight (9.2)
      /badges (9.3)
      /subscription (9.6)
      /profile (9.8)
      /security (9.9)
      /visibility (9.10)
  /api/stripe/webhook (Node runtime)
  /api/healthz
/middleware.ts  (auth + subscription gating)
```

* **Guards:**

  * `(app)` segment requires **Supabase session** AND **active subscription**.
  * If session missing → redirect `/login`
  * If subscription inactive → redirect `/plans`

---

## 9) Payments Flow (End-to-End)

1. User visits `/plans` and selects a plan.
2. Client calls **server action** or simple `/api/create-checkout-session` to create Stripe Checkout Session with:

   * `customer` (create or reuse via `stripe_customer_id`)
   * `mode=subscription`
   * `price` = corresponding Price ID
   * `success_url` = `/home?checkout=success`
   * `cancel_url` = `/plans?checkout=canceled`
3. Stripe Checkout hosted page handles payment.
4. Stripe **webhook** on `/api/stripe/webhook`:

   * Verifies signature
   * On `checkout.session.completed`:

     * Persist/attach `stripe_customer_id`
   * On `customer.subscription.created/updated`:

     * Upsert record in `subscriptions` with status, plan, current period
   * On `customer.subscription.deleted`:

     * Mark as `canceled`
   * On `invoice.payment_failed`:

     * Mark as `past_due` (UI gating will redirect to `/plans`)
5. UI gating reads `subscriptions` to grant/deny access.

---

## 10) “Matching” (Diet Recommendations)

* Implemented server-side (RSC) or via API route using:

  * User profile `goal`, onboarding preferences, and `tags` on `diets`
  * Simple scoring/filtering; explainability via “Why suggested” component
* No external AI calls required in MVP (catalog-driven).

---

## 11) Caching & Performance

* **Public catalog pages** (`/diets`, `/[dietSlug]`) can use ISR or simple `no-store` (choose clarity first).
* **User-specific pages**: no cache; fetch with session-aware Supabase client.
* **Images/Uploads:** none in MVP.

---

## 12) Analytics, Logging, Error Handling

* **Analytics:** Vercel Analytics enabled.
* **Client errors:** basic toast + fallback UI.
* **Webhook logging:** log Stripe events to console (Vercel logs) and optionally a `webhook_logs` table (MVP optional).
* **Health check:** `/api/healthz` returns `{ ok: true }`.

---

## 13) Emails

* **Source:** Supabase Auth (verification, reset password).
* **Transactional (receipts):** handled by Stripe automatically (customer email set in Checkout).
* **No additional ESP** (Resend/SendGrid) in MVP.

---

## 14) Environment Variables (Vercel)

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # server only (webhooks)
# Stripe
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_QUARTERLY=price_...
STRIPE_PRICE_SEMIANNUAL=price_...
# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

* **Security:** `SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` must be server-only.

---

## 15) UI Library & Patterns

* **shadcn/ui** for inputs, forms, modals, toasts, tables.
* **Tailwind CSS** utility-first; responsive layouts.
* **react-hook-form + zod** for form validation.
* **Accessibility:** follow Radix/shadcn defaults.

---

## 16) Non-Functional Requirements

* **Performance:** Fast TTFB on Vercel; minimal JS on client.
* **Privacy:** Clear Terms/Privacy pages; non-prescriptive legal notice.
* **Availability:** Rely on Vercel/Supabase SLAs.
* **Scalability:** Catalog reads are light; user writes small (weights, favorites).

---

## 17) Out of Scope (MVP)

* Admin panel
* File uploads
* Social logins
* Trials, coupons, proration
* Automated tests (unit/e2e)
* i18n (Portuguese only)
* Complex AI generation (beyond rules/matching)

---

## 18) Acceptance Criteria (High-Level)

* Users can sign up, log in, reset password (Supabase).
* Paywall enforced: no access to protected routes without **active** subscription.
* Stripe checkout works for **monthly**, **quarterly**, **semiannual**; webhooks keep DB in sync.
* Users can browse diet catalog, select a diet, view “My Week”, generate Shopping List (PDF), record weight, see badges (incl. toasts), and view a mocked Ranking.
* Vercel Analytics active; no runtime secrets exposed to client.

---
