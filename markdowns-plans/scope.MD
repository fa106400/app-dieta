# Revised Development Plan for Nutrition & Diet Management SaaS

## Executive Summary

This plan outlines the development of a complete nutrition and diet management platform using Next.js, Supabase, and Stripe, optimized for solo development with Google Gemini 2.0 Flash API integration. The application will feature user authentication, diet catalog browsing, AI-powered recommendations, progress tracking, gamification, and subscription management.

## Development Phases Overview

### Phase 1: Foundation & Infrastructure (Weeks 1-2)
### Phase 2: Core Authentication & User Management (Weeks 3-4)  
### Phase 3: Diet Catalog & AI Recommendations (Weeks 5-7)
### Phase 4: User Experience & Progress Tracking (Weeks 8-10)
### Phase 5: Subscription & Payment Integration (Weeks 11-12)
### Phase 6: Gamification & Advanced Features (Weeks 13-14)
### Phase 7: Testing, Polish & Deployment (Weeks 15-16)

---

## Phase 1: Foundation & Infrastructure (Weeks 1-2)

### 1.1 Project Setup & Configuration
- **Next.js 14+ Project Initialization** ✅ **COMPLETE**
  - App Router configuration ✅
  - TypeScript setup with strict mode ✅
  - ESLint and Prettier configuration ✅
  - Tailwind CSS + shadcn/ui installation ✅
  - Environment variables setup ✅

- **Database Design & Setup** ✅ **COMPLETE**
  - Supabase project creation (free tier) ✅
  - Database schema implementation (all tables from spec) ✅
  - Row Level Security (RLS) policies ✅
  - Initial data seeding (diet catalog, badges) ✅
  - Database migrations and versioning ✅

- **Development Environment** ✅ **COMPLETE**
  - Git repository setup with conventional commits ✅
  - Development and staging environment configuration ✅
  - Local development with Supabase CLI ✅ (optional)
  - Hot reload and debugging setup ✅

### 1.2 Core Architecture Implementation
- **Project Structure Setup** ✅ **COMPLETE**
  ```
  /app
    /(public) - Landing, auth, plans
    /(app) - Protected app routes
    /api - API routes and webhooks
  /components - Reusable UI components
  /lib - Utilities, types, constants
  /contexts - React contexts
  /hooks - Custom React hooks
  ```

- **Type Definitions** ✅ **COMPLETE**
  - Complete TypeScript interfaces for all data models ✅
  - API response types ✅ (to be expanded per endpoint as built)
  - Component prop types ✅ (baseline, expand as components are added)
  - Database schema types ✅ (`src/types/database.ts` and typed Supabase client)

- **Middleware Implementation** ✅ **COMPLETE**
  - Authentication middleware ✅ (`middleware.ts`)
  - Subscription gating middleware ✅ (placeholder auth gate; full sub check will be added with billing)
  - Route protection logic ✅

### 1.3 UI Component Library
- **shadcn/ui Component Setup** ✅ **COMPLETE**
  - Button, Input, Card, Badge, Tabs, Avatar, Checkbox, Accordion ✅
  - Form components with react-hook-form integration ✅
  - Toasts via Sonner ✅
  - Navigation/data components to be added as needed

- **Design System Foundation** ✅ **COMPLETE**
  - Color palette and typography ✅ (globals.css: headings)
  - Spacing and layout system ✅ (container utility)
  - Responsive breakpoints ✅ (responsive container paddings)
  - Dark/light mode support (future consideration) ✅ (CSS variables present)

### 1.4 Deployment Scripts (Vercel) ✅ COMPLETE
- **Vercel Deployment Configuration**
  - Standard Next.js build configuration ✅
  - API routes support ✅
  - Server-side functionality enabled ✅
  - Production deployment ready ✅

---

## Phase 2: Core Authentication & User Management (Weeks 3-4)

### 2.1 Authentication System
- **Supabase Auth Integration** ✅ COMPLETE
  - Email/password authentication ✅
  - Session management with cookies ✅
  - Password reset flow ✅
  - Email verification handling ✅

- **Authentication Screens** ✅ COMPLETE
  - Login (Screen 1.1) ✅
  - Signup (Screen 1.2) ✅
  - Forgot Password (Screen 1.3) ✅
  - Reset Password (Screen 1.4) ✅

- **API Endpoints** ✅ COMPLETE
  - `/api/auth/status` for user state checking ✅
  - `/api/auth/me` for user profile data ✅
  - `/api/auth/refresh` for token refresh ✅
  - `/api/auth/logout` for proper logout handling ✅
  - Authentication middleware integration ✅
  - Route protection implementation ✅

### 2.2 User Profile & Onboarding ✅ COMPLETE
- **Onboarding Flow (Screen 2.1)** ✅
  - Multi-step questionnaire form ✅
  - Profile data collection (age, weight, height, goals) ✅
  - Dietary preferences and restrictions ✅
  - Form validation with Zod ✅
  - Data persistence to Supabase ✅

- **User Profile Management** ✅
  - Profile CRUD operations ✅
  - Data validation and sanitization ✅
  - Profile update functionality ✅

### 2.3 Navigation & Layout ✅
- **Global Navigation** ✅
  - Header with user menu ✅
  - Sidebar navigation (mobile responsive) ✅
  - Breadcrumb navigation ✅
  - User avatar and dropdown ✅

- **Layout Components** ✅
  - Public layout for landing/auth ✅
  - Protected app layout ✅
  - Responsive design implementation ✅

---

## Phase 3: Diet Catalog & AI Recommendations (Weeks 5-7)

### 3.1.1 Diet Catalog System (Database) ✅
- **Database Schema Implementation** ✅
  - `diets` table with metadata and JSONB fields ✅
  - Simplified schema with `calories_total`, `macros`, `week_plan` ✅
  - `diet_recommendations` for AI suggestions ✅
  - Removed `diet_variants` and `meals` tables (simplified) ✅

### 3.1.2 Diet Catalog System (Screen 4.1) ✅
- **Diet Catalog Screens** ✅
  - Main catalog (Screen 4.1) ✅

### 3.1.3 Diet Catalog System (Screen 4.2) ✅
- **Diet Catalog Screens** ✅
  - Favorites management (Screen 4.2) ✅

### 3.1.4 Diet Catalog System (Screen 5.1) ✅
- **Diet Catalog Screens** ✅
  - Diet detail view (Screen 5.1) ✅

### 3.2 Google Gemini 2.0 Flash API Integration
- **3.2.1 AI Service Setup** ✅
  - Google Gemini API configuration ✅
  - API key management and security ✅
  - Rate limiting and cost control (free tier limits) ✅
  - Error handling and fallbacks ✅

- **3.2.2 Recommendation Logic** ✅
  - User profile analysis ✅
  - Diet matching algorithms using Gemini ✅
  - Score calculation and ranking ✅
  - Weekly refresh limitations (1 week cooldown) ✅

- **3.2.3 Recommendation Screens** ✅
  - AI-suggested diets display: Implemented in `src/app/(app)/diets/page.tsx`. Recommended diets are highlighted in a "Recommended for You" section, merged into the main list, and can be sorted by "Recommendation". Rules from Screen 4.1 (lines 2331, 2372, 2465) respected.
  - "Why recommended" explanations: Implemented in `src/app/(app)/diets/[dietId]/page.tsx`. Added conditional section showing `diet_recommendations.reasoning` only when the diet was recommended for the current user.

### 3.3 Diet Management ✅
- **Diet Selection & Following** ✅
  - "Follow Now" functionality: Implemented in `src/app/(app)/diets/[dietId]/page.tsx`. Users can set any diet as their active plan, which deactivates previous diets and sets the new one as active in `user_current_diet` table.
  - Current diet tracking: Implemented in `src/app/(app)/my-plan/page.tsx` with `CurrentDietCard` component. Displays active diet details, progress tracking, and provides easy access to change diets.
  - Diet switching capabilities: Users can switch diets through the "Change Diet" button in My Week page, which redirects to the diet catalog for selection.

---

## Phase 4: User Experience & Progress Tracking (Weeks 8-10)

### 4.1 Weekly Meal Planning
- **My Week Implementation (Screen 6.1)** ✅
  - Shows the user’s active diet plan for the current week ✅

### 4.2 Progress Tracking
- **Weight Management (Screen 9.2)** ✅
  - Weight entry form ✅
  - Historical weight data ✅
  - Progress visualization with charts ✅
  - Goal tracking ✅
  - **AI Recommendation Refresh Button** ✅
    - Disabled for 1 week after each use ✅
    - Triggers Gemini API call for new diet suggestions ✅
    - Updates `diet_recommendations` table ✅

- **Shopping List (Foundation)** ✅
  - New column `shopping_plan` in the table `diets` ✅

- **Shopping List (Screen 7.1)** ✅
  - Ingredient aggregation ✅
  - Category organization ✅
  - Checkbox functionality ✅
  - PDF export preparation ✅

### 4.3 Dashboard & Navigation
- **Home Dashboard (Screen 3.1)** ✅
  - annoucements panel ✅
  - mini-ranking display ✅
  - Quick user stats and progress ✅
  - Last badges ✅

- **User Hub (Screen 9.1)** ✅
  - Personal dashboard ✅
  - Quick navigation tiles ✅
  - Status overviews ✅
  - Settings access ✅

### 4.4 Refactor Navigation  ✅
  4.4.1 - On `/diets/[dietId]` page, the CTA button in the bottom of the page has a logic that says "Follow Now" if it is not the actual users diet or else, it says "Currently Following" if it is the actual user's diet. Refactor that logic to be "Follow Now" if it is not the actual users diet or "Unfollow" if it is the user's actual diet. And if it is that second option, the button should stay enable for click and onClick should actually dissociate the user from the diet (update the respective user row from `user_current_diet` table where `is_active = true` and set `is_active = false`) ✅
  4.4.2 - On `/diets/[dietId]` page, on the bottom of the page, add a "Shopping List" besides the "Follow / Unfollow" button. The new button should redirect to the `/shopping_list` page.  ✅


### 4.5 New "Weight Log & Profile" unified screen ID 9.11 ✅
- Implement the new screen (Screen ID 9.11). ✅


## Phase 5: Gamification & Advanced Features (Weeks 11-12)

### 5.1 Badge System ✅
- **Badge Implementation (Screen 9.3)** ✅
  - Badge catalog and criterias ✅
  - Achievement tracking ✅
  - Progress visualization ✅
  - Badge unlocking animations ✅

- **Gamification Logic** ✅
  - Milestone detections ✅
  - Badge awarding system ✅
  - Progress celebrations with popup animations ✅

### 5.2 Leaderboards & Social Features ✅
- **5.2.1 Ranking System (Screen 8.1)** ✅
  - Experience points system - full docs from line 4150 to line 4313 ✅
  - Leaderboard implementation - full docs from line 3819 to line 4149 ✅
  - Metric calculations ✅
  - Privacy controls  ✅
  - User positioning ✅
  - Global header XP display ✅

- **5.2.2 Social Elements A** ✅
  - User aliases and avatars (screen 9.10) ✅
  
### 5.3 Advanced Features
- **5.3.1 PDF Export (Screen 7.2)** ✅
  - Shopping list PDF generation ✅
  - Print-friendly layouts ✅
  - Download functionality ✅

- **5.3.2 Reset Password screen** ✅
  - Screen ID: 9.9 (from line 5910 to line 6100) ✅


## Phase 5.5: Styling

### 5.5.1 Menu Refactoring
- **Sticky Footer Menu on Mobile** ✅
  - Create sticky footer menu for mobile only (hide side menu button) ✅
  - Logo on Header ✅
  - EXP and alias outside header menu ✅

### 5.5.2 Translation ✅
- **Translate every page and service classes to pt-BR** ✅

### 5.5.3 Visual Identity
- **Logo** ✅
- **Nunito font** ✅
- **Increase font size on ALL pages, one by one**
- **Swap ingredients animation with 1sec fake loading**
- **Exp animation on header??**
- **Diet catalog grid refactor for better UX**
- **Diet details refactor for better UX**
- **App colors**
- **App menu icons** ✅

### 5.5.4 Parking lot items on Kanban
- **Basics cards**
- **Login cards**
- **Ranking cards**
- **Mkt cards**
- **Diet cards**
- **PDF cards**
- **AI Diet matching cards**

### 5.5.5 Diet Database
- **Generate full list of diets plan with GPT**
- **Generate and insert all diets**
- **Test diet sort & filtering with full database**
- **Test AI diet matching with full database (AI selects correct match for intolarances?)** 


## Phase 6: Subscription & Payment Integration (Weeks 13-14)

### 6.1 Stripe Integration (Free Tier)
- **Payment Setup**
  - Stripe account configuration ***research about discount cupons***
  - Product and price creation
  - Webhook endpoint setup
  - Test mode configuration

- **Subscription Plans**
  - Monthly (R$ 29.90)
  - Quarterly (R$ 74.70)
  - Semiannual (R$ 119.40)
  - Plan comparison and selection

### 6.2 Subscription Management
- **Plans & Pricing (Screen 10.1)**
  - Plan display and comparison
  - Stripe Checkout integration
  - Success/failure handling
  - Subscription status display

- **Payment Processing**
  - Stripe webhook handling
  - Subscription status updates
  - Payment failure handling
  - Customer portal integration

### 6.3 Access Control
- **Paywall Implementation**
  - Route protection based on subscription
  - Feature gating
  - Upgrade prompts
  - Subscription expiration handling

---


## Phase 7: Testing, Polish & Deployment (Weeks 15-16)

### 7.1 Testing & Quality Assurance
- **Manual Testing**
  - User flow testing
  - Cross-browser compatibility
  - Mobile responsiveness
  - Performance testing

- **Bug Fixes & Polish**
  - UI/UX improvements
  - Performance optimization
  - Accessibility enhancements
  - Error handling refinement

### 7.2 Deployment & Production
- **GitHub Pages Deployment**
  - Production build and testing
  - Environment validation
  - Performance monitoring
  - Error tracking setup

- **Vercel Deployment Preparation**
  - Production environment setup
  - Environment variable configuration
  - Domain configuration
  - SSL certificate setup

### 7.3 Documentation & Handover
- **Technical Documentation**
  - API documentation
  - Database schema documentation
  - Deployment procedures
  - Maintenance guidelines

- **User Documentation**
  - User guides
  - FAQ content
  - Terms of agreement
  - Support documentation
  - Feature explanations

---

## Technical Implementation Details

### Database Schema (Supabase - Free Tier)
```sql
-- Core tables as specified in plan-chatgpt.MD
-- RLS policies for all user-owned tables
-- Indexes for performance optimization
-- Foreign key constraints and referential integrity
-- Optimized for free tier limits
```

### API Architecture
- **Server Actions** for form submissions
- **API Routes** for webhooks and external integrations
- **Middleware** for authentication and authorization
- **Error handling** with proper HTTP status codes

### Google Gemini 2.0 Flash API Integration
- **API Configuration**
  - Rate limiting (respecting free tier limits)
  - Error handling and retry logic
  - Response caching for cost optimization
  - Fallback mechanisms for API failures

- **Recommendation Engine**
  - User profile analysis with Gemini
  - Diet matching algorithms
  - Score calculation and ranking
  - Weekly cooldown enforcement

### Security Implementation
- **Row Level Security (RLS)** on all user tables
- **Input validation** with Zod schemas
- **CSRF protection** for forms
- **Rate limiting** for API endpoints
- **Secure headers** and HTTPS enforcement

### Performance Optimization
- **Server-side rendering** for public pages
- **Client-side caching** for user data
- **Code splitting** and lazy loading
- **Database query optimization**
- **Free tier resource management**

---

## Risk Mitigation & Contingencies

### Technical Risks
- **Google Gemini API costs**: Implement rate limiting and usage monitoring
- **Free tier limitations**: Monitor usage and implement fallbacks
- **Stripe integration**: Comprehensive testing in sandbox mode
- **Database performance**: Regular monitoring and optimization
- **Third-party dependencies**: Version pinning and fallback plans

### Business Risks
- **User adoption**: Focus on core value proposition first
- **Payment processing**: Multiple payment method support
- **Data privacy**: GDPR compliance and clear privacy policies
- **Scalability**: Design for growth from the start

---

## Success Metrics & KPIs

### Technical Metrics
- Page load times < 3 seconds
- 99.9% uptime (within free tier limits)
- < 100ms database query response times
- Zero security vulnerabilities
- API usage within free tier limits

### Business Metrics
- User registration completion rate > 80%
- Subscription conversion rate > 15%
- User retention rate > 70% (30 days)
- Customer satisfaction score > 4.5/5

---

## Post-MVP Roadmap

### Phase 8: Enhancement & Scaling
- **Mobile app development**
- **Advanced analytics dashboard**
- **Social features and community**
- **Integration with fitness trackers**
- **Multi-language support**

### Phase 9: Enterprise Features
- **B2B partnerships**
- **White-label solutions**
- **Advanced reporting**
- **API for third-party integrations**

(Moved here - progress charts and analytics for users tracking there own progress)
### Phase 5:
- **5.3.3 Data Analytics**
  - Progress insights
  - Trend analysis
  - Goal tracking
  - Performance metrics

---

## Deployment Strategy

### Phase 1: GitHub Pages Testing
- **Static Export Configuration**
  - Next.js static export setup
  - Environment-specific builds
  - GitHub Actions automation
  - Pre-deployment testing

### Phase 2: Vercel Production
- **Production Deployment**
  - Vercel project setup
  - Environment variables configuration
  - Domain and SSL setup
  - Performance monitoring

---

## Key Features Summary

### Core Functionality
- User authentication and profile management
- Diet catalog with AI-powered recommendations
- Weekly meal planning and tracking
- Progress monitoring and weight logging
- Shopping list generation and PDF export
- Gamification with badges and leaderboards
- Subscription management with Stripe

### AI Integration
- Google Gemini 2.0 Flash API for diet recommendations
- Weekly refresh limitations to control costs
- User profile analysis for personalized suggestions
- Fallback mechanisms for API failures

### Technical Stack
- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **AI**: Google Gemini 2.0 Flash API
- **Payments**: Stripe (hosted checkout)
- **Deployment**: GitHub Pages (testing), Vercel (production)

---

This development plan is optimized for solo development with Google Gemini 2.0 Flash API integration and free tier services. Each phase builds upon the previous one, ensuring a solid foundation while maintaining momentum toward the MVP goal. The plan includes specific considerations for free tier limitations and provides a clear path from GitHub Pages testing to Vercel production deployment.

The plan is designed to be flexible and can be adjusted based on your specific requirements. Each phase can be executed independently, allowing you to test and validate features before moving to the next phase.


---

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

**Updated `diets` table structure** (simplified schema)

* `id` (uuid, pk)
* `slug` (text, unique)
* `title` (text)
* `description` (text)
* `tags` (text[]) — e.g., `{low_carb, keto, vegetarian}`
* `category` (text) — e.g., `low_carb`, `keto`, `vegetarian`
* `difficulty` (text) — e.g., `beginner`, `intermediate`, `advanced`
* `duration_weeks` (int) — diet duration in weeks
* `popularity_score` (int) — for sorting and recommendations
* `is_public` (bool, default true)
* `calories_total` (int) — e.g., 1500, 1800, 2200
* `macros` (jsonb) — e.g., `{protein: 120, carbs: 150, fat: 60}`
* `week_plan` (jsonb) — complete meal plan structure: days → meals → items with alt_items
* `created_at` (timestamptz)
* `updated_at` (timestamptz)

**Removed tables** (simplified schema):
- ❌ `diet_variants` — functionality moved to `diets` table
- ❌ `meals` — functionality moved to `week_plan` JSONB field
- ❌ `user_meal_log` — simplified meal tracking

**`favorites`**

* `user_id` (uuid, pk part)
* `diet_id` (uuid, pk part)
* `created_at` (timestamptz)

**`user_current_diet`** (simplified schema)

* `user_id` (uuid, pk)
* `diet_id` (uuid, fk → diets)
* `is_active` (bool, default true)
* `started_at` (timestamptz)
* `created_at` (timestamptz)
* `updated_at` (timestamptz)

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
  * For public catalog (`diets`): `SELECT` allowed to anon (read-only), `INSERT/UPDATE/DELETE` disabled in public role.
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
    /my-plan (6.1)
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

  * User profile onboarding preferences (all fields), and `diets.tags`, `diets.calories_total` and `diets.macros`
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

# Original content of file screens-chatgpt.MD used to create this markdown file. Below, contains a list of all screens of the system:
# Screen ID: 1.1 Authentication (Login)

## Summary

**Purpose:** authenticate users with email/password via **Supabase Auth**, persist session, then route the user to the correct next screen depending on profile and subscription state:

* If user has **no profile or incomplete profile** → redirect to `/onboarding` (Screen 2.1).
* Else if user **does not have an active subscription** → redirect to `/plans` (Screen 10.1).
* Else → redirect to `/home` (Screen 3.1).

**Important tech constraints:**

* Use `@supabase/auth-helpers-nextjs` or `@supabase/supabase-js` in client components for sign-in.
* Use a server endpoint `/api/auth/status` (server) to return authoritative `onboarded` and `hasActiveSubscription` booleans (see details below).
* Next.js middleware also enforces route gating independently on navigation (middleware will redirect to `/plans` if protected routes accessed without an active subscription).

---

## UI / UX Requirements

**Layout elements**

* Page title / heading: `Log in`
* Two labeled inputs:

  * **Email** — `type="email"`, placeholder: `Enter your email`
  * **Password** — `type="password"`, placeholder: `Enter your password`, with a show/hide toggle (eye icon)
* Primary button: **Log in** (disabled until form is valid)
* Secondary link/button: **Create account** (navigates to `/signup`)
* Link: **Forgot password?** (navigates to `/forgot-password`)
* Optional small area for legal link / privacy: `/terms` and `/privacy` in footer
* Small area for inline error messages (inline and toast)
* Loading indicator in primary button when awaiting response
* Form must be responsive and accessible

**Accessibility**

* All inputs must have accessible labels (`<label>` or `aria-label`) and `aria-describedby` where an error message appears.
* The show/hide password button must have `aria-pressed` and an accessible label (e.g., `aria-label="Show password"` / `"Hide password"`).
* Keyboard focus order: Email → Password → Log in button → other links.
* Error focus: when auth error occurs, the first error message should receive focus (use `role="alert"`).

**Validation & client-side errors**

* Email: required, valid email format.

  * Client message: `"Please enter a valid email."`
* Password: required, min length 6 (backend authoritative)

  * Client message: `"Password must be at least 6 characters."`
* If user tries to submit invalid fields: show inline errors and keep button disabled.

---

## Data model & field names (for form & requests)

Form object (client):

```ts
type LoginForm = {
  email: string;
  password: string;
}
```

API responses used by the screen:

* **Supabase client response** from `signInWithPassword` returns `data` and `error`. Use the error to display messages like `"Invalid email or password."` or `"User not found."`.
* **/api/auth/status** response (server) — JSON:

```json
{
  "onboarded": true | false,
  "hasActiveSubscription": true | false
}
```

---

## Implementation flow (detailed step-by-step)

### 1) Client form + validation

* Implement the form with **react-hook-form** + **zod** schema:

  * `email: z.string().email()`
  * `password: z.string().min(6)`

### 2) On submit (client)

* Call Supabase Auth sign-in method:

  * Using `@supabase/supabase-js` client in a client component:

    ```ts
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    ```
  * Handle `error`: show an inline / toast error with friendly messages:

    * If `error.message` includes `Invalid login` → show `"Invalid email or password."`
    * For network errors → show `"Connection error. Please try again later."`
* **If signInWithPassword succeeds**, the Supabase client will set the auth session cookie (when using `@supabase/auth-helpers-nextjs` or the client configured for cookie auth).
* After successful sign-in, immediately call the server endpoint **`GET /api/auth/status`** (below) to determine routing.

### 3) Server endpoint `/api/auth/status` (must exist)

* Purpose: return real status for this authenticated user. Cursor.AI should implement this as a **server-only** Next.js route that reads the current session from the request cookie using Supabase server auth helper and queries the database using the **Supabase service role (server-only env var)** or a server client.

**Example behavior (server):**

* Get `user = supabaseServer.auth.getUser()` (or the equivalent with auth-helpers).
* If `!user` → return { onboarded\:false, hasActiveSubscription\:false } (or reject).
* Query `profiles` table where `user_id = user.id`.

  * Consider user `onboarded` when `profiles.name IS NOT NULL` **AND** `profiles.goal IS NOT NULL`.
* Query `subscriptions` table where `user_id = user.id` and `status = 'active'` and `current_period_end > now()` (or other conservative check).
* Response:

```json
{ "onboarded": true, "hasActiveSubscription": false }
```

* Use server-side Supabase client with **SUPABASE\_SERVICE\_ROLE\_KEY** to perform this query.

**Note:** This endpoint must be authoritative — the client uses it to decide redirection.

### 4) Client-side redirect logic

* After successful sign-in:

  * Call `GET /api/auth/status` using fetch with `credentials: 'include'`.
  * On the response:

    * If `onboarded === false` → `router.push('/onboarding')`
    * Else if `hasActiveSubscription === false` → `router.push('/plans')`
    * Else → `router.push('/home')`
* Also note: Next.js middleware will independently guard protected pages. This double-checking ensures immediate accurate redirect.

### 5) Error handling cases

* **Invalid credentials**: show `"Invalid email or password."` on the form (inline). Do not reveal whether email exists.
* **User needs email confirmation**: if Supabase returns an error i.e. `user_not_confirmed` (if email confirmation is enabled), show `"Please confirm your email address. Check your inbox."`
* **Network/Server errors**: `"Server unavailable. Please try again later."`
* **Rate limiting / brute force**: If backend returns 429 or custom error, display `"Too many attempts. Try again later."` (optional; recommended for production).
* For unhandled exceptions, show generic `"Unexpected error. Try again later."` and log server-side.

---

## Integration & server-side details

**Libraries & helpers**

* Use `@supabase/auth-helpers-nextjs` to unify cookie/session management with Next.js App Router.
* On the client, use `@supabase/supabase-js` (configured with the public anon key) for the `signInWithPassword`.
* For the server endpoint `/api/auth/status`, use the server-side Supabase client created with **SUPABASE\_SERVICE\_ROLE\_KEY** or `getServerSession` from auth helpers to fetch the user and then standard supabase queries to `profiles` and `subscriptions`.

**Supabase SQL checks for “active subscription”**

* Equivalent SQL used by the server:

```sql
SELECT *
FROM subscriptions
WHERE user_id = '<user-id>'
  AND status = 'active'
  AND current_period_end > now()
LIMIT 1;
```

* On best practice: treat `status IN ('active','trialing')` as active if you support trials.

---

## Next.js App Routing & Middleware interplay

* The sign-in flow relies on the **client and /api/auth/status** server call to decide redirection.
* However, the application **middleware** will still run on subsequent navigations for route protection:

  * Middleware should check session and subscription in a server-side manner and redirect to `/plans` if user lacks active subscription.
  * This keeps client from accessing protected pages by typing URLs directly.

---

## Security considerations

* **Do not** return sensitive data in `/api/auth/status` — only return booleans `onboarded` and `hasActiveSubscription` and optionally the subscription `plan` name for UI.
* `SUPABASE_SERVICE_ROLE_KEY` must be server-only and never exposed to the client.
* Validate and sanitize all inputs although Supabase SDK handles most cases.
* Use HTTPS (Vercel handles this).

---

## Acceptance Criteria (how Cursor.AI will know this screen is done)

1. **Form & validation**

   * The login form renders with email & password inputs, validations enforced, and the Log in button disabled until valid inputs.
   * Password show/hide implemented.

2. **Sign-in flow**

   * On valid credentials, `supabaseClient.auth.signInWithPassword` completes without error and session is persisted (cookie).
   * After authentication, client calls `/api/auth/status` and redirects based on response: `/onboarding`, `/plans`, or `/home`.

3. **Error handling**

   * Invalid credentials show inline `"Invalid email or password."`
   * Network/server errors show friendly message and do not crash the UI.

4. **Accessibility**

   * Inputs are labeled, keyboard order is correct, and errors use `role="alert"` so screen readers announce them.

5. **Middleware compatibility**

   * The Next.js middleware (already present in repo) must still gate protected routes; after login user can navigate to `/home` only if subscription active.

6. **Logging**

   * Authentication errors are logged server-side to Vercel logs for debugging.

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
// LoginForm.tsx (client component)
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data) {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      // map errors to friendly messages
      setFormError(mapSupabaseError(error));
      return;
    }

    // then fetch server-side authoritative status
    const res = await fetch('/api/auth/status', { credentials: 'include' });
    if (!res.ok) {
      showToast('Connection error. Try again later.');
      return;
    }
    const { onboarded, hasActiveSubscription } = await res.json();

    if (!onboarded) return router.push('/onboarding');
    if (!hasActiveSubscription) return router.push('/plans');
    return router.push('/home');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email & password inputs, submit button */}
    </form>
  );
}
```

---

## Deliverables for Cursor.AI for this screen

1. A React client component implementing the login form with `react-hook-form + zod`.
2. Integration with `@supabase/supabase-js` for `signInWithPassword`.
3. Call to server endpoint `GET /api/auth/status` for routing decision (Cursor must also create this endpoint).
4. Proper success/error states and accessibility attributes.
5. Tests are not required for MVP but manual QA checklist must be provided (use acceptance criteria above).

---


---

# Screen ID: 1.2 – User Registration (Sign Up)

## Overview

This screen allows a new user to create an account in the system. The registration process is tied to **Supabase Authentication** and includes email/password as the main method. After successful registration, the user is automatically logged in and redirected to the **Home/Dashboard** screen.

---

## Components

* **Logo/Header (optional placeholder)**: Consistency with login screen.
* **Form container**:

  * Input: **Full Name** (string, required, 2–80 characters).
  * Input: **Email** (string, required, valid email format).
  * Input: **Password** (string, required, min 8 characters, must contain letters and numbers).
  * Input: **Confirm Password** (string, required, must match password).
* **CTA Button**:

  * “Create Account” → triggers Supabase `signUp()` method.
* **Secondary navigation**:

  * Text link: “Already have an account? Log in” → navigates to **Login (1.1)**.
* **Error messages**:

  * Inline validation under each field.
  * Global error banner for Supabase errors (e.g., email already registered).
* **Loading state**:

  * Disabled button with spinner while request is processed.

---

## Functional Requirements

1. **Field Validation**:

   * Full Name required.
   * Email must follow valid format.
   * Password: minimum 8 characters, at least 1 number, 1 letter.
   * Confirm Password must match Password.
   * Errors should be shown immediately when submitting (client-side) and validated again server-side.

2. **User Creation Flow**:

   * On submit, call `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`.
   * Supabase should store `full_name` in `auth.users.user_metadata`.
   * User receives verification email (Supabase default).
   * On success, user is redirected to **Home (3.1)**.

3. **Failure Handling**:

   * Email already exists → show error: “This email is already registered. Please log in.”
   * Weak password → show validation error.
   * Any network/server error → “Something went wrong. Please try again.”

---

## Error Handling

* **Client-side**:

  * Prevent empty submissions.
  * Real-time form validation before calling Supabase.
* **Server-side**:

  * Handle Supabase error codes (e.g., `23505` unique violation for duplicate email).
* **UI**:

  * Show inline field-level errors and global banner if needed.

---

## Navigation

* Successful sign-up → redirect to **Home (3.1)**.
* Secondary action → navigate to **Login (1.1)**.

---

## Technical Notes

* **Supabase Auth**: Using built-in email/password authentication.
* **Password policy**: Enforced client-side, validated server-side.
* **Session persistence**: Supabase handles JWT storage automatically (via localStorage).
* **Form state management**: Use React Hook Form or controlled inputs.
* **UI Library**: Tailwind + shadcn/ui components (`Input`, `Button`, `Form`).

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
const { supabase } = useSupabaseClient();

async function handleSignUp(e) {
  e.preventDefault();

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });

  if (error) {
    setError(error.message);
  } else {
    router.push("/home");
  }
}
```

---

## Acceptance Criteria

* User can register with valid email and password.
* User is automatically logged in after sign-up.
* Password confirmation is enforced.
* Errors are shown correctly for invalid input or duplicate email.
* Redirect after success works consistently.

---

## Security Considerations

* All password inputs must use `type="password"`.
* Do not store plain text passwords — Supabase handles hashing internally.
* Protect against brute force by relying on Supabase rate-limiting.
* Validate email format strictly.
* Ensure error messages do not leak sensitive information (e.g., “user not found”).

---

## Next.js App Routing & Middleware Interplay

* Page route: `/signup`
* Middleware should **redirect authenticated users** away from this screen (e.g., if already logged in, go to `/home`).
* Part of public routes: `/login`, `/signup`.

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → for authentication.
* `react-hook-form` → recommended for form state handling.
* `zod` or `yup` → schema validation for form fields.

### Supabase SQL Checks

* Table: `auth.users` (managed by Supabase).
* Metadata: Ensure `full_name` is persisted under `user_metadata`.
* Query check example:

```sql
select id, email, raw_user_meta_data
from auth.users
where email = 'test@example.com';
```

---


---

# Screen ID: 1.3 – Forgot Password (Request Reset)

## Overview

This screen allows users who forgot their password to request a **password reset email**. The flow leverages **Supabase Auth’s password reset feature**. The user enters their registered email, and if it exists, Supabase sends a reset link. For security reasons, the UI should **not disclose whether the email is registered or not**—instead, it always shows a neutral success message like “If this email is registered, you will receive a reset link.”

---

## Components

* **Logo/Header (optional placeholder)**: Consistency with Login/Signup.
* **Form container**:

  * Input: **Email Address** (required, valid format).
* **CTA Button**:

  * “Send Reset Link” → triggers Supabase password reset request.
* **Secondary navigation**:

  * Text link: “Back to Login” → navigates to **Login (1.1)**.
* **Messages**:

  * Success state: “If this email is registered, you will receive a password reset link.”
  * Error state: Show generic error if request fails (e.g., network issue).
* **Loading state**:

  * Button disabled with spinner while request is sent.

---

## Functional Requirements

1. **Field Validation**:

   * Email is required.
   * Email must follow proper format.
   * Invalid submissions must not call the API.

2. **Password Reset Flow**:

   * On submit, call `supabase.auth.resetPasswordForEmail(email, { redirectTo: <APP_URL>/reset-password })`.
   * User receives an email with a reset link (default from Supabase).
   * Redirect link sends user to a **Reset Password screen** (not part of this spec but planned for later).
   * Always show success message regardless of email existence.

3. **Failure Handling**:

   * Network/server error → show “Something went wrong. Please try again later.”
   * Do not reveal whether an email exists in the database.

---

## Error Handling

* **Client-side**:

  * Block empty submissions.
  * Validate email format.
* **Server-side**:

  * Catch and handle Supabase errors gracefully.
* **UI**:

  * Always return a neutral success message to avoid email enumeration attacks.

---

## Navigation

* On success → remain on same page, show confirmation message.
* Secondary action → “Back to Login” → navigates to **Login (1.1)**.

---

## Technical Notes

* **Supabase Auth**: Using `resetPasswordForEmail`.
* **Redirect URL**: Must be configured in Supabase Auth settings (e.g., `https://app.vercel.app/reset-password`).
* **Form state management**: Use React Hook Form.
* **UI library**: Tailwind + shadcn/ui (`Input`, `Button`, `Form`).
* **Neutral messaging**: Prevents security leaks.

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
const { supabase } = useSupabaseClient();

async function handleForgotPassword(e) {
  e.preventDefault();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
  });

  if (error) {
    setMessage("Something went wrong. Please try again later.");
  } else {
    setMessage("If this email is registered, you will receive a password reset link.");
  }
}
```

---

## Acceptance Criteria

* User can submit a valid email.
* Always shows neutral success message regardless of whether email exists.
* Reset email is sent via Supabase if account exists.
* Errors are shown only for network/server issues.
* User can navigate back to login easily.

---

## Security Considerations

* Do not reveal whether an email is registered (avoid user enumeration attacks).
* Reset links must expire after a short window (Supabase default).
* Redirect URLs must be **whitelisted in Supabase** to prevent phishing.
* Rate limiting is handled by Supabase, but UI should prevent spamming the request button.

---

## Next.js App Routing & Middleware Interplay

* Page route: `/forgot-password`
* Middleware: This screen should be accessible to unauthenticated users only.
* Authenticated users trying to access `/forgot-password` should be redirected to `/home`.

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → for reset call.
* `react-hook-form` → for form state handling.
* `zod` or `yup` → schema validation for email.

### Supabase SQL Checks

This action only interacts with **Supabase Auth** system, not custom tables.
Verification query to check if user exists (for debugging only, not in production):

```sql
select id, email
from auth.users
where email = 'test@example.com';
```

---


---

# Screen ID: 1.4 – Reset Password (Define New Password)

## Overview

This screen is accessed **via the reset link sent by Supabase** when a user requests a password reset (from Screen 1.3).
When the user clicks the reset link in their email, they are redirected to this screen with a **Supabase recovery token** in the URL.

The purpose of this screen is to allow the user to **set a new password** and confirm it.
After successful reset, the user is automatically authenticated and redirected to the **Login screen (1.1)** or **Home screen** (configurable).

---

## Components

* **Logo/Header (optional placeholder)**: For consistency with Login/Signup.
* **Form container**:

  * Input: **New Password** (required, min length = 8 chars).
  * Input: **Confirm Password** (must match the new password).
* **CTA Button**:

  * “Reset Password” → triggers the Supabase `updateUser` with the recovery token.
* **Secondary navigation**:

  * Text link: “Back to Login” → navigates to **Login (1.1)**.
* **Messages**:

  * Success state: “Your password has been updated successfully.”
  * Error state: Display validation or server errors.
* **Loading state**:

  * Button disabled with spinner during request.

---

## Functional Requirements

1. **Token validation**:

   * Supabase includes the recovery token in the URL (`access_token`).
   * User should not manually enter token.
   * If token is missing or invalid → show error message and link back to login.

2. **Form Validation**:

   * Both fields required.
   * Password must meet minimum security requirements (>= 8 chars).
   * Confirm password must match the new password.

3. **Password Reset Flow**:

   * On submit:

     * Call `supabase.auth.updateUser({ password: newPassword })`.
     * Supabase uses the token from the URL to authorize the reset.
   * On success:

     * Show success message.
     * Redirect user to login or auto-login → configurable.

4. **Failure Handling**:

   * Token expired/invalid → show error and link back to Forgot Password.
   * Server/network issues → show generic error message.

---

## Error Handling

* **Client-side**:

  * Prevent submission if passwords do not match.
  * Prevent submission if password too short.
* **Server-side**:

  * Supabase may return “Invalid or expired token.”
  * Handle gracefully and show retry message.
* **UI**:

  * Clear, user-friendly error feedback.

---

## Navigation

* On success → redirect to **Login (1.1)** with a banner message: “Password reset successful. Please log in with your new password.”
* Secondary → “Back to Login.”

---

## Technical Notes

* **Supabase Auth**:

  * Token handling is managed automatically by Supabase when coming from the reset email link.
  * The reset page must be configured as a valid `redirectTo` URL in Supabase Auth settings.
* **Form state management**: React Hook Form + Zod schema validation.
* **UI library**: Tailwind + shadcn/ui.

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';

function ResetPasswordPage() {
  const supabase = useSupabaseClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleResetPassword(e) {
    e.preventDefault();

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("Reset failed. Link may have expired.");
    } else {
      setMessage("Your password has been updated. Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }

  return (
    <form onSubmit={handleResetPassword}>
      <input type="password" placeholder="New Password" onChange={e => setPassword(e.target.value)} />
      <input type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} />
      <button type="submit">Reset Password</button>
      <p>{message}</p>
    </form>
  );
}
```

---

## Acceptance Criteria

* User can enter new password and confirm it.
* Password is updated only if token is valid.
* If token is invalid/expired, user is prompted to request a new one.
* Success → user sees confirmation and is redirected to login.
* Errors are shown in a friendly manner.

---

## Security Considerations

* Password must be validated client + server side.
* Supabase tokens expire quickly—expired tokens must trigger new reset flow.
* Ensure **HTTPS-only links** for reset flow.
* Avoid logging sensitive information.
* Prevent password reset from being exposed in browser console/network logs.

---

## Next.js App Routing & Middleware Interplay

* Page route: `/reset-password`
* Must be **public** (accessible without login).
* Middleware: If a logged-in user tries to access with a valid token, allow reset. Otherwise, redirect to `/login`.

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → for `updateUser`.
* `react-hook-form` + `zod` → form + validation.
* `shadcn/ui` → Input, Button, Form components.

### Supabase SQL Checks

For debugging (not in production), verify token-based reset activity:

```sql
select id, email, last_sign_in_at
from auth.users
where email = 'test@example.com';
```

---

  
---

# Screen ID: 2.1 – Onboarding Questionnaire (Nutritional Profile)

## Overview

This screen is presented **after a user completes signup (1.2) and logs in for the first time**.
The goal is to **collect essential nutritional preferences and restrictions** to allow the system to **suggest appropriate diets**. This data is stored in the Supabase `profiles` table and later used by the **diet recommendation engine (AI matching)**.

#Rule to implement (don't do this during phase 2, item 2.2 "User Profile & Onboarding". We will implement this on Phase 3, subitem 3.2):
* After the user completes the onboarding questionnaire and all required profile fields for diet recommendations:
  1. The system collects user profile data from the database.
  2. The system retrieves all diet records from the catalog.
  3. A request is assembled and sent to the AI API for matching.
  4. The AI returns a ranked list of suggested diets with scores.
  5. The results are persisted in the `diet_recommendations` table.
* This logic is triggered automatically after onboarding completion.

**Key Data Collected**:

* Age, weight, height
* Primary objective: weight loss, weight gain, maintain, general health
* Dietary restrictions/preferences: vegan, vegetarian, lactose intolerance, gluten-free, low-carb, etc.
* Allergies or special considerations
* Activity level
* Food dislikes (optional)

---

## Components

* **Header / Title**:

  * Text: “Let’s personalize your diet plan!”
  * Subtext: “Answer a few questions so we can recommend the best diet options for you.”

* **Form Fields**:

  1. **Age** (number input, required)
  2. **Weight** (number input, required)
  3. **Height** (number input, required)
  4. **Primary Goal** (radio buttons, required)

     * “Lose weight” / “Gain weight” / “Maintain weight” / “Improve health”
  5. **Dietary Restrictions / Preferences** (checkbox group, optional)

     * “Vegan”, “Vegetarian”, “Lactose Intolerant”, “Gluten-Free”, “Low Carb”, “Other (text input)”
  6. **Activity Level** (select + panel to render the description and examples)

     * “Sedentary”, “Lightly Active”, “Moderately Active”, “Very Active”
        6.1. Sedentary:
          * Description: Little to no exercise and a job that involves sitting most of the day. 
          * Examples: Office workers, receptionists, drivers, or individuals who spend most of their day in front of a computer with minimal movement
          * Observation for AI use later: (BMR x 1.375)
        
        6.2. Lightly Active 
          * Description: Light exercise or sports 1-3 days per week. 
          * Examples: A sedentary job with light exercise, such as a short walk or a light workout a few times a week. 
          * Observation for AI use later: (BMR x 1.375)
        
        6.3. Moderately Active 
          * Description: Moderate exercise or sports 3-5 days per week. 
          * Examples: Someone with a job that involves standing for a significant portion of the day, like a sales assistant, along with moderate exercise a few times a week. 
          * Observation for AI use later: (BMR x 1.55)
        
        6.4. Very Active 
          * Description: Hard exercise or sports 6-7 days a week. 
          * Examples: Engaging in intense workouts for most days of the week. 
          * Observation for AI use later: (BMR x 1.725)
        
        6.5. Extra Active 
          * Description: Very intense exercise and training, a physically demanding job, or training twice a day. 
          * Examples: Professions such as carpenters, paramedics, or individuals with physically demanding jobs combined with frequent, intense exercise.
          * Observation for AI use later: (BMR x 1.9)

  7. **Food Dislikes** (textarea, optional)

* **CTA Button**:

  * Primary: “Save and Continue”

* **Progress Indicator** (optional if multi-step wizard is implemented)

---

## Functional Requirements

1. **Data Storage**:

   * Save responses to `profiles` table linked by `auth.user.id`.
   * Ensure all required fields are completed before submission.
   * Optional fields can be null.

2. **Form Validation**:

   * Client-side: required fields must be filled, numeric inputs must be valid numbers.
   * Server-side: enforce constraints in Supabase RLS.

3. **Navigation**:

   * On submit → redirect to **Home/Dashboard (3.1)**.

4. **Re-accessibility**:

   * Users can update their onboarding responses later via **“Eu > Preferences”** screen.

---

## Error Handling

* Client-side validation: highlight required fields, invalid numbers.
* Server-side: if insert/update fails, show retry message.
* Network issues: retry option available.

---

## Navigation

* After “Save and Continue” → **Dashboard/Home (3.1)**

---

## Technical Notes

* **Supabase Table**: `profiles`
Check sql in the file "database-schema.sql"

* **Form State Management**: `react-hook-form` + Zod schema validation
* **UI Components**: Tailwind + shadcn/ui (Input, Select, Checkbox, RadioGroup, Button)

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useForm } from "react-hook-form";

export default function OnboardingForm() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const { register, handleSubmit, formState: { errors } } = useForm();

  async function onSubmit(values) {
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      age: values.age,
      weight: values.weight,
      height: values.height,
      primary_goal: values.primary_goal,
      dietary_preferences: values.dietary_preferences || [],
      activity_level: values.activity_level || null,
      food_dislikes: values.food_dislikes || null,
      onboarding_completed: true
    });

    if (error) {
      alert("Could not save your profile. Please try again.");
    } else {
      window.location.href = "/home";
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="number" placeholder="Age" {...register("age", { required: true })} />
      <input type="number" placeholder="Weight (kg)" {...register("weight", { required: true })} />
      <input type="number" placeholder="Height (cm)" {...register("height", { required: true })} />
      <div>
        <label><input type="radio" {...register("primary_goal", { required: true })} value="lose" /> Lose weight</label>
        <label><input type="radio" {...register("primary_goal")} value="gain" /> Gain weight</label>
        <label><input type="radio" {...register("primary_goal")} value="maintain" /> Maintain weight</label>
        <label><input type="radio" {...register("primary_goal")} value="health" /> Improve health</label>
      </div>
      <div>
        <label><input type="checkbox" {...register("dietary_preferences")} value="vegan" /> Vegan</label>
        <label><input type="checkbox" {...register("dietary_preferences")} value="vegetarian" /> Vegetarian</label>
        <label><input type="checkbox" {...register("dietary_preferences")} value="lactose" /> Lactose Intolerant</label>
        <label><input type="checkbox" {...register("dietary_preferences")} value="gluten" /> Gluten-Free</label>
      </div>
      <button type="submit">Save and Continue</button>
    </form>
  );
}
```

---

## Acceptance Criteria

* User can submit complete onboarding info.
* Data is correctly stored in Supabase `profiles`.
* On success, user is redirected to **Dashboard/Home (3.1)**.
* Error messages are clear and actionable.

---

## Security Considerations

* Only the logged-in user can create/update their own profile (Supabase RLS).
* No sensitive info is exposed in console logs.
* Validate numeric inputs to prevent injection attacks.

---

## Next.js App Routing & Middleware Interplay

* Page route: `/onboarding`
* Middleware:

  * If `profiles.onboarding_completed = true`, redirect to **Dashboard (3.1)**


---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → data CRUD
* `react-hook-form` → form state management
* `zod` → form validation
* `shadcn/ui` → inputs, checkboxes, buttons

### Supabase SQL Checks

```sql
select * from profiles where id = '<user_id>';
```

* Confirm onboarding\_completed = true after submission.


---

# Screen ID: 3.1 – Home / Dashboard

## Overview

The **Home / Dashboard** is the primary entry point for authenticated users after login. It serves as the central hub, providing quick access to relevant information, progress tracking, gamification highlights, and communication from the platform.

The new design consolidates key features into one screen:

* **Announcements Panel** (admin-managed messages from Supabase `announcements` table)
* **Ranking Preview** (mini leaderboard, top users; placeholder until full module is developed)
* **Personal Snapshot** (current weight, mini progress graph, quick diet summary)
* **Recent Badges** (latest gamification achievements unlocked by the user)

The goal is to maximize user engagement and motivation immediately upon login.

---

## Components

### 1. Header

* Standard app header with app logo and navigation to main menu.

### 2. Announcements Panel

* Card container showing **active messages** from the Supabase table `announcements`.
* Each message contains:

  * `title` (short headline, e.g., "New feature released!")
  * `body` (short description, up to 280 chars)
  * `priority` (optional, high-priority messages can be highlighted in a different color)
  * `created_at` and `expires_at` (messages auto-hide after expiration)
* If multiple messages exist, render as a vertical list.
* If no active messages exist, hide the component.

### 3. Ranking Preview

* Card showing **Top 3 users** (by experience, feature will be developed in pahse 6) PLUS actual user with his actual position, for example, #1 - another user A, #2 - another user B, #3 - another user C, #34 - the user logged in.
* Each row: rank position, user avatar and alias, experience value.
* CTA: "See full ranking" → (future route: 8.1 – Ranking screen).
* **Until ranking is implemented**: show placeholder with text "Ranking module coming soon" and a themed illustration.

### 4. Personal Snapshot

* Card with user-specific data:

  * Current weight (from `weights`, latest user's row).
  * Mini line chart with the last 7 rows of weight evolution (from `weights`).
  * Current diet followed (diet title from `diets` table).
  * Quick indicator if recommendations are available to refresh (disabled if under cooldown).

### 5. Recent Badges

* Horizontal list of the **last 3 badges unlocked** (from `user_badges`).
* Each badge shown with icon, title, and unlock date.
* CTA: "See all badges" → navigates to `Screen 9.3 – My Badges`.
* If no badges yet: show motivational placeholder ("Start your journey to earn your first badge!").

---

## Functional Requirements

1. Fetch **announcements** from `announcements` table: only active ones (`is_active = true` and `expires_at > NOW()`).
2. Fetch **ranking data** (top 5). If ranking module not ready, display placeholder.
3. Fetch **user profile data** (weight, progress, current diet).
4. Fetch **recent badges** (last 3 by `earned_at DESC`).
5. Components are responsive (mobile-first design).

---

## Error Handling

* If `announcements` query fails → show empty panel (do not block dashboard).
* If `leaderboard_metrics` query fails or not implemented → show placeholder.
* If user data fails → show “Could not load your data. Try again later.” in snapshot section.
* If badges query fails → show motivational placeholder instead of crash.

---

## Navigation Flow

* **From this screen**:

  * Tap avatar → `Screen 9.1 – Me`.
  * Tap "See all badges" → `Screen 9.3 – My Badges`.
  * Tap "See full ranking" → future `Screen 8.1 – Ranking`.
* **Back navigation**: logging out redirects back to `Screen 1.1 – Login`.

---

## Technical Notes

* **Announcements table (new)**:

```sql
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  priority int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  expires_at timestamptz
);
```

* **Ranking preview**: until `leaderboard_metrics` logic is live, show static placeholder component.
* **Personal snapshot**:

  * Query last 7 weight records from `weights`.
  * Query current active diet from `user_current_diet` join `diets`.
* **Badges**:

  * Query `user_badges` join `badges`, ordered by `earned_at DESC limit 3`.

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
const HomeDashboard = () => {
  const { user } = useAuth();

  const { data: announcements } = useSupabase("announcements")
    .select("*")
    .eq("is_active", true)
    .gt("expires_at", new Date());

  const { data: snapshot } = useSupabase("weights")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(7);

  const { data: badges } = useSupabase("user_badges")
    .select("*, badges(*)")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false })
    .limit(3);

  return (
    <div className="dashboard">
      <AnnouncementsPanel items={announcements} />
      <RankingPreview /> {/* placeholder if not implemented */}
      <PersonalSnapshot data={snapshot} />
      <RecentBadges data={badges} />
    </div>
  );
};
```

---

## Acceptance Criteria

* [ ] Announcements load dynamically from Supabase and respect expiration dates.
* [ ] Ranking shows top 3 + user's position OR placeholder if not implemented.
* [ ] Personal snapshot shows correct latest weight + mini graph + current diet.
* [ ] Recent badges component shows last 3 unlocked.
* [ ] Empty/error states handled gracefully without breaking layout.

---

## Security Considerations

* Ensure queries are scoped to the logged-in user (`eq("user_id", user.id)`).
* Do not expose other users’ personal data outside ranking (alias-only, no sensitive info).
* Prevent expired announcements from being rendered.

---

## Next.js App Routing & Middleware

* Route: `/home` (protected).
* Middleware: redirect unauthenticated users → `/login`.

---

## Integration & Server-Side Details

* Use Supabase client for announcements, user data, badges.
* Ranking preview: initially hardcoded placeholder until server-side logic is available.
* Mini chart: can use a lightweight library (e.g., `recharts`) with Tailwind styling.

---

# Screen ID: 4.1 – Diet Catalog

## Overview

The **Diet Catalog** is the main browsing interface where users can explore all available diets in the system. It acts as the **entry point to the diet discovery process**, from which the user can view details of specific diets (→ 5.1 Diet Detail) and potentially select one to follow.

**Main Goals**:

* Present a catalog of available diets with filters and search functionality.
* Allow users to explore diet summaries (name, description, suitability).
* Provide navigation to detailed diet pages.
* Enable sorting (e.g., by popularity, difficulty, adherence rate).
* Highlight AI-recommended or trending diets.

# Rule to implement:
* On the "Dietas" screen (Catalog / Discovery):
  * Users can view **all diet plans** in the catalog.
  * Recommended diets from AI are **highlighted** based on entries in the `diet_recommendations` table.
  * **No AI call is triggered** when the user simply views this screen.
* Purpose:
  * Maintain consistency and avoid unnecessary AI API usage.
  * Clearly distinguish AI-recommended diets from the rest of the catalog.


---

## Components

* **Header**

  * Same as global navigation (Home, Diet Catalog, My Week, Shopping List, Ranking, Eu).
  * Search bar for quick filtering by diet name/keyword.
  * Filter button (opens modal or side panel).

* **Filter & Sorting Controls**

  * Filter by:

    * Category (e.g., low-carb, keto, vegetarian, high-protein).
    * Goal (weight loss, maintenance, muscle gain).
    * Duration (short-term, long-term).
    * Difficulty level.
  * Sort by:

    * Popularity
    * AI recommendation score
    * Alphabetical
    * Recently added

* **Diet List/Grid**

  * Cards for each diet with:

    * Diet name
    * Short description (1–2 lines)
    * Category badge
    * Duration label
    * Difficulty indicator
    * Preview image (optional placeholder)
    * CTA: “View details” → (5.1 Diet Detail)

* **Suggested / Highlighted Section**

  * At the top, “Recommended for You” showing top 3 scored diets flagged by the AI recommendation system.

* **Footer**

  * Terms, Privacy, Help
  * Vercel analytics placeholder

---

## Functional Requirements

1. **Diet Fetching**

   * Load list of diets from Supabase `diets` table.
   * Apply filters and sorting client-side or via SQL queries.

2. **Search**

   * Input field filters results in real-time.
   * Search is case-insensitive, covering diet name and description.

3. **Filtering**

   * User selects filters via modal or side drawer.
   * Supabase query adapts dynamically (with multiple filters).

4. **Sorting**

   * Default: Popularity.
   * Options applied dynamically without full page reload.

5. **Diet Selection**

   * Clicking a card navigates to **Diet Detail (5.1)** for that specific diet.

---

## Error Handling

* If no diets match filters → show friendly message “No diets found. Try changing filters.”
* API/network errors → show fallback message “Unable to load diets, please retry.”
* If AI recommendation fails → hide the “Recommended for You” section.

---

## Navigation

* **Primary**

  * Diet Detail → 5.1 (via “View details” button on each card).
* **Secondary**

  * Return to Dashboard (3.1).
  * Continue to Shopping List (7.1) if a diet is already selected.

---

## Technical Notes

* **Supabase Tables**

  * `diets` → diet metadata (id, name, description, category, duration, difficulty, popularity\_score, created\_at)
  * `diet_recommendations` → AI-suggested diets per user
* **UI Components**

  * shadcn/ui: Card, Badge, Modal, Dropdown
  * Tailwind grid for responsive layout
* **Pagination**

  * Use infinite scroll or “Load more” button (recommended for performance)

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

export default function DietCatalog() {
  const supabase = useSupabaseClient();
  const [diets, setDiets] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchDiets() {
      let { data, error } = await supabase
        .from("diets")
        .select("*")
        .order("popularity_score", { ascending: false });
      if (!error) setDiets(data);
    }
    fetchDiets();
  }, []);

  const filtered = diets.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="catalog-container">
      <h1>Diet Catalog</h1>
      <input
        type="text"
        placeholder="Search diets..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-input"
      />
      <div className="diet-grid">
        {filtered.map(diet => (
          <div key={diet.id} className="diet-card">
            <h2>{diet.name}</h2>
            <p>{diet.description}</p>
            <span>{diet.category}</span>
            <button onClick={() => window.location.href=`/diets/${diet.id}`}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Acceptance Criteria

* User can search diets by name or description.
* Filters (category, goal, difficulty, duration) correctly narrow results.
* Sorting options reorder the catalog properly.
* AI-recommended diets are displayed if available.
* Clicking a diet opens its detail screen (5.1).
* Responsive UI across devices.

---

## Security Considerations

* Diet catalog data is public → no sensitive information.
* Ensure Supabase query limits per user (pagination to prevent over-fetching).
* If personalized recommendations are used, scope by `auth.user.id`.

---

## Next.js App Routing & Middleware Interplay

* Page route: `/diets`
* Dynamic route for details: `/diets/[id]`
* Middleware ensures:

  * User must be logged in → redirect `/login` if not authenticated.
  * If onboarding incomplete → redirect `/onboarding`.

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → diet queries
* `shadcn/ui` → Cards, Filters, Dropdown
* Tailwind CSS → grid-based layout
* Optional: `react-query` for caching diet data

### Supabase SQL Checks

```sql
-- Fetch all diets ordered by popularity
select * from diets order by popularity_score desc;

-- Filtered by category (example: keto)
select * from diets where category = 'keto';

-- Search by keyword
select * from diets where name ilike '%low carb%' or description ilike '%low carb%';

-- Recommended diets for user (if AI implemented)
select d.* from diets d
join diet_recommendations r on r.diet_id = d.id
where r.user_id = '<user_id>';
```

---



---

# Screen ID: 4.2 – Favorites

## Overview

The **Favorites screen** displays all diets that the user has explicitly marked as favorites. It acts as a **personalized subset of the Diet Catalog (4.1)** and provides quick access to frequently referenced or preferred diets.

**Main Goals**:

* Let users easily revisit diets they previously favorited.
* Provide navigation to each diet’s **Diet Detail (5.1)** screen.
* Support removal from favorites directly from this screen.
* Accessible both from:

  * **Inside the “Diets” section** (tab navigation).
  * **Inside the “Me” section** (user profile → favorites shortcut).

---

## Components

* **Header**

  * Consistent with global navigation.
  * Title: “My Favorites”
  * Optional filter/sort controls (same as Diet Catalog, but scoped to favorites).

* **Diet List/Grid**

  * Each card displays:

    * Diet name
    * Short description
    * Category badge
    * Duration label
    * Difficulty indicator
    * Preview image (optional placeholder)
    * CTA buttons:

      * “View details” → (5.1 Diet Detail)
      * Heart icon (filled = favorited, toggle to unfavorite)

* **Empty State**

  * If no favorites exist:

    * Illustration or icon
    * Message: “You haven’t favorited any diets yet.”
    * CTA: “Browse Diet Catalog” → (4.1)

---

## Functional Requirements

1. **Favorites Fetching**

   * Query Supabase `favorites` table scoped to current `user_id`.
   * Join with `diets` table to fetch full diet details.

2. **Display**

   * Diets shown in grid/list view.
   * Ordered by `created_at` (date added to favorites) by default.

3. **Favorite Toggle**

   * User can remove from favorites via card’s heart icon.
   * Update `favorites` table in Supabase.

4. **Navigation**

   * Clicking “View details” navigates to **Diet Detail (5.1)**.
   * If empty → CTA navigates to **Diet Catalog (4.1)**.

---

## Error Handling

* If Supabase fetch fails → “Could not load favorites. Please try again.”
* If no favorites exist → show empty state.
* Toggle failures (network/DB) → revert UI state and show toast “Action failed, please retry.”

---

## Navigation

* **Primary**

  * From Favorites → Diet Detail (5.1).
* **Secondary**

  * From empty state CTA → Diet Catalog (4.1).
* **Access points**

  * Tab inside Diets section → `/diets/favorites`.
  * “Me” section shortcut → `/me/favorites`.

---

## Technical Notes

* **Supabase Tables**

  * `favorites`

    * `id` (PK)
    * `user_id` (FK → auth.users)
    * `diet_id` (FK → diets.id)
    * `created_at`
  * `diets` (joined for metadata)

* **UI Components**

  * shadcn/ui: Card, Badge, Tabs, Empty State placeholder
  * Tailwind grid for layout

* **Performance**

  * Query limited to 20–30 diets per request → implement infinite scroll or pagination.

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

export default function Favorites() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function fetchFavorites() {
      let { data, error } = await supabase
        .from("favorites")
        .select("diet_id, diets(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error) setFavorites(data);
    }
    if (user) fetchFavorites();
  }, [user]);

  async function toggleFavorite(dietId) {
    const existing = favorites.find(f => f.diet_id === dietId);
    if (existing) {
      await supabase.from("favorites").delete().eq("diet_id", dietId).eq("user_id", user.id);
      setFavorites(favorites.filter(f => f.diet_id !== dietId));
    }
  }

  if (!favorites.length) {
    return (
      <div className="empty-state">
        <p>You haven’t favorited any diets yet.</p>
        <button onClick={() => window.location.href="/diets"}>Browse Diet Catalog</button>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h1>My Favorites</h1>
      <div className="diet-grid">
        {favorites.map(fav => (
          <div key={fav.diet_id} className="diet-card">
            <h2>{fav.diets.name}</h2>
            <p>{fav.diets.description}</p>
            <span>{fav.diets.category}</span>
            <button onClick={() => toggleFavorite(fav.diet_id)}>💖</button>
            <button onClick={() => window.location.href=`/diets/${fav.diet_id}`}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Acceptance Criteria

* User sees only their own favorited diets.
* Empty state displays when no favorites exist.
* User can unfavorite directly from this screen.
* Clicking a diet navigates to its detail page.
* Pagination/infinite scroll works as expected.
* Accessible via both Diets tab and “Me” section.

---

## Security Considerations

* Favorites table must enforce **row-level security (RLS)**.

  * A user should only see their own favorites.
* Favoriting/unfavoriting must always be scoped by `auth.user.id`.
* Prevent SQL injection by using parameterized queries.

---

## Next.js App Routing & Middleware Interplay

* Page route: `/diets/favorites` (tab in Diets section).
* Secondary route: `/me/favorites`.
* Middleware ensures:

  * Authenticated session required → redirect `/login` otherwise.
  * Onboarding must be complete → redirect `/onboarding` otherwise.

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → query favorites and diets.
* `shadcn/ui` → Cards, Tabs, Empty State.
* `react-query` or `swr` for caching requests.

### Supabase SQL Checks

```sql
-- Fetch user favorites with diet details
select f.diet_id, d.*
from favorites f
join diets d on d.id = f.diet_id
where f.user_id = '<user_id>'
order by f.created_at desc;

-- Insert new favorite
insert into favorites (user_id, diet_id) values ('<user_id>', '<diet_id>');

-- Remove from favorites
delete from favorites where user_id = '<user_id>' and diet_id = '<diet_id>';

-- Row-Level Security
create policy "Users manage own favorites"
on favorites
for all
using (user_id = auth.uid());
```

---


---

# Screen ID: 5.1 – Diet Detail

## Overview

The **Diet Detail** screen presents all information about a selected diet. It is the central point where users can view the **daily meal plan**, **macros**, **calories**, and **meal alternatives**. This screen is accessed from:

* **Diet Catalog (4.1)**
* **Favorites (4.2)**
* **Minha Semana / Current Plan (6.1)** (if linking to specific diet details)

**Main Goals**:

* Display full diet information clearly.
* Provide access to **substitutions** for ingredients or meals.
* Support marking the diet as **“Follow Now”**, which sets it as the user’s active diet plan.
* Support marking the diet as **favorite**, which sets this diet_id in the favorites table for this user_id. Heart sign for Toggle/untoggle.

---

## Components

* **Header**

  * Diet name
  * Category badges
  * Back button → navigates to previous screen (router.back())

* **Daily Meal Plan**

  * List per day (Day 1, Day 2, …)
  * Meals per day (Breakfast, Lunch, Dinner, Snacks)
  * Each meal shows:

    * Recipe name
    * Ingredients & quantities
    * Macros (Protein, Carbs, Fat)
    * Total calories
  * Collapsible sections for better UX

* **Meal Substitutions** (Pop-up/Expandable)

  * Show alternative ingredients maintaining macro balance
  * Triggered by “Swap” or “Suggest Alternative” button on each meal item. (for now, create a button but let it without action. We will develop this feature later)

* **Follow Now CTA**

  * Button to set diet as current active diet (updates **Minha Semana / Current Plan** – 6.1)
  * Confirmation toast on success

* **Optional Info Section**

  * Diet description, goals, recommended activity level, dietary restrictions

---

## Functional Requirements

1. **Diet Fetching**

   * Fetch diet from Supabase `diets` table using `diet_id`
   * Diet includes `calories_total`, `macros`, and `week_plan` JSONB fields
   * No need to fetch separate variants or meals tables

2. **Follow Now Logic**

   * On button click:

     * Update `user_current_diet` table with selected `diet_id`
     * If user already has an active diet, replace it

3. **Meal Plan Display**

   * Parse `week_plan` JSONB structure to display days and meals
   * Show individual meal items with quantities and units
   * Display alternative items (`alt_items`) for meal swapping

4. **Meal Item Swapping**

   * Update displayed macros/calories in real-time
   * Store selected variation in state until “Follow Now” confirmation

5. **Navigation**

   * Back button returns to the screen from which user navigated (Catalog, Favorites, Week Plan)

---

## Error Handling

* Diet fetch failure → show toast: “Could not load diet. Try again later.”
* Follow Now failure → toast: “Failed to set as active diet.”
* Caloric variation unavailable → disable selection button

---

## Navigation

* From Diet Detail →

  * Back to Diet Catalog (4.1)
  * Back to Favorites (4.2)
  * Back to Minha Semana (6.1)
* From Follow Now → updates Minha Semana (6.1)

---

## Technical Notes

* **Supabase Tables**

  * `diets` → main diet metadata with `calories_total`, `macros`, `week_plan` JSONB fields
  * `user_current_diet` → tracks the user's active diet (simplified schema)
  * `favorites` → user's favorited diets

* **UI Components**

  * shadcn/ui: Card, Collapsible, Button, Tabs, Toast
  * Tailwind CSS for layout

* **Performance**

  * Load diet + meals in single query if possible
  * Lazy-load meal substitutions only when user opens the swap panel

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

export default function DietDetail({ dietId }) {
  const supabase = useSupabaseClient();
  const [diet, setDiet] = useState(null);
  const [selectedCalories, setSelectedCalories] = useState(null);

  useEffect(() => {
    async function fetchDiet() {
      const { data, error } = await supabase
        .from("diets")
        .select(`
          id,
          title,
          description,
          category,
          difficulty,
          duration_weeks,
          popularity_score,
          calories_total,
          macros,
          week_plan,
          tags,
          slug
        `)
        .eq("id", dietId)
        .single();
      if (!error) {
        setDiet(data);
      }
    }
    fetchDiet();
  }, [dietId]);

  async function followNow() {
    await supabase
      .from("user_current_diet")
      .upsert({ 
        user_id: supabase.auth.user().id, 
        diet_id: diet.id, 
        is_active: true,
        started_at: new Date().toISOString()
      });
    alert("Diet set as current plan!");
  }

  if (!diet) return <p>Loading diet...</p>;

  return (
    <div className="diet-detail">
      <h1>{diet.name}</h1>
      <div className="calories-options">
        {diet.pre_caloric_variations.map(v => (
          <button key={v.calories} onClick={() => setSelectedCalories(v.calories)}>
            {v.calories} kcal
          </button>
        ))}
      </div>
      {diet.week_plan?.days?.map((day, dayIndex) => (
        <div key={dayIndex} className="day-card">
          <h2>Day {dayIndex + 1}</h2>
          {day.meals.map((meal, mealIndex) => (
            <div key={mealIndex} className="meal-card">
              <h3>{meal.name}</h3>
              <p>{meal.calories} calories</p>
              {meal.items.map((item, itemIndex) => (
                <div key={itemIndex} className="item">
                  <span>{item.name} - {item.quantity} {item.unit}</span>
                  {item.alt_items && item.alt_items.length > 0 && (
                    <button onClick={() => toggleItemSwap(dayIndex, mealIndex, itemIndex)}>
                      Swap
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      <button onClick={followNow}>Follow Now</button>
    </div>
  );
}
```

---

## Acceptance Criteria

* All meals, macros display correctly.
* Follow Now button updates **user\_current\_diet** correctly.
* Meal substitution button opens alternatives (if available).
* Back navigation works consistently.

---

## Security Considerations

* Ensure user can only follow a diet for their own account.
* Fetch diet details safely, validating `diet_id`.
* Row-level security in `user_current_diet` to prevent unauthorized changes.

---

## Next.js App Routing & Middleware Interplay

* Route: `/diets/[dietId]` (ALTER SCREEN 4.1: EACH DIET CARD HAS A "View Details" BUTTON THAT SHOULD ROUTES TO THIS PATH PATTERN `/diets/[dietId]` TOO)
* Middleware:

  * Authenticated session required → redirect `/login`.
  * Onboarding must be completed → redirect `/onboarding`.

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → fetch diet, meals, variations
* `shadcn/ui` → Cards, Collapsible, Button, Toast
* `react-query` / `swr` for caching

### Supabase SQL Checks

```sql
-- Fetch diet with new simplified schema
select d.*
from diets d
where d.id = '<diet_id>';

-- Set diet as current for user (simplified schema)
upsert into user_current_diet(user_id, diet_id, is_active, started_at)
values ('<user_id>', '<diet_id>', true, now());
```

---


---

# Screen ID: 6.1 – My Week / Current Plan

## Overview

The **My Week / Current Plan** screen shows the **user’s active diet plan** for the current week. It acts as a **central hub** for checking his actual diet plan and quick access to the shopping list. Users can also **switch to another diet** from here (redirect to Diet Catalog – 4.1).

**Main Goals:**

* Display current week’s meal plan with clear structure (days and meals).
* Provide quick links to **Lista de Compras / Shopping List (7.1)** and **Diet Detail (5.1)**.
* Enable **diet swapping** to choose another diet from the catalog.

---

## Components

* **Header**

  * Week label (e.g., “Week of Aug 26 – Sep 1”)
  * Back button → Home (3.1)

* **Page body**

  * Current active diet plan displayed
  *** Remove the "This Week's Progress section. Not in the MVP anymore! ***

* **Links & CTAs**

  * **Shopping List (7.1)** → button navigates to generated shopping list
  * **View Diet Detail (5.1)** → link to the full diet
  * **Swap Diet** → button redirects to Diet Catalog (4.1)

---

## Functional Requirements

1. **Fetch Active Diet**

   * Query `user_current_diet` by `user_id`

2. **Swap Diet**

   * Redirect to Diet Catalog (4.1)
   * Confirmation toast if user selects new diet

3. **Navigation**

   * Back → Home (3.1)
   * Click View Details → navigate to Diet Detail (5.1)

---

## Error Handling

* No active diet → show empty state with CTA: "Browse Diets"
* Fetch diet fails → toast: “Could not load current plan. Try again later.”

---

## Navigation

* From Current Plan →

  * Diet Detail (5.1)
  * Shopping List (7.1)
  * Diet Catalog (4.1)
  * Back to Home (3.1)

---

## Technical Notes

* **Supabase Tables**

  * `user_current_diet` → active diet (simplified schema)
* **UI Components**

  * shadcn/ui: Card, Collapsible, Button, Checkbox, Toast
  * Tailwind CSS for responsive layout
* **Performance**

  * Fetch entire week in a single query

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

export default function CurrentWeekPlan() {
  const supabase = useSupabaseClient();
  const [meals, setMeals] = useState([]);
  const [adherence, setAdherence] = useState({});

  useEffect(() => {
    async function fetchPlan() {
      const { data } = await supabase
        .from("user_current_diet")
        .select("*, diets(*)")
        .eq("user_id", supabase.auth.user().id)
        .single();
      if (data?.diets) {
        setDiet(data.diets);
        // Parse week_plan JSONB structure
        setWeekPlan(data.diets.week_plan);
      }
    }
    fetchPlan();
  }, []);

  async function toggleMeal(mealId) {
    const newStatus = !adherence[mealId];
    setAdherence({ ...adherence, [mealId]: newStatus });
    await supabase.from("user_meal_log").upsert({
      user_id: supabase.auth.user().id,
      diet_id: meals[0].diet_id,
      meal_id: mealId,
      date: new Date(),
      completed: newStatus
    });
  }

  return (
    <div className="current-week">
      <h1>My Current Plan</h1>
      {weekPlan?.days?.map((day, dayIndex) => (
        <div key={dayIndex} className="day-card">
          <h2>Day {dayIndex + 1}</h2>
          {day.meals.map((meal, mealIndex) => (
            <div key={mealIndex} className="meal-card">
              <h3>{meal.name}</h3>
              <p>{meal.calories} calories</p>
              {meal.items.map((item, itemIndex) => (
                <div key={itemIndex} className="item">
                  <span>{item.name} - {item.quantity} {item.unit}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      <button onClick={() => navigate("/shopping-list")}>Shopping List</button>
      <button onClick={() => navigate("/diets")}>Swap Diet</button>
    </div>
  );
}
```

---

## Acceptance Criteria

* Links to Shopping List and Diet Detail work.
* Swap Diet button redirects correctly.
* Handles empty state if no active diet.

---

## Security Considerations

* Users can only see and update their own meal logs.

---

## Next.js App Routing & Middleware

* Route: `/my-plan`
* Middleware:

  * Authenticated session required → redirect `/login`
  * Onboarding must be completed → redirect `/onboarding`

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → fetch active diet, meals, and logs
* `shadcn/ui` → Card, Checkbox, Button, Toast
* `react-query` / `swr` for caching

### Supabase SQL Checks

```sql
-- Fetch current diet with week_plan
select u.*, d.*
from user_current_diet u
join diets d on d.id = u.diet_id
where u.user_id = '<user_id>' and u.is_active = true;
```

---


---

# Screen ID: 6.2 – Followed Diets History (Light)

## Overview

The **Followed Diets History** screen provides a **lightweight view** of all diets the user has previously followed. It allows users to **reactivate past diets** or quickly check which diets they’ve tried. This screen **does not show meal-by-meal details**; for that, users must access the **Diet Detail screen (5.1)**.

**Main Goals:**

* Display a **chronological list** of diets previously followed.
* Show **basic metadata**: diet name, start/end date, duration, optional rating/feedback.
* Allow **reactivation of a past diet** (redirects to Diet Detail or Minha Semana).
* Provide **quick navigation** back to the Home screen (3.1).

---

## Components

* **Header**

  * Title: “My Past Diets”
  * Back button → Home (3.1)

* **Diet Cards**

  * Diet name and type (e.g., “Low Carb – 1500 kcal”)
  * Start date / end date
  * Duration (e.g., 2 weeks)
  * Optional: mini adherence percentage
  * Button / link: “View Details” → navigates to Diet Detail (5.1)
  * Optional: button to **Reactivate Diet** → navigates to Minha Semana (6.1)

* **Search & Filter (Optional MVP)**

  * Search bar by diet name
  * Filter by diet type (Low Carb, Mediterranean, Vegan, etc.)

---

## Functional Requirements

1. **Fetch Historical Diets**

   * Query `user_past_diets` by `user_id`
   * Return diet name, type, start\_date, end\_date, kcal, optional adherence metrics

2. **Reactivate Diet**

   * User selects a past diet → sets as `user_current_diet`
   * Optional toast notification: “Diet reactivated for current week”

3. **Navigation**

   * Back → Home (3.1)
   * Click Diet → Diet Detail (5.1)
   * Reactivate → Minha Semana (6.1)

---

## Error Handling

* No past diets → show empty state with CTA: “Try a diet now” → link to Diet Catalog (4.1)
* Fetch fails → toast: “Could not load your diet history. Please try again later.”

---

## Navigation

* From Followed Diets →

  * Diet Detail (5.1)
  * Minha Semana / Current Plan (6.1)
  * Home (3.1)

---

## Technical Notes

* **Supabase Tables**

  * `user_past_diets` → stores `user_id`, `diet_id`, start/end dates, kcal, type, optional adherence
* **UI Components**

  * shadcn/ui: Card, Button, List
  * Tailwind CSS for responsive layout
* **Performance**

  * Fetch all past diets in a single query, sorted by end\_date descending

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

export default function PastDiets() {
  const supabase = useSupabaseClient();
  const [pastDiets, setPastDiets] = useState([]);

  useEffect(() => {
    async function fetchPastDiets() {
      const { data } = await supabase
        .from("user_past_diets")
        .select("*")
        .eq("user_id", supabase.auth.user().id)
        .order("end_date", { ascending: false });
      setPastDiets(data);
    }
    fetchPastDiets();
  }, []);

  async function reactivateDiet(dietId) {
    await supabase.from("user_current_diet").upsert({
      user_id: supabase.auth.user().id,
      diet_id: dietId
    });
    alert("Diet reactivated for current week!");
  }

  return (
    <div className="past-diets">
      <h1>My Past Diets</h1>
      {pastDiets.length === 0 && <p>No diets followed yet. Try a new one!</p>}
      {pastDiets.map(diet => (
        <div key={diet.id} className="diet-card">
          <h2>{diet.name} – {diet.kcal} kcal</h2>
          <p>{diet.start_date} to {diet.end_date} ({diet.duration} days)</p>
          <button onClick={() => reactivateDiet(diet.diet_id)}>Reactivate Diet</button>
          <button onClick={() => navigate(`/diet-detail/${diet.diet_id}`)}>View Details</button>
        </div>
      ))}
    </div>
  );
}
```

---

## Acceptance Criteria

* Shows all past diets in reverse chronological order
* Diet cards display name, kcal, duration, dates
* Reactivate button updates `user_current_diet`
* View Details button navigates to Diet Detail (5.1)
* Handles empty states gracefully

---

## Security Considerations

* Users can only see **their own diet history**
* Row-level security enforced in `user_past_diets` table

---

## Next.js App Routing & Middleware

* Route: `/past-diets`
* Middleware:

  * Authenticated session required → redirect `/login`
  * Onboarding completed → redirect `/onboarding`

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → fetch past diets, reactivate
* `shadcn/ui` → Card, Button
* `react-query` / `swr` → optional caching

### Supabase SQL Checks

```sql
-- Fetch user past diets
select * from user_past_diets
where user_id = '<user_id>'
order by end_date desc;

-- Reactivate diet
upsert into user_current_diet(user_id, diet_id)
values ('<user_id>', '<diet_id>');
```

---




---

# Screen ID: 7.1 – Shopping List

## Overview

The **Shopping List** screen generates a **grocery list** based on the user’s currently selected diet. The list aggregates all ingredients from the diet’s meals, calculates total quantities, and allows the user to select a time-period (quantities for a week or a month) and export the list as PDF.

**Main Goals:**

* Parse and display a list of items that is already computed in the database "see Supabase Tables section for the complete specification"
* Allow period selection: week or month.
* Export the list as PDF (linked to 7.2 – Export / Print PDF).

---

## Components

* **Header**

  * Title: “Shopping List”
  * Back button → Minha Semana / Current Plan (6.1)

* **Main Ingredients List**

  * A placeholder for future implementation of icons, for now, print a generic food lucide-react icon for all items
  * Name of each ingredient, from `main_items` section of the json, field `name` 
  * Quantity, from `main_items` section of the json, field `quantity`, then multiply by 7 if users choose week period or 30 if month 
  * Unit, from `main_items` section of the json, field `unit`
  * Don't use collapsible/expandable. All open for PDF print later.

  * **Alternative Ingredients List**

  * A sub-title informing the user that this diet contains this alternatives suggestions listed here so user can consider shop in small quantities for daily use
  * A placeholder for future implementation of icons, for now, print a generic food lucide-react icon for all items
  * Name of each ingredient, from `alt_items` section of the json, field `name` 
  * For alternative items, we won't display quantity and unit. It is a list of possible items for user consider to buy.
  * Don't use collapsible/expandable. All open for PDF print later.

* **Actions**

  * Radio button for period selection, week or month (onclick -> re-calculate sum of items times 7 or 30 as described above)
  * Export / Print PDF → navigates to 7.2

---

## Functional Requirements

1. **Fetch Current Diet Ingredients**

   * Query `user_current_diet` to retrieve selected diet in the `diets` table
   * Parse `shopping_plan` JSONB field to extract the list of ingredients and alternative items. See Supabase Tables section for the complete specification of the JSONB in the column.
   * When user click the period radio button, multiplies all item quantities by 7 if week period or by 30 if month period. 

2. **Export / Print**

   * Export current list to PDF (implement in 7.2)

---

## Error Handling

* No current diet → show empty state with CTA: “Select a diet first” → link to Diet Catalog (4.1)
* Fetch fails → toast: “Could not load your shopping list. Please try again later.”

---

## Navigation

* From Shopping List →

  * Back → Minha Semana (6.1)
  * Export PDF → Export / Print (7.2)

---

## Technical Notes

* **Supabase Tables**

  * `user_current_diet` → selected diet (simplified schema)
  * `diets` → diet details with `shopping_plan` JSONB field containing ingredients already calculated. See full explanation below:

  ## Shopping Plan JSONB Specification

  Each diet record in `diets` have a column `diets.shopping_plan` which stores a pre-computed shopping list in JSON format.
  The JSON is divided into two sections:

  1. **main\_items**

    * Consolidated list of all base items from the `week_plan` JSON.
    * Items with the same name and unit are **aggregated** (summed quantities across all meals/days).
    * Each entry contains:

      * `name`: string, item name (e.g., `"Arroz integral"`)
      * `quantity`: number, aggregated quantity across the full week
      * `unit`: string, measurement unit (e.g., `"grams"`, `"pcs"`)
      * `icon`: reserved for future use, currently set to `null`

  2. **alt\_items**

    * Flat list of **all alternative items** (`alt_items`) that appear in the corresponding `week_plan`.
    * No quantities or units are included (only names).
    * Each entry contains:

      * `name`: string, item name (e.g., `"Quinoa"`)
      * `icon`: reserved for future use, currently set to `null`

  ### Example `shopping_plan` JSON

  ```json
  {
    "main_items": [
      { "name": "Arroz integral", "quantity": 700, "unit": "grams", "icon": null },
      { "name": "Feijão carioca", "quantity": 500, "unit": "grams", "icon": null },
      { "name": "Tofu grelhado", "quantity": 400, "unit": "grams", "icon": null },
      { "name": "Pão integral", "quantity": 350, "unit": "grams", "icon": null },
      { "name": "Queijo branco", "quantity": 200, "unit": "grams", "icon": null }
    ],
    "alt_items": [
      { "name": "Quinoa", "icon": null },
      { "name": "Cuscuz marroquino", "icon": null },
      { "name": "Grão-de-bico", "icon": null },
      { "name": "Lentilha", "icon": null },
      { "name": "Proteína de soja", "icon": null },
      { "name": "Hambúrguer de grão-de-bico", "icon": null },
      { "name": "Ricota", "icon": null },
      { "name": "Iogurte natural", "icon": null }
    ]
  }
  ```

* **UI Components**

  * shadcn/ui: Card, Button, Collapse/Accordion
  * Tailwind CSS for responsive layout
  * lucide-react for generic food icon

* **Performance**

  * N/A

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
//import lucide-react generic icon

export default function ShoppingList() {
  const supabase = useSupabaseClient();
  const [mainIngredients, setMainIngredients] = useState([]);
  const [altIngredients, setAltIngredients] = useState([]);

  useEffect(() => {
    async function fetchIngredients() {
      const { data } = await supabase
        .from("user_current_diet")
        .select("*, diets(*)")
        .eq("user_id", supabase.auth.user().id)
        .eq("is_active", true)
        .single();
      
      // parse main block of items
      const mainAgregated = aggregateMainIngredients(data);
      setMainIngredients(mainAgregated);

      // parse alternative block of items
      const altAgregated = aggregateAltIngredients(data);
      setAltIngredients(altAgregated);
    }
    fetchIngredients();
  }, []);

  return (
    <div className="shopping-list">
      <h1>Shopping List</h1>
      <span>Select the time-period for total sum calculation:</span>
      <!-- onclick triggers re-calculations  -->
      <input type="radio" value="week"><label for="week">Week</label>
      <input type="radio" value="month"><label for="month">Month</label>
      <br />
      <h2>Main ingredients</h2>
      {mainIngredients.map(item => (
        <div key={item.id} className="ingredient-card">
          <span>{item.name} – {item.quantity} {item.unit}</span>
        </div>
      ))}
      <br />
      <h2>Alternative ingredients</h2>
      <h3><!-- Text here for users about alternative items in the diet --></h3>
      {altIngredients.map(item => (
        <div key={item.id} className="ingredient-card">
          <span>{item.name}</span> <!-- no unit and quantity for alt items -->
        </div>
      ))}
      <button onClick={() => navigate("/export-pdf")}>Export / Print</button>
    </div>
  );
}
```

---

## Acceptance Criteria

* Displays all main and alternative ingredients
* Shows total quantities per ingredient
* Period seletion with recalculation logic
* Export button navigates to 7.2
* Empty state and error handling present

---

## Security Considerations

* Users can only access their **own current diet**
* No sensitive info is exposed

---

## Next.js App Routing & Middleware

* Route: `/shopping-list`
* Middleware:

  * Authenticated session required → redirect `/login`
  * Onboarding uncompleted → redirect `/onboarding`

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → fetch diet and ingredients
* `shadcn/ui` → Card, Button, Accordion
* Optional: `jsPDF` for PDF export, later in 7.2

### Supabase SQL Checks

```sql
-- Fetch current diet with shopping_plan for ingredient aggregation
SELECT d.shopping_plan
FROM user_current_diet u
JOIN diets d ON d.id = u.diet_id
WHERE u.user_id = '<user_id>' AND u.is_active = true;
```

---



---

# Screen ID: 7.2 – Export / Print PDF (Shopping List)

## Overview

This is NOT a new page/screen. It should be a model or popup or just the trigger to PDF download. The shopping list has already been formated by the screen 7.1 (see lines 3392 to line 3640).
The **Export / Print PDF** component is responsible for generating a downloadable version of the user’s **shopping list**.

**Main Goals:**

* Provide a clear, printable shopping list for offline use
* Allow users to download
* Ensure data matches the shopping list generated (7.1 – Shopping List)
* Maintain a simple, responsive layout

---

## Components of PDF content

1. **Header**

   * Title: "Shopping List”

2. **Shopping List Table / Card**

   * All ingredients as displayed in /shopping-list page AND mandatory to keep quantities as calculated by the user in screen. The /shopping-list page let's user choose quantities calculated for a week or a month. Must be stored for printing the PDF.

3. **Controls / Actions**

   * **Export PDF (button in page 7.1 /shopping-list)** → triggers PDF generation & download

---

## Functional Requirements

1. **PDF Generation**

   * Use **client-side library** like **jsPDF** or **pdf-lib**
   * Include:

     * All content in the /shopping-list screen
   * Generate **well-formatted, paginated PDF** if list is long

2. **Dynamic Data**

   * Aggregate shopping list from **7.1 – Shopping List**
   * Maintain quantities displayed on page

---

## Technical Notes

* **Libraries / Helpers**

  * jsPDF: generate PDF client-side, customize fonts, add table and headings
  * html2canvas (optional) for snapshot of table to PDF
  * Tailwind CSS for on-screen table styling
  * shadcn/ui for buttons

* **Routing**

  * 7.1 Shopping List → click **Export PDF** → triggers generation & PDF file opening for download

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import jsPDF from "jspdf";
import { Button } from "@shadcn/ui";

export default function ExportPDF({ items, weekLabel }: { items: ShoppingItem[], weekLabel: string }) {

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "portrait" });
    doc.setFontSize(16);
    doc.text(`Shopping List - ${weekLabel}`, 10, 20);

    let y = 30;
    items.forEach(item => {
      doc.text(`${item.category} - ${item.name}: ${item.quantity} ${item.unit}`, 10, y);
      y += 10;
    });

    doc.save(`shopping-list-${weekLabel}.pdf`);
  };

  );

  {"<!-- Check /shopping-list page for the actual implementation and plug new function above inside onClick of export button -->"}
}
```

---

## Acceptance Criteria

* Users can download a PDF containing all items from the weekly diet
* PDF generation works on desktop and mobile
* Data in PDF matches the aggregated shopping list on 7.1

---

## Security Considerations

* Only logged-in users can access their shopping list
* No sensitive personal data is exposed in PDF (only diet items, quantities, and optional notes)

---

## Next.js App Routing & Middleware

* Route: `/shopping-list/`
* Middleware checks authentication via Supabase session
* Redirect to `/login` if unauthenticated

---



---

# Screen ID: 8.1 — Leaderboard / Ranking (REVISED)

## Overview

The Ranking screen shows a simple leaderboard **based exclusively on experience points (exp)**. Privacy is preserved: only the user's alias (`profiles.user_alias`) and avatar are shown (never real name or email). The leaderboard is intentionally simple for the MVP: no filters, no multiple metrics — just one global ranking by `exp`.

**Key goals**

* Motivate users via social comparison using experience points.
* Show top positions (1..3) with trophy icons (gold/silver/bronze).
* Make it easy for a user to find themselves in the ranking.
* Respect privacy (show alias and avatar only).

---

## New / Modified DB objects (reminder)

* `user_metrics`: removed `adherence_percentage`, `meals_completed`, `total_meals` and period fields, and removed `user_metrics_adherence_percentage_check` constraint.
* `profiles`: added `user_alias TEXT DEFAULT 'alias_temp'`.
* `leaderboard_metrics`: **dropped**.
* `users_metrics_view`: a view that shows the `user_metrics` rows joined with `profiles.user_alias`. This view is the *source of truth* for leaderboard queries.

---

## Database changes

### **IMPORTANT:** Cursor, please address the necessary changes to supabase schema classes in the application!

```sql

-- 1) Create a view users_metrics_view that exposes users metrics
-- The view returns: id (uuid), user_id (uuid), exp (int), user_alias (text)
CREATE OR REPLACE VIEW public.users_metrics_view AS
SELECT
  um_latest.id,
  um_latest.user_id,
  um_latest.exp,
  p.user_alias
FROM (
  SELECT 
    um.user_id,
    um.id,
    um.exp
  FROM public.user_metrics um
  WHERE um.exp IS NOT NULL
) AS um_latest
JOIN public.profiles p
  ON p.user_id = um_latest.user_id;

```

---

## Components (UI)

1. **Header**

   * Title: "Leaderboard"
   * Small subtitle: "Top users by experience"
   * Avatar + exp display remain in the global app header (see technical notes).

2. **Leaderboard list area**

   * Visual layout (desktop): large vertical list/card.
   * Each row displays:

     * Rank number (1,2,3...)
     * Trophy icon for positions 1..3 (gold, silver, bronze)
     * Avatar (user's avatar URL — the app already manages avatars in profiles)
     * Alias (`user_alias`) — ALWAYS shown, never real name/email
     * Experience points (exp) — integer
   * Row style: highlight current user (distinct background or border).

4. **Composition of the list**

   * The rendered list is constructed as:

     1. Top 5 users (ranks 1..5)
     2. Current user row (the current user's rank and row)
     3. Next 4 users immediately after current user's rank (if any)
   * If current user is in top 5, then show ranks 1..9 (first five already include current user) — apply logic below for duplicates and bounds.

5. **Empty / placeholder state**

   * If fewer than 1 users exist, show CTA encouraging onboarding.

---

## Functional Requirements (detailed)

### Source of data

* Use the **view** `public.users_metrics_view` as the source for all ranking queries. The view exposes the latest `user_metrics` row per user and the `user_alias`.

### Primary queries & logic

When the page loads perform the following steps server-side or client-side via Supabase:

1. **Fetch Top 5**

   ```sql
   SELECT id, user_id, exp, user_alias
   FROM public.users_metrics_view
   ORDER BY exp DESC NULLS LAST
   LIMIT 5;
   ```

2. **Fetch the current user's rank and row**

   * Determine the current user's rank via counting number of users with higher exp:

   ```sql
   SELECT COUNT(*) + 1 AS rank, u.*
   FROM public.users_metrics_view u
   WHERE u.exp > (SELECT exp FROM public.users_metrics_view WHERE user_id = :current_user_id)
   ;
   -- plus fetch current user's row separately:
   SELECT id, user_id, exp, user_alias
   FROM public.users_metrics_view
   WHERE user_id = :current_user_id;
   ```

   Or a single query using window functions:

   ```sql
   SELECT user_id, exp, user_alias, rank
   FROM (
     SELECT user_id, exp, user_alias,
       ROW_NUMBER() OVER (ORDER BY exp DESC NULLS LAST) AS rank
     FROM public.users_metrics_view
   ) t
   WHERE user_id = :current_user_id;
   ```

3. **Fetch the next 4 after current user (tail)**

   * If current user's rank = R, fetch ranks R+1..R+4:

   ```sql
   WITH ranked AS (
     SELECT user_id, exp, user_alias,
       ROW_NUMBER() OVER (ORDER BY exp DESC NULLS LAST) AS rank
     FROM public.users_metrics_view
   )
   SELECT user_id, exp, user_alias, rank
   FROM ranked
   WHERE rank BETWEEN (:current_rank + 1) AND (:current_rank + 4)
   ORDER BY rank;
   ```

4. **Compose final display array (client-side)**

   * Concatenate top5 (deduplicated) + current user row (if not already in top5) + next4.
   * Edge rules:

     * If current user is within top5, show top9 (top5 + next4).
     * If there are less than required rows, show what exists.
     * Always highlight current user visually.

### UI behavior

* No filters or period toggles are supported in MVP.

---

## Error handling

* If `users_metrics_view` query fails → show toast "Unable to load leaderboard. Try again later."
* If `exp` is null for many users → treat as 0 (sort behavior should handle NULLS LAST).
* If current user not found in view → show "You are not ranked yet — start by gaining experience!" and show top5.

---

## Security & Privacy

* Use RLS so that the app cannot leak other sensitive columns (but view only exposes safe fields).
* Only `user_alias` and `avatar_url` and `exp` should be used in the list.
* Ensure any server-side queries do not expose emails or real names.

---

## Acceptance criteria

* [ ] Ranking renders top5 users by `exp` from `users_metrics_view`.
* [ ] Current user row is computed and inserted into the list between the top5 and next4 correctly.
* [ ] Shows trophy icons for positions 1/2/3 (gold/silver/bronze).
* [ ] Shows alias and avatar (never real name/email).
* [ ] "Show my position" button scrolls to user row and highlights it.
* [ ] On DB changes to `user_metrics` (exp updated), a refresh of the view data updates the leaderboard.

---

## Suggested client pseudo-code (React / Next.js)

```ts
// high-level flow: fetch top5, fetch current user rank, fetch next4; compose array
async function fetchLeaderboard(userId) {
  // 1) top 5
  const top5 = await supabase
    .from('users_metrics_view')
    .select('id,user_id,exp,user_alias,avatar_url')
    .order('exp', { ascending: false })
    .limit(5);

  // 2) current user row + rank (using window function endpoint or computed server-side)
  const { data: current } = await supabase.rpc('get_user_rank_and_row', { p_user_id: userId });

  // 3) next 4 after current rank (if any)
  const next4 = await supabase.rpc('get_users_by_rank_range', { start_rank: current.rank + 1, end_rank: current.rank + 4 });

  // Compose array respecting duplicates
  let rows = top5.rows;
  if (!rows.some(r => r.user_id === current.user_id)) {
    rows = rows.concat([current.row]);
  }
  rows = rows.concat(next4.rows);

  return rows;
}
```

> Note: We suggested `rpc` functions for convenience (optional). You may instead implement the queries directly in the API route.

---

## Integration & Implementation notes (Cursor / Dev instructions)

1. **Data source**: use `public.users_metrics_view`. Do not reference `leaderboard_metrics` (dropped).
2. **Rank calculation**:

   * Implement either:

     * SQL window functions on the view to compute ranks, or
     * Server-side rank calculation by counting users with greater `exp`.
   * Using window functions simplifies fetching surrounding rows in one query.
3. **Avatar**: if `users_metrics_view` doesn't include avatar\_url, join `profiles.avatar_url` as needed. The view currently contains `user_alias`; expand the view to include `avatar_url` if convenient:

   ```sql
   -- optional alter of view to include avatar_url
   CREATE OR REPLACE VIEW public.users_metrics_view AS
   SELECT
     um_latest.id,
     um_latest.user_id,
     um_latest.exp,
     p.user_alias,
     p.avatar_url
   FROM ( ... ) um_latest
   JOIN public.profiles p ON p.user_id = um_latest.user_id;
   ```
4. **Server endpoints**:

   * Create a protected endpoint (GET `/api/leaderboard`) that:

     * Accepts `current_user_id`.
     * Returns the composed array (top5 + current + next4) in one response for simpler client rendering.
5. **UX**:

   * Add trophy icons for ranks 1..3.
6. **Testing**:

   * After changing `user_metrics` values, refresh view results.
   * If you later switch to materialized view for performance, refresh strategy must be scheduled.

---

## Example server-side SQL using window function (single query to get rank & rows)

This query builds ranks for all users; for production with many users you may optimize, but it is fine for MVP:

```sql
WITH ranked AS (
  SELECT
    user_id,
    exp,
    user_alias,
    avatar_url,
    ROW_NUMBER() OVER (ORDER BY exp DESC NULLS LAST) AS rank
  FROM public.users_metrics_view
)
SELECT * FROM ranked
ORDER BY rank
LIMIT 1000; -- or limit as needed, then client composes the final array
```

**To get top 5**:

```sql
SELECT * FROM (
  SELECT user_id, exp, user_alias, avatar_url, ROW_NUMBER() OVER (ORDER BY exp DESC NULLS LAST) AS rank
  FROM public.users_metrics_view
) t
WHERE rank <= 5
ORDER BY rank;
```

**To get current user row with rank** (single query):

```sql
SELECT * FROM (
  SELECT user_id, exp, user_alias, avatar_url, ROW_NUMBER() OVER (ORDER BY exp DESC NULLS LAST) AS rank
  FROM public.users_metrics_view
) t
WHERE user_id = :current_user_id;
```

**To get next 4 after current user's rank**:

```sql
WITH ranked AS (
  SELECT user_id, exp, user_alias, avatar_url, ROW_NUMBER() OVER (ORDER BY exp DESC NULLS LAST) AS rank
  FROM public.users_metrics_view
)
SELECT * FROM ranked WHERE rank BETWEEN (:current_rank + 1) AND (:current_rank + 4);
```

---

## Migration notes summary (what changed)

* Dropped columns from `user_metrics`: `adherence_percentage`, `meals_completed`, `total_meals`.
* Dropped constraint `user_metrics_adherence_percentage_check`.
* Added `profiles.user_alias` (TEXT default `'alias_temp'`).
* Dropped table `leaderboard_metrics`.
* Created view `users_metrics_view` to support ranking queries.

---



---

# Experience Points System (XP)

### Overview

The **Experience Points (XP)** system is the foundation of user progression and gamification in the app. XP is stored in the `exp` column of the `user_metrics` table and is updated whenever the user performs specific actions. The XP system directly feeds into the leaderboard (Screen 8.1) and is also displayed persistently in the global header, next to the user avatar.

---

## New / Modified DB objects (reminder)

* `user_metrics`: removed `adherence_percentage`, `meals_completed`, `total_meals` and period fields, and removed `user_metrics_adherence_percentage_check` constraint.
* `profiles`: added `user_alias TEXT DEFAULT 'alias_temp'`.
* `leaderboard_metrics`: **dropped**.

---

## Database changes

### **IMPORTANT:** Cursor, please address the necessary changes to supabase schema classes in the application!

```sql
-- 1) Drop adherence constraint (if exists) and remove unused columns from user_metrics
ALTER TABLE public.user_metrics
  DROP CONSTRAINT IF EXISTS user_metrics_adherence_percentage_check;

ALTER TABLE public.user_metrics
  DROP COLUMN IF EXISTS adherence_percentage,
  DROP COLUMN IF EXISTS meals_completed,
  DROP COLUMN IF EXISTS total_meals;
  DROP COLUMN IF EXISTS period_start;
  DROP COLUMN IF EXISTS period_end;

-- 2) Add user_alias column to profiles
-- Assumes a table named "profiles" exists in "public" schema.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_alias TEXT DEFAULT 'alias_temp';

-- 3) Drop table leaderboard_metrics (no longer used)
DROP TABLE IF EXISTS public.leaderboard_metrics;

```

---

### Core requirements

1. **Database persistence**

   * Field: `exp` (integer) in `user_metrics`.
   * The application must always read and update XP in this column.
   * First user row should be inserted after user completes the onboarding process.

2. **Global header display**

   * Next to the user's avatar in the top navigation bar, always display:

     * `user_alias`
     * Current `exp`
   * Must update in real-time whenever XP is increased (e.g., after inserting a new weight log).

3. **Experience Service**

   * Create a dedicated service class/module: `ExperienceService`.
   * Methods:

     * `getCurrentXP(userId: UUID): number`

       * Fetches current XP from `user_metrics`.
     * `increaseXP(userId: UUID, amount: number): number`

       * Increments XP in the database.
       * Updates client global state (React Context/Store).
       * Returns the new total XP.
   * Implementation details:

     * Server: secured Supabase call to update `user_metrics.exp`.
     * Client: after successful server update, refresh local state and re-render the header XP value.

4. **Integration point for first uses of the service**

   * When user **completes the onboard process** in the `/onboarding` page:

     * Call `ExperienceService.increaseXP(userId, 100)`
     * This increments the XP by 100 points.
     * The global header should immediately reflect the updated XP.
   
   * Whenever a user **inserts a new weight log record** in the `/profiles` page:

     * Call `ExperienceService.increaseXP(userId, 100)`
     * This increments the XP by 100 points.
     * The global header should immediately reflect the updated XP.

---

### Pseudo-code

```ts
// experienceService.ts
import { supabase } from "@/lib/supabaseClient";

export async function getCurrentXP(userId: string) {
  const { data, error } = await supabase
    .from("user_metrics")
    .select("exp")
    .eq("user_id", userId)
    .limit(1)
    .single();

  if (error) throw error;
  return data.exp || 0;
}

export async function increaseXP(userId: string, amount: number) {
  // Get current XP
  const currentXP = await getCurrentXP(userId);
  const newXP = currentXP + amount;

  // Update DB
  const { error } = await supabase
    .from("user_metrics")
    .update({ exp: newXP })
    .eq("user_id", userId);

  if (error) throw error;

  // Update global state (React Context / Store)
  updateGlobalXPState(newXP);

  return newXP;
}
```

**Example integration inside `/profiles` when inserting new weight log:**

```ts
async function handleAddWeightLog(newWeight) {
  await supabase.from("weight_logs").insert({
    user_id: currentUser.id,
    weight: newWeight,
    created_at: new Date().toISOString()
  });

  // Award XP
  await increaseXP(currentUser.id, 100);
}

```
**Use the example above and add integration to the /onboarding page too**

---

### Acceptance criteria

* [ ] The header always shows the correct `exp` for the logged-in user.
* [ ] `ExperienceService.increaseXP` updates both the database and the client-side global state.
* [ ] Finishing onboarding in `/onboarding` page increases XP by **+100**.
* [ ] Adding a new weight record on `/profiles` increases XP by **+100**.
* [ ] Leaderboard reflects XP changes after refresh (Screen 8.1).
* [ ] No sensitive data (emails, names) exposed — only `user_alias`, avatar, and XP are used.

---



# Screen ID: 9.1 – User Hub ("Me")

## Overview

The **User Hub** is the central screen for the user to access other personal sub-screens **weight log (9.2), badges (9.3), subscription (9.6), profile (9.8), security (9.9),  privacy (9.10)**. It serves as the main entry point to personal information and engagement tools.

**Main Goals:**

* Central navigation hub for the user to other personal pages (some already implemented, some not yet)
  * 9.1 – User Hub: /app/me/page.tsx
  * 9.2 - Weight log: /app/me/weight-log/page.tsx
  * 9.3 - Badges: /app/me/badges/page.tsx
  * 9.6 - Badges: /app/me/subscription/page.tsx
  * 9.8 - Profile: /app/profile/page.tsx
  * 9.9 - Security: /app/me/security/page.tsx
  * 9.10 - Privacy: /app/me/privacy/page.tsx

---

## Components

* **Header**

  * Title: User Hub”

* **Quick Navigation Tiles**

  * Display cards to all pages listed in the Main Goals above. Navigates to pages when cards is clicked.
  * Desktop: display 2 column grid, big cards with large icon in the center and label below, all centered
  * Mobile: display 1 column grid, low height cards (like a vertical list) with small icon on the left and label on right

---

## Functional Requirements

1. **Navigation**

   * Each tile / card navigates to its corresponding screen
   * Consistent back navigation to Dashboard from sub-screens

2. **Responsive Layout**

   * Dashboard adapts to desktop and mobile

---

## Error Handling

* N/A

---

## Navigation

* From User Hub: /app/me/page.tsx

  * 9.2 - Weight log: /app/me/weight-log/page.tsx
  * 9.3 - Badges: /app/me/badges/page.tsx
  * 9.6 - Badges: /app/me/subscription/page.tsx
  * 9.8 - Profile: /app/profile/page.tsx
  * 9.9 - Security: /app/me/security/page.tsx
  * 9.10 - Privacy: /app/me/privacy/page.tsx

* Back navigation → Home / Dashboard itself is the root after login

---

## Technical Notes

* **UI Components**

  * shadcn/ui: Card
  * Tailwind CSS → responsive grid layout

* **Performance**

  * N/A

---

## Suggested Implementation Snippet (client pseudo-code)

* use the same style as the latest pages implemented

## Acceptance Criteria

* Shows actionable navigation tiles to sub-pages

---

## Security Considerations

* N/A

---

## Next.js App Routing & Middleware

* Route: `/me`
* Middleware:

  * Authenticated session required → redirect `/login`
  * Onboarding uncompleted → redirect `/onboarding`

---

## Integration & Server-Side Details

### Libraries & Helpers

* `shadcn/ui` → Card
* Tailwind CSS → responsive layout

---


---

# Screen ID: 9.2 – User Weight Log ("Registro de Peso")

## Overview

The **User Weight Log** screen allows users to **record, view, and edit their weekly or historical weight entries**. It is central to tracking progress and enabling other features like badges, rankings, and adherence calculations.

**Main Goals:**

* Let users **add, edit, or delete** weight entries.
* Display a **graph of weight progression** over selectable periods.
* Integrate with dashboard and gamification system for badge triggering.

#Rule to implement:
* On the "Me > Weight Log" screen, there is a button like: **"Update diet recommendations using AI"**.
* Behavior:
  1. Button is disabled for **1 week** after onboarding and then after each use - **use cooldownHours logic implemented in step 3.2.2** .
  2. When clicked:
     - Fetch the latest user profile data from the database.
     - Fetch all diet records from the catalog.
     - Send a request to the AI API.
     - Persist the returned recommendations in the `diet_recommendations` table.
* This allows users to refresh recommendations while respecting the weekly limit.

---

## Components

* **Header**

  * Title: “Weight Log” or “Registro de Peso”
  * Back button → Dashboard (9.1)

* **Add New Weight Entry**

  * Input: Weight in kg (numeric)
  * Date picker (defaults to current date)
  * Button: “Add / Save”

* **Edit / Delete Entry**

  * Tap on existing entry → open edit modal
  * Change weight or date
  * Delete button to remove entry

* **Weight Graph**

  * Line or area chart showing progression
  * Selectable period: 1 week, 1 month, 3 months
  * Optional mini tooltip for each data point showing date and weight

* **Empty / Placeholder State**

  * Message: “No weight entries yet. Add your first entry to start tracking.”
  * Rule: To overcome this, always set the onboarding weight as the first log! Include an insert to `user_metrics` after onboarding submission!

---

## Functional Requirements

1. **Create / Update / Delete Weight Entries**

   * Validate weight values (e.g., numeric, reasonable range 30–300 kg)
   * Update Supabase table `user_metrics`
   * Trigger badge checks when new entries are added

2. **Graph Rendering**

   * Fetch all user entries for selected period
   * Plot date vs weight dynamically

3. **Navigation**

   * Back → Dashboard (9.1)
   * Integrates dynamically with dashboard mini chart

---

## Error Handling

* Invalid input → toast: “Please enter a valid weight.”
* Save fails → toast: “Unable to save entry. Try again.”
* Delete fails → toast: “Unable to delete entry. Try again.”

---

## Navigation

* From Weight Log →

  * Dashboard (9.1)
  * Mini-chart updates dynamically on save
  * Badge system listens for streaks or milestones

---

## Technical Notes

* **Supabase Tables**

  * `user_metrics` → columns: `id`, `user_id`, `weight`, `date`, `created_at`, `updated_at`

* **UI Components**

  * shadcn/ui: Input, Button, Modal, Datepicker, Chart
  * Tailwind CSS → responsive layout

* **Performance**

  * Fetch only last 90 days for graph by default, paginate older data if needed

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function WeightLog() {
  const supabase = useSupabaseClient();
  const [weights, setWeights] = useState([]);
  const [newWeight, setNewWeight] = useState("");
  const [date, setDate] = useState(new Date());

  const userId = supabase.auth.user().id;

  useEffect(() => {
    async function fetchWeights() {
      const { data } = await supabase
        .from("user_metrics")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: true });
      setWeights(data);
    }
    fetchWeights();
  }, []);

  async function addWeight() {
    if (!newWeight || isNaN(newWeight)) return alert("Enter a valid weight");
    await supabase.from("user_metrics").insert([{ user_id: userId, weight: newWeight, date }]);
    setNewWeight("");
    // refresh weights
  }

  async function deleteWeight(entryId) {
    await supabase.from("user_metrics").delete().eq("id", entryId);
    // refresh weights
  }

  return (
    <div className="weight-log">
      <h1>Weight Log</h1>
      <input type="number" value={newWeight} onChange={e => setNewWeight(e.target.value)} />
      <input type="date" value={date.toISOString().split("T")[0]} onChange={e => setDate(new Date(e.target.value))} />
      <button onClick={addWeight}>Add / Save</button>
      <WeightChart data={weights} />
      {weights.map(w => (
        <div key={w.id}>
          <span>{w.date}</span> <span>{w.weight}kg</span>
          <button onClick={() => deleteWeight(w.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

---

## Acceptance Criteria

* Users can **add, edit, and delete** weight entries
* Graph updates dynamically based on entries and selected period
* Handles empty state and invalid input gracefully
* Integrates with dashboard mini chart and badge triggers

---

## Security Considerations

* Users only access their **own weight data** (RLS policies on Supabase)
* Validate numeric input to prevent injection
* Secure API requests via Supabase auth

---

## Next.js App Routing & Middleware

* Route: `/me/weight-log`
* Middleware:

  * Authenticated session required → redirect `/login`
  * Onboarding completed → redirect `/onboarding`

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → CRUD on `user_metrics`
* `shadcn/ui` → Input, Button, Modal, Chart
* Tailwind CSS → layout and responsiveness

### Supabase SQL Checks

```sql
-- Insert weight entry
INSERT INTO user_metrics (user_id, weight, date) VALUES ('<user_id>', 75, '2025-08-26');

-- Update weight entry
UPDATE user_metrics SET weight = 74.5 WHERE id = '<entry_id>';

-- Delete weight entry
DELETE FROM user_metrics WHERE id = '<entry_id>';

-- Fetch weight entries
SELECT * FROM user_metrics WHERE user_id = '<user_id>' ORDER BY date ASC;
```

---


# Screen ID: 9.3 — My Badges (Full spec)

### Overview

**Purpose:** display the badges the user has earned and allow the user to inspect badge details (criteria, earned\_at, progress). Also provide a backend badge-validation engine (server-side) that is *generic* and uses the `badges.criteria` JSON to decide whether a badge is unlocked.

**Goal:** make badge configuration data-driven (no code change to add a new JSON-implementable badge) and make validations run on relevant events.

---

### Components (UI)

* **Page Header**: Title "My Badges" and short subtitle.
* **Earned Badges Grid**:

  * For each unlocked badge show: icon (generic in MVP), title, short description, `awarded_at`.
  * Order by `badges.weight` (descending) and then `awarded_at` (most recent first).
* **All Badges Grid (explore)**:

  * Shows badges, even if not earned.
  * Ordering: `weight` desc.
* **Badge Detail Modal**:

  * On click show full description, criteria summary, and if earned show `awarded_at`.
* **Empty state**:

  * Motivational copy and CTA to encourage first actions (choose a diet, export shopping list, add weight).

---

### Data model (relevant tables)

* `badges (id, slug, title, description, criteria jsonb, weight int, visibility boolean, icon_name, created_at)`
* `user_badges (user_id, badge_id, awarded_at timestamptz)`
* `user_current_diet (id, user_id, diet_id, started_at, is_active)`
* `weights` (user\_id, weight\_kg, measured\_at)
* `user_metrics (user_id, exp, ...)`

---

### MVP badge list

* **First Diet Chosen** — *"Descobridor"*

  * Event: user selected their first diet (user\_diets count >= 1)
* **Third Diet Switch** — *"Bon Vivant!"*

  * Event: user has switched diets at least 3 times (count of user\_diets entries or count of changes)
* **7-days on same diet** — *"Mestre da Resiliência"*

  * Event: user\_current\_diet.started\_at ≤ now − 7 days
* **Shopping List Export (1st time)** — *"Estrategista"*

  * Event: user triggered shopping list export (front sends event)
* **Weight-loss milestones** — multiple badges:

  * 1 kg lost, 2 kg, 3 kg, 5 kg, 7 kg, 10 kg — event: weight\_loss ≥ threshold (kg)
* **Experience milestones** — multiple badges:

  * 1000, 2000, 3000, 5000, 10000, 50000, 100000 exp — event: experience ≥ threshold

**Removed (NOT in MVP):**

* Streak-based badges (daily check-ins) — removed per your instruction.
* Consistency/meal-check badges (requires check-in feature) — removed.

---

### Badge Criteria JSON spec (template + examples)

This section defines the JSON schema that will be stored in `badges.criteria` (jsonb). The backend validation engine (server-side) must parse this and evaluate conditions for each candidate badge. Keep the engine generic — it should support evaluation of the events below based on these keys.

#### Allowed top-level keys (all optional except `event`)

```json
{
  "event": "<string>",            // required. event name the badge listens to (see allowed events)
  "operator": "<string>",         // optional. default: "gte" (>=). other: "gt","eq","lte","lt"
  "count": <integer>,             // optional. when the rule is based on counts (number of occurrences)
  "distinct": <boolean>,          // optional. for count: count distinct values (e.g., distinct diet ids)
  "threshold": <number>,          // optional. numeric threshold (kg, exp etc.)
  "unit": "<string>",             // optional. semantic unit: "kg", "exp", "days"
  "duration_days": <integer>,     // optional. used for duration checks (e.g. 7 days)
  "window_days": <integer>,       // optional. time-window for counts (e.g. last 30 days)
  "target": "<string|int|null>",  // optional. target id or scope (e.g. diet_id) or "any"
  "description": "<string>",      // optional human-readable note
  "meta": { }                     // optional free-form meta to help custom rules
}
```

##### Allowed `event` values and how to evaluate them

Below each `event` includes the recommended canonical SQL metric and an example criteria JSON.

---

#### `event`: `"diet_chosen"`

**Meaning:** user has chosen/followed at least `count` diets (or the first diet).
**Evaluation metric:** `SELECT COUNT(*) FROM user_diets WHERE user_id = $1` (optionally distinct by `diet_id` if `distinct=true`).
**Example** (first diet):

```json
{ "event": "diet_chosen", "operator": "gte", "count": 1, "description": "User chose a diet for the first time" }
```

---

#### `event`: `"diet_switches"`

**Meaning:** number of times user changed diet (or number of user\_current\_diet rows).
**Evaluation metric:** `SELECT COUNT(*) FROM user_current_diet WHERE user_id = $1`
**Example** (>= 3 switches):

```json
{ "event": "diet_switches", "operator": "gte", "count": 3, "distinct": false }
```

---

#### `event`: `"diet_duration"`

**Meaning:** the user has been following current diet for at least N days.
**Evaluation metric:** `SELECT started_at FROM user_current_diet WHERE is_active = true AND user_id = $1` then `now() - started_at >= interval 'duration_days days'`.
**Example** (7 days):

```json
{ "event": "diet_duration", "duration_days": 7, "operator": "gte", "description": "User kept same diet for 7 days" }
```

---

#### `event`: `"shopping_exported"`

**Meaning:** user exported the shopping list. The front-end server must call validation when export action happens.
**Evaluation metric:** trigger check on the export function.
**Example** (first export):

```json
{ "event": "shopping_exported", "operator": "gte", "count": 1, "description": "Exported shopping list once" }
```

---

#### `event`: `"weight_loss"`

**Meaning:** user lost ≥ `threshold` (kg) relative to initial weight (onboarding weight) or relative to highest earlier weight. We define it as `initial_weight - min(weights.weight_kg) >= threshold`.
**Evaluation metric:**

```sql
SELECT (p.weight_start_kg - (SELECT MIN(weight_kg) FROM weights WHERE user_id = $1)) AS kg_loss
FROM profiles p WHERE p.user_id = $1;
```

**Example** (5 kg milestone):

```json
{ "event": "weight_loss", "operator": "gte", "threshold": 5, "unit": "kg", "description": "Lose 5 kg" }
```

---

#### `event`: `"experience"`

**Meaning:** user total experience reaches threshold (value stored in `user_metrics.exp`).
**Evaluation metric:** `SELECT exp FROM user_metrics WHERE user_id = $1`
**Example** (2,000 exp):

```json
{ "event": "experience", "operator": "gte", "threshold": 2000, "unit": "exp", "description": "Reach 2000 exp" }
```

---

#### Notes / parsing rules

* `operator` default is `"gte"` (≥). If `operator` is missing, assume `>=`.
* `count` is an integer used for counting events/rows.
* `distinct:true` indicates counting *distinct* values (e.g., distinct `diet_id`).
* `duration_days` used for `diet_duration` checks where you read `user_current_diet.started_at`.
* `target` may be used for badges that are tied to a *specific* diet id (not used in MVP but supported).
* `window_days` allows restricting counts to a recent period (e.g., last 30 days).
* `meta` is opaque and may be used by advanced rules later.

---

#### Example `badges.criteria` entries (SQL-friendly JSON strings)

* **First diet chosen (Descobridor)**

```sql
'{"event":"diet_chosen","count":1,"operator":"gte"}'::jsonb
```

* **Third diet switch (Bon Vivant!)**

```sql
'{"event":"diet_switches","count":3,"operator":"gte"}'::jsonb
```

* **7 days same diet (Mestre da Resiliência)**

```sql
'{"event":"diet_duration","duration_days":7,"operator":"gte"}'::jsonb
```

* **Export Shopping List first time (Estrategista)**

```sql
'{"event":"shopping_exported","count":1,"operator":"gte"}'::jsonb
```

* **Weight loss 1kg milestone**

```sql
'{"event":"weight_loss","threshold":1,"unit":"kg","operator":"gte"}'::jsonb
```

* **Experience 1000 milestone**

```sql
'{"event":"experience","threshold":1000,"unit":"exp","operator":"gte"}'::jsonb
```

---

### Functional requirements (UI + validation engine)

**UI:**

1. Fetch unlocked badges:

   ```sql
   SELECT b.*, ub.awarded_at
   FROM badges b
   LEFT JOIN user_badges ub ON ub.badge_id = b.id AND ub.user_id = $1
   WHERE ub.user_id = $1
   ORDER BY b.weight DESC, ub.awarded_at DESC;
   ```
2. Fetch badges (to display badges):

   ```sql
   SELECT * FROM badges ORDER BY weight DESC;
   ```
**Validation engine (server):**

* Implement a server function `validateBadgesForUser(user_id, event, payload)` that:

  1. Loads candidate badges: `SELECT id, criteria FROM badges WHERE criteria->>'event' = event`.
  2. For each candidate parse `criteria` and run the corresponding evaluator (SQL metric). See "Validation SQL examples" below.
  3. If criteria satisfied AND user does not already have `user_badges.badge_id`, then `INSERT INTO user_badges (user_id,badge_id,awarded_at,meta) VALUES (...)`.
  4. Return list of newly earned badges so front-end can display a animated pop-up

---

### Validation SQL examples (server-side helpers)

Below are canonical SQL snippets to evaluate conditions for each `event`. Cursor should implement these checks server-side in Node/TS or plpgsql. They are written as parameterized queries (replace `$1` with user\_id).

#### diet\_chosen (count)

```sql
SELECT COUNT(*)::int AS cnt
FROM user_diets
WHERE user_id = $1;
-- evaluate cnt operator count
```

#### diet\_switches (count)

If `user_current_diet` records each follow with timestamp, switches ≈ number of rows (or distinct diet ids):

```sql
SELECT COUNT(*)::int AS switches
FROM user_diets
WHERE user_id = $1;
```

#### diet\_duration (duration\_days)

```sql
SELECT (now() - ucd.started_at) >= (interval '1 day' * (criteria->>'duration_days')::int) AS meets
FROM user_current_diet ucd
WHERE ucd.user_id = $1 and ucd.is_active = TRUE;
```

Or just compute server-side and compare.

#### shopping\_exported (count)

Validate immediately on the export CTA onclick (call validateBadgesForUser on export action).

#### weight\_loss (threshold kg)

Compute loss since onboarding:

```sql
SELECT (p.weight_start_kg - sub.min_weight) AS kg_loss
FROM profiles p
CROSS JOIN (
  SELECT MIN(weight_kg) AS min_weight
  FROM weights
  WHERE user_id = $1
) sub
WHERE p.user_id = $1;
```

Then compare `kg_loss` with `criteria.threshold`.

#### experience (threshold)

```sql
SELECT exp FROM user_metrics WHERE user_id = $1;
-- compare exp >= threshold
```

---

### When to run validation (exact moments)

Run validation for relevant event types immediately after the referenced action completes successfully:

* **After user chooses / follows a diet** → run `validateBadgesForUser(user_id, 'diet_chosen')` and `validateBadgesForUser(user_id, 'diet_switches')`.
* **When user exports shopping list** (server-side export handler) → run `validateBadgesForUser(user_id, 'shopping_exported')`.
* **After weight log `INSERT`** → run `validateBadgesForUser(user_id, 'weight_loss')`.
* **After EVERY user\_metrics.exp updated** → run `validateBadgesForUser(user_id, 'experience')`. (implement later when we create the exp mechanism)
* **Imediately after login** → run `validateBadgesForUser(user_id, 'diet_duration')`

---

### Badge awarding algorithm (pseudo-code)

```js
async function validateBadgesForUser(userId, event, payload = {}) {
  // 1) Fetch candidate badges
  const badges = await db.query(
    `SELECT id, criteria FROM badges WHERE criteria->>'event' = $1`, [event]
  );

  const newlyUnlocked = [];

  for (const badge of badges) {
    const criteria = badge.criteria;
    const meets = await evaluateCriteria(userId, criteria, payload);
    if (meets) {
      const exists = await db.oneOrNone(
        `SELECT 1 FROM user_badges WHERE user_id=$1 AND badge_id=$2`, [userId, badge.id]
      );
      if (!exists) {
        await db.none(
          `INSERT INTO user_badges (user_id, badge_id, awarded_at, meta) VALUES ($1,$2,now(),$3)`,
          [userId, badge.id, JSON.stringify({ method: event })]
        );
        newlyUnlocked.push(badge);
      }
    }
  }

  return newlyUnlocked;
}
```

`evaluateCriteria(userId, criteria, payload)` will implement the SQL checks listed earlier for the given `criteria.event`.

---

### Acceptance Criteria (features)

* [ ] The `badges` table stores `criteria` JSON following the template above. Cursor must add the new `weight INT` and `visibility BOOLEAN` columns (already created in supabase) in the typescript classes and schema files.
* [ ] The app UI shows earned badges ordered by `weight` then `awarded_at`.
* [ ] On every relevant event (login, experience update, diet selection, switch, shopping export, weight log insert, user\_metrics update), the server calls `validateBadgesForUser` and awards badges accordingly.
* [ ] The server ensures idempotence — awarding a badge once only.

---

### Security considerations

* Badge awarding must be server-side only. Never let the client directly insert into `user_badges`.
* All badge checks must be performed using server-validated SQL queries; do not trust client payloads.

---

### Migration / SQL (schema changes)

Add columns to `badges` (weight and visibility), a new column `exp` to `user_metrics` (if not present) and a new column `meta` to `user_badges`:

```sql
ALTER TABLE badges
  ADD COLUMN IF NOT EXISTS weight INT DEFAULT 0 CHECK (weight >= 0 AND weight <= 99),
  ADD COLUMN IF NOT EXISTS visibility BOOLEAN DEFAULT true;

ALTER TABLE user_metrics
  ADD COLUMN IF NOT EXISTS exp INT DEFAULT 0;

ALTER TABLE user_badges
ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;
```

(Columns already added in supabase. IMPORTANT: CURSOR MUST ADD THESE TO THE TYPESCRIPT CLASSES AND SCHEMA FILES)

---

### Implementation notes for Cursor.AI

* **Where to implement:** server code (Node.js / Next API route) — not in client — so that badge awarding is secure and authoritative.
* **Corner-case:** For `diet_switches` be clear which DB field counts as a "switch". Count `user_current_diet` rows or count distinct `diet_id` values in `user_current_diet`.
* **Progress calculation:** For `weight_loss`, compute `progress = min(100, (kg_loss / threshold) * 100)`.
* **Logging:** When awarding a badge insert `meta` with `{ "method":"event", "event":"diet_chosen", "value":... }` in table `user_badges` to help debug later.

---

### Example `badges` rows (SQL inserts)

Below are sample `badges` rows ready for insertion (you can adapt titles/weights):

```sql
INSERT INTO badges (slug, title, description, criteria, weight, visibility)
VALUES
('diet_first', 'Descobridor', 'Escolheu uma dieta pela primeira vez', '{"event":"diet_chosen","count":1}', 1, false),
('diet_switch_3', 'Bon Vivant!', 'Mudou de dieta 3 vezes', '{"event":"diet_switches","count":3}', 2, false),
('diet_7days', 'Mestre da Resiliência', 'Ficou na mesma dieta por 7 dias', '{"event":"diet_duration","duration_days":7}', 3, false),
('shopping_export_1', 'Estrategista', 'Exportou a lista de compras (primeira vez)', '{"event":"shopping_exported","count":1}', 4, false),
('loss_1kg', 'Mais Leve 1kg', 'Perdeu 1kg', '{"event":"weight_loss","threshold":1,"unit":"kg"}', 5, false),
('loss_2kg', 'Menos é Mais 2kg', 'Perdeu 2kg', '{"event":"weight_loss","threshold":2,"unit":"kg"}', 6, false),
('loss_3kg', 'Guerreiro Leve 3kg', 'Perdeu 3kg', '{"event":"weight_loss","threshold":3,"unit":"kg"}', 7, false),
('loss_5kg', 'Quebrador de Barriga 5kg', 'Perdeu 5kg', '{"event":"weight_loss","threshold":5,"unit":"kg"}', 8, false),
('loss_7kg', 'Atleta Oculto 7kg', 'Perdeu 7kg', '{"event":"weight_loss","threshold":7,"unit":"kg"}', 8, false),
('loss_10kg', 'Transformação Épica 10kg', 'Perdeu 10kg', '{"event":"weight_loss","threshold":10,"unit":"kg"}', 10, false),
('exp_1000', 'Aprendiz - 1K XP', 'Alcançou 1.000 de xp', '{"event":"experience","threshold":1000,"unit":"exp"}', 11, false),
('exp_2000', 'Praticante - 2K XP', 'Alcançou 2.000 de xp', '{"event":"experience","threshold":2000,"unit":"exp"}', 12, false),
('exp_3000', 'Entusiasta - 3K XP', 'Alcançou 3.000 de xp', '{"event":"experience","threshold":3000,"unit":"exp"}', 13, false),
('exp_5000', 'Veterano - 5K XP', 'Alcançou 5.000 de xp', '{"event":"experience","threshold":5000,"unit":"exp"}', 14, false),
('exp_10000', 'Mestre - 10K XP', 'Alcançou 10.000 de xp', '{"event":"experience","threshold":10000,"unit":"exp"}', 15, false),
('exp_50000', 'Lenda - 50K XP', 'Alcançou 50.000 de xp', '{"event":"experience","threshold":50000,"unit":"exp"}', 16, false),
('exp_100000', 'Imortal - 100K XP', 'Alcançou 100.000 de xp', '{"event":"experience","threshold":100000,"unit":"exp"}', 17, false)
;
```

---

### Final notes & recommended next steps

1. **Implement `validateBadgesForUser` server-side** (Node/TS) that:

   * loads candidate badges by `criteria->>'event'`
   * executes a small set of SQL checks (examples above) depending on `event`
   * inserts into `user_badges` if not already present
2. **Wire event triggers** in these server endpoints:

   * diet selection endpoint
   * user\_current\_diet update
   * shopping export CTA trigger
   * weight log insert
   * user\_metrics update
4. **Cursor deliverables**: implement server function, add DB migration (weight/visibility/exp) and implement `GET /api/badges` and `POST /api/badges/validate` endpoints.

---


# Screen ID: 9.4 – Achievement Toast ("Toast de Conquista")

## Overview

The **Achievement Toast** is a temporary pop-up notification that appears when a user **earns a new badge or reaches a milestone**. Its main goal is to **celebrate the user’s achievement** and encourage continued engagement.

**Main Goals:**

* Immediately notify users when they reach a milestone
* Provide a quick summary of the achievement
* Link to the full badge details for more information
* Appear unobtrusively without disrupting main workflow

---

## Components

* **Toast Container**

  * Appears in a corner of the screen (e.g., top-right or bottom-right)
  * Auto-dismiss after 3 seconds
  * Animations: slide-in and fade-out

* **Content**

  * Badge icon (colorful/animated)
  * Title (e.g., “Badge Earned!”)
  * Short description or metric (e.g., “3kg lost!” or “First week completed”)
  * CTA button or clickable area → Badge Detail (9.5)

* **Interaction**

  * Click on toast → open Badge Detail modal (9.5)
  * Hover → pause auto-dismiss timer

---

## Functional Requirements

1. **Trigger**

   * Fired when user completes a milestone or earns a new badge
   * Sources: Weight log (9.2), diet adherence, streaks, other gamified events

2. **Display**

   * Pop-up for 3 seconds
   * Non-blocking → user can continue current activity

3. **Link**

   * Click navigates to Badge Detail modal (9.5)
   * Optional tooltip: brief explanation of achievement

---

## Error Handling

* If toast fails to render → log error in console (non-critical)
* Avoid duplicate toasts for the same achievement

---

## Navigation

* Toast does **not interrupt navigation**
* On click → Badge Detail (9.5)
* Auto-dismiss → disappears smoothly, no further action

---

## Technical Notes

* **Supabase Tables**

  * Uses `user_badges` for earned achievements
  * Optional: `toast_queue` table if managing multiple notifications

* **UI Components**

  * shadcn/ui: Toast, Badge
  * Tailwind CSS → animations, responsive positioning

* **Performance**

  * Keep lightweight → client-side only display
  * Avoid heavy re-rendering of underlying pages

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { Toast } from "@shadcn/ui";
import { useEffect, useState } from "react";

export default function AchievementToast({ achievement }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <Toast className="fixed top-5 right-5 z-50 shadow-lg p-4 rounded-md bg-green-500 text-white">
      <div className="flex items-center gap-2">
        <img src={achievement.icon} alt={achievement.title} className="w-6 h-6" />
        <div>
          <p className="font-bold">{achievement.title}</p>
          <p className="text-md">{achievement.description}</p>
        </div>
      </div>
    </Toast>
  );
}
```

---

## Acceptance Criteria

* Appears when a badge is earned or milestone achieved
* Automatically dismisses after 3 seconds
* Clickable → opens Badge Detail (9.5)
* Handles multiple triggers gracefully

---

## Security Considerations

* Display **only achievements of the logged-in user**
* Ensure no badge info leakage from other users

---

## Next.js App Routing & Middleware

* Component triggered **client-side only**
* No route change needed
* Must respect authentication state → only logged-in users

---

## Integration & Server-Side Details

### Libraries & Helpers

* shadcn/ui → Toast, Badge
* Tailwind CSS → positioning and animation

### Supabase SQL Checks (if queue used)

```sql
-- Fetch newly earned badges
SELECT * FROM user_badges
WHERE user_id = '<user_id>' AND notified = FALSE;

-- Mark as notified after toast displayed
UPDATE user_badges SET notified = TRUE
WHERE id = '<badge_entry_id>';
```

---



---

# Screen ID: 9.5 – Badge Detail ("Detalhe da Badge")

## Overview

The **Badge Detail screen** provides comprehensive information about a single badge. It allows users to **understand the criteria for earning it, view progress, and see when it was achieved**. This screen supports gamification and motivation.

**Main Goals:**

* Show full description of the badge
* Display date earned (if earned)
* Show progress toward badge completion (if in progress)
* Encourage users to engage further by completing requirements for locked badges

---

## Components

* **Header**

  * Title: Badge name
  * Close button → returns to “My Badges” (9.3)

* **Badge Visual**

  * Large icon of the badge
  * Animated or colored if earned, greyed-out if locked

* **Badge Info Section**

  * Badge title
  * Description
  * Criteria to earn the badge (e.g., “Follow diet for 7 consecutive days”)
  * Date earned (if applicable)

* **Progress Section**

  * Progress bar or percentage (if badge not yet earned)
  * Numeric metrics (e.g., 3/7 days completed, 2kg of 5kg lost)

* **CTA / Tips**

  * Optional suggestions for achieving the badge
  * Encouragement messages (e.g., “Keep logging your meals to unlock!”)

* **Empty / Placeholder State**

  * Only relevant if a badge has incomplete or missing data (very rare)

---

## Functional Requirements

1. **Fetch Data**

   * Query `user_badges` for user-specific info (earned date, progress)
   * Query `badges_catalog` for criteria, description, and icon

2. **Dynamic Updates**

   * Progress updates dynamically as user logs weight, completes streaks, or follows diet plan

3. **Navigation**

   * Close button → returns to “My Badges” (9.3)
   * Back navigation should preserve scroll position

4. **Responsive Layout**

   * Works on desktop and mobile
   * Grid or flex layout for icon + description + progress

---

## Error Handling

* Badge fetch fails → display “Unable to load badge details. Retry later.”
* Progress data missing → show zero progress and message

---

## Navigation

* Entry points:

  * From toast (9.4)
  * From “My Badges” grid/list (9.3)
* Exit: Close → returns to 9.3

---

## Technical Notes

* **Supabase Tables**

  * `user_badges` → `user_id`, `badge_id`, `earned_date`, `progress_value`
  * `badges_catalog` → `id`, `title`, `description`, `criteria`, `icon_url`

* **UI Components**

  * shadcn/ui: Card, Progress Bar, Badge, Modal
  * Tailwind CSS → responsive layout, spacing, and typography

* **Performance**

  * Fetch a single badge record on demand
  * Minimize page re-renders

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Modal, Progress } from "@shadcn/ui";

export default function BadgeDetail({ badgeId, onClose }) {
  const supabase = useSupabaseClient();
  const [badge, setBadge] = useState(null);
  const [userBadge, setUserBadge] = useState(null);
  const userId = supabase.auth.user().id;

  useEffect(() => {
    async function fetchBadge() {
      const { data: badgeData } = await supabase
        .from("badges_catalog")
        .select("*")
        .eq("id", badgeId)
        .single();

      const { data: userBadgeData } = await supabase
        .from("user_badges")
        .select("*")
        .eq("user_id", userId)
        .eq("badge_id", badgeId)
        .single();

      setBadge(badgeData);
      setUserBadge(userBadgeData || { progress_value: 0 });
    }
    fetchBadge();
  }, [badgeId]);

  if (!badge) return <p>Loading...</p>;

  return (
    <Modal isOpen onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        <img
          src={badge.icon_url}
          alt={badge.title}
          className={`w-20 h-20 ${userBadge.earned_date ? "" : "grayscale"}`}
        />
        <h2 className="text-xl font-bold">{badge.title}</h2>
        <p>{badge.description}</p>
        <p>Criteria: {badge.criteria}</p>
        {userBadge.progress_value !== undefined && (
          <Progress value={userBadge.progress_value} max={100} />
        )}
        {userBadge.earned_date && <p>Earned on: {userBadge.earned_date}</p>}
      </div>
    </Modal>
  );
}
```

---

## Acceptance Criteria

* Displays badge title, description, and criteria
* Shows earned date if applicable
* Shows progress for unearned badges
* Handles missing data gracefully
* Close button returns to “My Badges” screen

---

## Security Considerations

* Only fetch **user-specific progress**
* Users cannot manipulate progress values client-side

---

## Next.js App Routing & Middleware

* Route: `/eu/badges/[badgeId]` (dynamic)
* Middleware: Authenticated session required → redirect `/login`

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → fetch user progress
* shadcn/ui → Modal, Progress, Card
* Tailwind CSS → responsive and consistent styling

### Supabase SQL Checks

```sql
-- Fetch badge detail from catalog
SELECT * FROM badges_catalog WHERE id = '<badge_id>';

-- Fetch user-specific progress and earned date
SELECT * FROM user_badges WHERE user_id = '<user_id>' AND badge_id = '<badge_id>';

-- Insert progress if user earns the badge
INSERT INTO user_badges (user_id, badge_id, earned_date, progress_value)
VALUES ('<user_id>', '<badge_id>', NOW(), 100)
ON CONFLICT (user_id, badge_id) DO UPDATE
SET progress_value = EXCLUDED.progress_value, earned_date = EXCLUDED.earned_date;
```

---


---

# Screen ID: 9.6 – Subscription & Payments ("Eu > Assinatura & Pagamentos")

## Overview

The **Subscription & Payments screen** allows users to **view, manage, and cancel their subscription plans**. It displays current plan details, next billing date, historical payments, and provides access to manage the payment method.

**Main Goals:**

* Display the user’s active subscription plan (monthly, quarterly, semi-annual)
* Show next billing date and amount
* List previous invoices/payments
* Allow updating payment method or canceling the subscription
* Handle Stripe integration for billing and management

---

## Components

* **Header**

  * Title: "Subscription & Payments"
  * Back button → returns to “Eu” hub (9.1)

* **Current Plan Section**

  * Plan type: Monthly / Quarterly / Semi-Annual
  * Price and billing cycle
  * Next payment date
  * Status: Active, Pending, Canceled

* **Invoice / Payment History**

  * Table/list with columns: Date, Amount, Status (Paid, Failed)

* **Payment Method**

  * Show current card (last 4 digits)
  * Button: Update payment method → opens Stripe-hosted UI

* **Cancel / Pause Subscription**

  * Button: Cancel subscription → triggers confirmation

* **Empty / Placeholder State**

  * User has no active subscription → display CTA to subscribe (link to 10.1 Plan & Pricing)

---

## Functional Requirements

1. **Fetch Data**

   * User’s active subscription → `subscriptions` table (Supabase)
   * Payment history → `payments` table or Stripe API
   * Payment method → Stripe Customer object

2. **Actions**

   * Update payment method → redirect to Stripe checkout/update flow
   * Cancel subscription → update Supabase record & notify Stripe for termination

3. **Dynamic Updates**

   * Display real-time subscription status after user updates payment or cancels

4. **Navigation**

   * Back → “Eu” (9.1)
   * Subscription CTA → Plan & Pricing screen (10.1)

5. **Responsive Layout**

   * Desktop & mobile optimized
   * Clear hierarchy for plan info and actions

---

## Error Handling

* Stripe API error → show user-friendly message and retry option
* Supabase fetch error → display “Unable to load subscription info. Retry later.”
* Payment update fails → revert to previous state

---

## Navigation

* Entry points:

  * From “Eu” hub (9.1)
* Exit points:

  * Back → “Eu” hub (9.1)
  * CTA → Plan & Pricing (10.1)

---

## Technical Notes

* **Supabase Tables**

  * `subscriptions` → `user_id`, `plan_type`, `start_date`, `next_billing_date`, `status`, `stripe_subscription_id`
  * `payments` → `user_id`, `amount`, `status`, `date`, `stripe_payment_id`

* **UI Components**

  * shadcn/ui → Table, Button, Card, Modal
  * Tailwind CSS → responsive layout, spacing, typography

* **Stripe Integration**

  * Use Stripe Customer Portal for plan management
  * Use Stripe Checkout for updating card or changing plan
  * Webhooks → sync payment status with Supabase tables

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button, Table, Card } from "@shadcn/ui";

export default function SubscriptionPayments() {
  const supabase = useSupabaseClient();
  const userId = supabase.auth.user().id;
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    async function fetchSubscriptionData() {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();

      const { data: pay } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", userId);

      setSubscription(sub);
      setPayments(pay);
    }
    fetchSubscriptionData();
  }, [userId]);

  const handleCancel = async () => {
    // Call serverless function or Stripe API to cancel subscription
    await fetch("/api/cancel-subscription", { method: "POST", body: JSON.stringify({ userId }) });
    setSubscription({ ...subscription, status: "Canceled" });
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Subscription & Payments</h2>
      <div>
        <p>Plan: {subscription?.plan_type}</p>
        <p>Next billing: {subscription?.next_billing_date}</p>
        <p>Status: {subscription?.status}</p>
        <Button onClick={handleCancel} disabled={subscription?.status === "Canceled"}>
          Cancel Subscription
        </Button>
      </div>
      <Table>
        <thead>
          <tr><th>Date</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.stripe_payment_id}>
              <td>{p.date}</td>
              <td>{p.amount}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
```

---

## Acceptance Criteria

* Shows current subscription plan, status, and next billing date
* Displays payment history table
* Allows updating payment method via Stripe
* Allows cancellation of subscription
* Handles errors from Stripe and Supabase gracefully

---

## Security Considerations

* Only the **logged-in user** can access their subscription info
* Validate all Stripe webhook events server-side
* Do not expose sensitive payment info in frontend

---

## Next.js App Routing & Middleware

* Route: `/eu/subscription`
* Authenticated session required → redirect `/login` if unauthenticated
* Stripe actions handled via API routes (`/api/cancel-subscription`, `/api/update-payment-method`)

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → fetch subscription/payment data
* Stripe JS → customer portal and checkout
* shadcn/ui → Card, Table, Button
* Tailwind CSS → layout & styling

### Supabase SQL Checks

```sql
-- Fetch user subscription
SELECT * FROM subscriptions WHERE user_id = '<user_id>';

-- Fetch user payments
SELECT * FROM payments WHERE user_id = '<user_id>' ORDER BY date DESC;

-- Update subscription status after cancellation
UPDATE subscriptions SET status = 'Canceled' WHERE user_id = '<user_id>';
```

---


---

# Screen ID: 9.8 – User Profile ("Eu > Perfil")

## Overview

The **Profile screen** allows the user to **view and edit their personal information** collected during registration and onboarding. This includes name, age, initial weight, height, and primary goal (weight loss, maintain, gain, or general health).

**Main Goals:**

* Display current user profile information
* Allow users to update their personal data
* Reflect changes immediately in the app and persist in Supabase
* Ensure consistency with other modules that depend on profile data (e.g., diet suggestions, onboarding filters)

---

## Components

* **Header**

  * Title: "Profile"
  * Back button → returns to “Eu” hub (9.1)

* **Profile Form Section**

  * Fields:

    * Full Name (text input)
    * Age (number input)
    * Height (cm) (number input)
    * Initial Weight (kg) (number input)
    * Goal (dropdown / radio buttons: "Lose Weight", "Maintain Weight", "Gain Weight", "General Health")
  * Buttons:

    * Save / Update → saves changes to Supabase
    * Cancel → discards changes and returns to “Eu” hub

* **Validation & Feedback**

  * Inline validation for age, weight, and height ranges
  * Success message on save (toast)
  * Error messages if API fails

---

## Functional Requirements

1. **Fetch Data**

   * Fetch logged-in user profile from Supabase `users` table on component mount

2. **Actions**

   * Edit fields inline
   * Save changes → update Supabase table
   * Cancel → revert changes to original values

3. **Dynamic Updates**

   * After saving, update dependent screens (e.g., diet filters, onboarding preferences)

4. **Navigation**

   * Back → “Eu” hub (9.1)

5. **Responsive Layout**

   * Mobile-first and desktop-friendly

---

## Error Handling

* Supabase fetch error → display “Unable to load profile. Retry later.”
* Validation error → highlight incorrect fields
* Save failure → show toast: “Failed to update profile. Try again.”

---

## Navigation

* Entry points:

  * From “Eu” hub (9.1)
* Exit points:

  * Back → “Eu” hub (9.1)

---

## Technical Notes

* **Supabase Tables**

  * `users` → `id`, `full_name`, `age`, `height_cm`, `initial_weight_kg`, `goal`, `created_at`, `updated_at`

* **UI Components**

  * shadcn/ui → Form, Input, Button, Toast
  * Tailwind CSS → layout, spacing, typography

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Input, Button, Toast } from "@shadcn/ui";

export default function UserProfile() {
  const supabase = useSupabaseClient();
  const userId = supabase.auth.user().id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) console.error(error);
      else setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    const { error } = await supabase.from("users").update(profile).eq("id", userId);
    if (error) Toast.error("Failed to update profile.");
    else Toast.success("Profile updated successfully!");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <Input label="Full Name" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} />
      <Input label="Age" type="number" value={profile.age} onChange={e => setProfile({...profile, age: parseInt(e.target.value)})} />
      <Input label="Height (cm)" type="number" value={profile.height_cm} onChange={e => setProfile({...profile, height_cm: parseInt(e.target.value)})} />
      <Input label="Initial Weight (kg)" type="number" value={profile.initial_weight_kg} onChange={e => setProfile({...profile, initial_weight_kg: parseFloat(e.target.value)})} />
      <select value={profile.goal} onChange={e => setProfile({...profile, goal: e.target.value})}>
        <option value="Lose Weight">Lose Weight</option>
        <option value="Maintain Weight">Maintain Weight</option>
        <option value="Gain Weight">Gain Weight</option>
        <option value="General Health">General Health</option>
      </select>
      <div className="mt-4">
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
```

---

## Acceptance Criteria

* Displays user profile fields with current values
* Allows editing and saving changes to Supabase
* Validation prevents invalid data
* Shows success/error feedback
* Navigation back to “Eu” hub works

---

## Security Considerations

* Only authenticated users can access their profile
* Validate inputs server-side
* Do not expose other users’ data

---

## Next.js App Routing & Middleware

* Route: `/eu/profile`
* Authenticated session required → redirect `/login` if unauthenticated

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → fetch and update user profile
* shadcn/ui → Input, Button, Toast
* Tailwind CSS → styling

### Supabase SQL Checks

```sql
-- Fetch user profile
SELECT * FROM users WHERE id = '<user_id>';

-- Update user profile
UPDATE users
SET full_name = '<value>', age = <value>, height_cm = <value>, initial_weight_kg = <value>, goal = '<value>'
WHERE id = '<user_id>';
```

---


---

# Screen ID: 9.9 – User Security ("Eu > Segurança")

## Overview

The **Security screen** allows the user to **update their password** while logged in. This ensures that users can maintain account security and comply with standard authentication practices.

**Main Goals:**

* Allow users to securely change their password
* Ensure validation (current password check, new password requirements)
* Persist changes in Supabase authentication system
* Provide clear success/error feedback

---

## Components

* **Header**

  * Title: "Security"
  * Back button → returns to “Eu” hub (9.1)

* **Change Password Form**

  * Fields:

    * Current Password (password input, required)
    * New Password (password input, required)
    * Confirm New Password (password input, required, must match New Password)
  * Buttons:

    * Save → submits password change
    * Cancel → discards changes, returns to “Eu” hub

* **Validation & Feedback**

  * Inline validation:

    * Current password matches Supabase credentials
    * New password meets minimum requirements (e.g., 8 characters, at least one number)
    * New password must be different from current password
    * Confirm password matches new password
  * Toast notification on success or failure

---

## Functional Requirements

1. **Fetch Data**

   * No profile fetch needed; only user authentication check

2. **Actions**

   * User inputs current password
   * Input new password and confirm password
   * Validate and submit to Supabase `auth.updateUser`

3. **Dynamic Updates**

   * After password change, refresh session
   * Ensure no other session data is affected

4. **Navigation**

   * Back → “Eu” hub (9.1)

5. **Responsive Layout**

   * Mobile-first and desktop-friendly

---

## Error Handling

* Current password incorrect → show error toast
* New password too weak → show inline validation
* Confirm password mismatch → show inline validation
* Confirm password equals current password → show inline validation
* Supabase API error → show toast: “Password change failed. Try again.”

---

## Navigation

* Entry points:

  * From “Eu” hub (9.1)
* Exit points:

  * Back → “Eu” hub (9.1)

---

## Technical Notes

* **Supabase Auth**

  * Use `supabase.auth.updateUser({ password: newPassword })`
  * Requires authenticated user session

* **UI Components**

  * shadcn/ui → Form, Input, Button, Toast
  * Tailwind CSS → layout, spacing, typography

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Input, Button, Toast } from "@shadcn/ui";

export default function ChangePassword() {
  const supabase = useSupabaseClient();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      return Toast.error("New password and confirmation do not match.");
    }

    if (newPassword == currentPassword) {
      return Toast.error("New password must be different from old password.");
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) Toast.error("Password change failed.");
    else Toast.success("Password changed successfully!");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Security</h2>
      <Input label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
      <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
      <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      <div className="mt-4">
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
```

---

## Acceptance Criteria

* User can input current and new password
* Validation prevents weak or mismatched passwords
* Supabase password updated successfully
* Success and error feedback provided
* Navigation back to “Eu” hub works

---

## Security Considerations

* Only authenticated users can access this screen
* Validate passwords client-side and server-side
* Do not expose or log passwords in any way
* Enforce secure password policies

---

## Next.js App Routing & Middleware

* Route: `/eu/security`
* Authenticated session required → redirect `/login` if unauthenticated

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → password update via `auth.updateUser()`
* shadcn/ui → Input, Button, Toast
* Tailwind CSS → styling

### Supabase SQL Checks

* Not required; Supabase handles authentication updates

---




---

# Screen ID: 9.10 – Privacy & Display ("Eu > Privacidade & Exibição")

## Overview

This is NOT a new screen/page, it is a new tab inside /onboarding/ page and /profiles/ page. So, plan both implementations.
The **Privacy & Display tab** allows users to manage how they appear to other users on public areas of the application, such as the **Ranking / Leaderboards**. Users can set a public alias (nickname) and select an avatar. This ensures privacy while still enabling engagement in social features.

**Main Goals:**

* Allow users to define a public alias/nickname
* Allow users to select or change an avatar (predefined set for MVP, no uploads)
* Ensure that these settings are used consistently in leaderboards and social features

---

## Components

* **Header of tab**

  * Title: "Privacidade & Exibição"
  * Previous button → returns to previous tab

* **Public Alias Section**

  * Input field: "escolha um nome de usuário"
  * Validation: MUST be unique across all users (check against `profiles` table, column `user_alias`)
  * Display unique validation response realtime next to the input filed, red or green message
  * Inline feedback: min/max character limits, invalid characters

* **Avatar Selection Section**

  * Predefined avatars grid (there are PNG images in `/public/imgs/` folder, name pattern `avatar_1.png` to `avatar_4.png`)
  * User can select one avatar
  * Selected avatar highlighted
  * Persist avatar file name in `profiles` table, column `avatar_url`)

* **Buttons**

  * Save → persists changes to Supabase `profiles` table, alias in `user_alias` and avatar in `avatar_url` columns.

* **Validation & Feedback**

  * Inline validation for alias

---

## Functional Requirements

1. **Fetch Data**

   * IF on /onbarding/ page:
     ** User profile registry don't exist yet. It will be persisted in the final of the onboarding process.
   * ELSE IF on /profiles/ page:
     ** Fetch current user alias and avatar from Supabase `profiles` table on component mount

2. **Actions**

   * Alias can be edited in the /profiles/ page, under this new tab. Unique validation must be enforced again. 
   * Select avatar from predefined options
   * Save → update Supabase

3. **Dynamic Updates**

   * Changes reflected immediately in all modules showing public identity, e.g., Ranking (8.1)

4. **Navigation**

   * Back → Previous tab

5. **Responsive Layout**

   * Mobile-first and desktop-friendly

---

## Error Handling

* Alias conflicts (if uniqueness enforced) → show inline error
* Supabase API errors → toast: “Failed to save privacy settings. Try again.”
* Validation for invalid characters or length → inline error

---

## Navigation

* Entry points:

  * Aditional tab inside /onboarding/ and /profiles/ pages
* Exit points:

  * Back → Previous tab

---

## Technical Notes

* **Supabase Table**

  * `profiles` → `user_alias`, `avatar_url` (filename referencing predefined avatars, example `avatar_1.png`)

* **UI Components**

  * shadcn/ui → Input, Button, Toast, Grid
  * Tailwind CSS → layout, spacing, typography

* **Avatar Options**

  * MVP: 4 predefined avatar images
  * No user uploads

---

## Suggested Implementation Snippets (client pseudo-code)


```tsx

//user arrays for avatars pre loading
const predefinedAvatars = [
  "/imgs/avatars/avatar1.png",
  "/imgs/avatars/avatar2.png",
  // ...4 total files
];


//use states for avatar and alias changes

/*/*Database
- If on /onboarding page, increment the final insert to consider new fields alias and avatar in `profiles` table, columns "user_alias, avatar_url"
- If on /profiles page, use:
--- supabase.from("profiles").select("user_alias, avatar_url").eq("id", userId).single(); //for fetching data
--- supabase.from("profiles").update({ user_alias: alias, avatar_url: avatarFileName }).eq("id", userId); //for updates
*/


//For UI/UX, consider something like this:
  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Privacy & Display</h2>
      <Input label="Public Alias" value={alias} onChange={e => setAlias(e.target.value)} /> {"<!-- MUST VALIDATE UNIQUENESS -->"}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {predefinedAvatars.map((avatar, idx) => (
          <img
            key={idx}
            src={avatar}
            alt={`Avatar ${idx + 1}`}
            className={`cursor-pointer border-2 ${avatar === selectedAvatar ? "border-blue-500" : "border-transparent"}`}
            onClick={() => setSelectedAvatar(avatar)}
          />
        ))}
      </div>
      <div className="mt-4">
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
```

---

## Acceptance Criteria

* Displays current public alias and selected avatar
* Allows editing alias and selecting avatar //ONLY ON PROFILES PAGE, NOT ON ONBOARDING
* Validation prevents invalid alias
* Saves changes successfully to Supabase
* Changes reflected immediately in leaderboard/social features

---

## Security Considerations

* Only authenticated users can access this screen
* Validate alias server-side (prevent malicious input)
* Limit avatar selection to predefined options

---

## Next.js App Routing & Middleware

* Route: new tab on `/onboarding` and `/profiles`
* Authenticated session required → redirect `/login` if unauthenticated

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → insert/fetch/update `user_alias` and `avatar_url`
* shadcn/ui → Input, Button, Toast, Grid
* Tailwind CSS → styling



---

# Screen ID: 9.11 — Profile & Weight (Unified)

## Overview

This new screen unifies user profile management and weight tracking into a single page so users can edit personal data and update their weight progress in one place, and — when permitted — request a refresh of AI diet recommendations. The screen is intended as a drop-in replacement for the existing two pages `/profile` and `weight-log`; it should be implemented as a **new route** for testing (`/profile/manage`) and later the legacy pages can be disabled.

Key goals:

* Single place for all user information entered during onboarding (age, height, goal, dietary preferences, activity level, dislikes).
* Full weight-entry CRUD (create, edit, delete) and an interactive mini chart of the selected period.
* A single, clearly visible control to trigger AI recommendations refresh that enforces the existing 1x/week cooldown.
* Keep behavior consistent with current APIs and DB tables already used by the app.

**Source references (for Cursor):**

* Current Profile page implementation — `/profile`;
* Current Weight Log page implementation — `weight-log`;

---

## Components (UI composition)

Implement using shadcn/ui + Tailwind (consistent with project):

1. **Header Bar**

   * Title: *Profile*.
   * Short subtitle or help text.
   * Global CTA on the right: **Refresh AI Recommendations** button + cooldown badge.

     * This button must be visible regardless of the active tab (makes it easy for users after editing profile to refresh without extra navigation).

2. **Tabs** (left-to-right horizontally on wide screens; stacked/selectable on mobile)

   * Tabs: `Personal` | `Dietary` | `Activity` | `Weight & Progress`
   * Default tab: `Personal`.

3. **Personal Tab**

   * Card: Basic Info (age, weight\_start\_kg, height\_cm)
   * RadioGroup: Primary Goal (lose/maintain/gain/health)
   * Save button for profile changes (sends PUT to `/api/auth/me` as current implementation)

4. **Dietary Tab**

   * Checkboxes for dietary preferences
   * Free-text `food_dislikes`
   * Save button reuses the same profile save logic

5. **Activity Tab**

   * Select for activity level with explanatory card (same content as existing)
   * Save button

6. **Weight & Progress Tab**

   * Add/Edit weight form (simplified crud logic compared to the original weight log screen id 9.2):
     * Date (date input), filled with actual date, disabled, user only permitted to insert on actual date.
     * Weight (number, step 0.1), pre-filled with last entry
     * Submit button (always insert new registry)
     * Duplicate-date logic: if a weight entry exists for the date, disabled submit button above)
   * List of weight entries (reverse chronological with simple delete button action on the side of each entry)
   * Mini chart (line chart) with period buttons: 1 week / 1 month / 3 months
   * Inline messages/toasts for success/failure

7. **Toasts & Inline Alerts**

   * Use actual project toast pattern for success/fail messages.
   * Inline error banners for connectivity issues.

---

## Functional Requirements

### Profile / Saving

* Use the existing `PUT /api/auth/me` endpoint (identical to current profile page) to persist profile edits.

  * Payload: `{ name, age, weight_start_kg, height_cm, goal, dietary_preferences, activity_level, food_dislikes, onboarding_completed }`
  * Reuse current profile fetching `/api/auth/me` GET for initial load.

### Weight CRUD

* Use Supabase client to operate on `weights` table:

  * `GET /weights?user_id={user.id}&order=measured_at asc`
  * `INSERT` to add a new weight entry.
  * `DELETE` to remove an entry by `id`.
* Prevent duplicate measured\_at per user (DB already enforces unique constraint); if duplicate occurs, present clear user feedback and allow delete flow of actual entry.

### AI Recommendations Refresh (Cooldown logic)

* The system must enforce **1 refresh per 7 days** per user (use "Update AI Recommendations" button from `weight-log` screen id 9.2 as reference):

  * Query `diet_recommendations` table: `SELECT last_refreshed FROM diet_recommendations WHERE user_id = $1 ORDER BY last_refreshed DESC LIMIT 1;`
  * If no row found, user may run the AI.
  * If last\_refreshed < 7 days ago → compute remaining hours/days and **disable** the refresh button, showing a badge like `2d remaining`.
* When refresh allowed:

  * UI triggers `POST /api/ai/recommendations` (existing API used in `weight-log` screen id 9.2).
  * Server should re-run matching logic (pull current profile and weight records for user), write/update `diet_recommendations` row with `last_refreshed` timestamp and the generated recommendations.
  * On success, client updates cooldown UI by re-querying `diet_recommendations` or using the server response timestamp.

### UX rules (keep previous business constraints)

* Users can change profile data at any time, but **profile change does not automatically refresh AI**. A manual refresh action is required and subject to cooldown (1x/week).
* The initial recommendation (post-onboarding) should remain unchanged — the onboarding flow will still call the AI automatically as before. This screen only provides manual refresh.
* The AI refresh should always use the **most up-to-date** user profile data and weight history at the moment of the request.

---

## Error Handling & Edge Cases

* If API for profile save fails → show inline error with suggestion to retry.
* If Supabase `weights` queries fail → show a fallback message and a **Try Again** button.
* If `POST /api/ai/recommendations` returns error → show toast with server message; do not change cooldown state.
* Duplicate date insertion error → detect `23505` error client-side and present user with message: "You already have a weight entry for this date — edit it instead."
* If chart has insufficient data → hide chart or show placeholder "Add more weight entries to see a trend."
* If `diet_recommendations` query to compute cooldown fails → assume cooldown=0 but show a non-blocking warning in logs; do not block user. (Better: retry on background.)

---

## Navigation

* New route: **`/profile/manage`** (protected). This route is separate from old `/profile` and `/weight-log` pages so you can test it without removing legacy pages.
* Buttons:

  * `Save Profile` → stays on page and displays success toast.
  * `Refresh AI Recommendations` → POST to `/api/ai/recommendations`; on success refresh local `diet_recommendations` and UI.
* After testing, you can point navigation to `/profile/manage` as main profile route and deprecate prior pages.

---

## Technical Notes (Backend & DB)

* Tables used:

  * `weights` (columns: id uuid, user\_id uuid, weight\_kg numeric, measured\_at date, created\_at timestamptz, updated\_at timestamptz)
  * `diet_recommendations` (columns include user\_id, last\_refreshed timestamptz, recommendations jsonb)
  * `profiles` or existing auth profile endpoint (`/api/auth/me`) — current code uses an API to update profile, so keep using it.
* Queries must be scoped to authenticated user `user.id` — do not return or operate on other users' rows.
* Index suggestions:

  * Index on `weights(user_id, measured_at)` (for range queries).
  * Index on `diet_recommendations(user_id, last_refreshed desc)`.

**SQL snippet for cooldown check** (server-side):

```sql
SELECT last_refreshed
FROM diet_recommendations
WHERE user_id = $1
ORDER BY last_refreshed DESC
LIMIT 1;
```

**Cooldown calculation server-side**:

* If `last_refreshed` exists:

  * `hours_since = AGE(NOW(), last_refreshed) in hours`
  * `remaining_hours = MAX(0, 168 - hours_since)` (168 hours = 7 days)
  * Deny refresh if `remaining_hours > 0`.

---

## Suggested Client-side Pseudo-code (React / Next.js — app route)

```tsx
// new file: app/profile/manage/page.tsx
export default function ProfileManagePage() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [weights, setWeights] = useState([]);
  const [aiCooldownHours, setAiCooldownHours] = useState<number | null>(null);
  const [isRefreshingAI, setIsRefreshingAI] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchWeights();
    fetchAiCooldown();
  }, [user?.id]);

  async function fetchProfile() {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    setProfile(data.profile);
  }

  async function saveProfile(newProfile) {
    await fetch('/api/auth/me', { method: 'PUT', body: JSON.stringify(newProfile) });
    await fetchProfile(); // update UI
    toast.success('Profile updated');
  }

  async function fetchWeights() {
    const { data } = await supabase.from('weights').select('*').eq('user_id', user.id).order('measured_at', { ascending: true });
    setWeights(data);
  }

  async function addWeight(entry) { /* uses supabase insert */ }

  async function deleteWeight(id) { /* supabase delete */ fetchWeights(); }

  async function fetchAiCooldown() {
    const { data } = await supabase
      .from('diet_recommendations')
      .select('last_refreshed')
      .eq('user_id', user.id)
      .order('last_refreshed', { ascending: false})
      .limit(1)
      .single();
    if (!data?.last_refreshed) setAiCooldownHours(0);
    else {
      const hoursSince = (Date.now() - new Date(data.last_refreshed).getTime()) / (1000*60*60);
      setAiCooldownHours(Math.max(0, 168 - hoursSince));
    }
  }

  async function handleRefreshAI() {
    if (aiCooldownHours && aiCooldownHours > 0) return;
    setIsRefreshingAI(true);
    const res = await fetch('/api/ai/recommendations', { method: 'POST' });
    if (res.ok) {
      toast.success('AI recommendations refreshed');
      await fetchAiCooldown();
    } else {
      const err = await res.json();
      toast.error(err?.error || 'Failed to refresh');
    }
    setIsRefreshingAI(false);
  }

  // render Tabs with forms, list, chart
  // use /profile/page.tsx for main page render reference and add a new weight tab
  // use /weight-log/page.tsx for reference of the new tab with weight list, chart
  // in the header, show the refresh ai button and the cooldown badge as already implemented in the weight log screen id 9.2
}
```


```js
// GET user_id from session
// check cooldown
// if ok: run matching, persist to diet_recommendations (insert or update), respond 200
// else respond 403 with { remaining_hours }
```

---

## Acceptance Criteria

* [ ] New page reachable at `/profile/manage` and protected for authenticated users.
* [ ] Profile fields load from `/api/auth/me` and can be updated with PUT; success feedback appears.
* [ ] Weight entries list loads and reflects inserts/deletes made in the UI.
* [ ] Chart displays correct aggregated data for 1w/1m/3m ranges.
* [ ] Add weight form enforces validation (weight 30–300 kg; date valid, only insert on actual date).
* [ ] Duplicate date insertion blocked.
* [ ] Refresh AI Recommendations button:

  * disabled and shows countdown while cooldown > 0
  * when available, triggers `POST /api/ai/recommendations`
  * on success the cooldown updates immediately
* [ ] All DB queries operate only on the logged-in user's rows.
* [ ] Error states handled gracefully (toasts / inline banners), no layout breakage.

---

## Security Considerations

* Ensure all API routes are protected and read user id from server sessions — **never** accept `user_id` from the client.
* All queries must include `eq('user_id', user.id)` (or server-side session binding).
* For the ranking/announcements UI (if visible), ensure no sensitive PII leaks.
* Rate-limit the endpoint that launches AI calls to protect costs/abuse (cooldown + server-side rate limits).

---

## Integration Notes / Migration Path

1. **Implement new page** at `/profile/manage`. Use ProtectedRoute wrapper like existing pages.
2. **Port UI forms and weight logic** from the two current files:

   * Profile logic and API call: copy from `/profile/page.tsx` (profile);
   * Weight listing, chart and AI refresh logic: copy from `/weight-log/page.tsx` (weight log);

---

## Developer Hints & Small Implementation Details

* Reuse the same components and form validation rules you already use in the two files.
* Keep the AI refresh button as a single source-of-truth (one handler in parent component) but present its UI in header so it's always visible while working in any tab.
* For cooldown display convert hours to human-friendly: `if hours<1 => "Available now"; if hours < 24 => "Xh remaining"; else "Xd remaining"`.
* Use the existing toast + loader patterns used in weight log & profile pages.

---




# Screen ID: 10.1 – Plans & Pricing

## Overview

The **Plans & Pricing screen** allows users to view available subscription options and subscribe to a plan. This is the main entry point for monetization and paywall control.

**Main Goals:**

* Present clear subscription options (monthly, quarterly, semiannual)
* Provide descriptions, price, and billing frequency
* Encourage subscription via CTA buttons
* Support navigation to Stripe Checkout

---

## Components

* **Header**

  * Title: "Plans & Pricing"
  * Optional: Back button → returns to Landing Page (S1)

* **Plan Cards**

  * Monthly Plan:

    * Price: R\$29,90 / month
    * CTA: "Subscribe" → leads to Stripe Checkout
  * Quarterly Plan:

    * Price: R\$74,70 / 3 months (\~R\$24,90/month)
    * Auto-renews in 4th month
    * CTA: "Subscribe"
  * Semiannual Plan:

    * Price: R\$119,40 / 6 months (\~R\$19,90/month)
    * Auto-renews in 7th month
    * CTA: "Subscribe"

* **Plan Details Section**

  * Highlight key differences or benefits
  * Optional: visual badge for “Best Value”

* **Paywall Notice**

  * Inform users that features are locked until subscription

* **Navigation Buttons**

  * Option to return to Landing Page

---

## Functional Requirements

1. **Fetch Data**

   * Static content for MVP: prices, descriptions, billing cycles

2. **Actions**

   * Clicking “Subscribe” → redirect to Stripe Checkout

3. **Dynamic Updates**

   * Optional: show current plan if already subscribed (via Supabase)

4. **Responsive Layout**

   * Mobile-first and desktop-friendly

---

## Error Handling

* Stripe API redirect failure → toast: “Unable to initiate payment. Try again.”
* Invalid plan selection → toast: “Invalid subscription plan selected.”

---

## Navigation

* Entry points:

  * Header/footer links (public)
  * Paywall redirect from restricted features

* Exit points:

  * Stripe Checkout (hosted)
  * Back → Landing Page (S1)

---

## Technical Notes

* **Payment Integration**

  * Stripe Checkout session via client-side redirect
  * Only three fixed plans (monthly, quarterly, semiannual)

* **UI Components**

  * shadcn/ui → Card, Button
  * Tailwind CSS → layout, spacing, typography

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { Button } from "@shadcn/ui";

const plans = [
  { id: "monthly", price: "R$29,90", description: "Monthly plan", stripePriceId: "<STRIPE_ID>" },
  { id: "quarterly", price: "R$74,70", description: "Quarterly plan", stripePriceId: "<STRIPE_ID>" },
  { id: "semiannual", price: "R$119,40", description: "Semiannual plan", stripePriceId: "<STRIPE_ID>" },
];

export default function PlansPricing() {
  const handleSubscribe = async (stripePriceId: string) => {
    // Create Checkout session
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({ priceId: stripePriceId }),
    });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Plans & Pricing</h2>
      <div className="grid gap-4">
        {plans.map(plan => (
          <div key={plan.id} className="border p-4 rounded">
            <h3 className="font-bold">{plan.description}</h3>
            <p className="text-lg">{plan.price}</p>
            <Button onClick={() => handleSubscribe(plan.stripePriceId)}>Subscribe</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Acceptance Criteria

* All three plans displayed with correct pricing and description
* CTA “Subscribe” redirects to Stripe Checkout
* Navigation back to Landing Page works
* Paywall notice visible for users not subscribed

---

## Security Considerations

* Only authenticated users can subscribe
* Stripe API handled server-side for session creation (avoid exposing secrets)
* Validate plan IDs server-side

---

## Next.js App Routing & Middleware

* Route: `/plans`
* Publicly accessible, but paywall enforced on features requiring subscription

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@stripe/stripe-js` → Stripe Checkout session redirect
* shadcn/ui → Card, Button
* Tailwind CSS → styling

### Supabase SQL Checks

* Optional: check current subscription status in `users` table

```sql
SELECT subscription_status, plan_id FROM users WHERE id = '<user_id>';
```

---


---

# Screen ID: 10.3 – Payment Status / Return

## Overview

The **Payment Status / Return screen** confirms the outcome of a subscription payment via Stripe Checkout. It informs the user whether the payment was successful or failed and guides the next steps. This screen ensures transparency and trust in the payment process.

**Main Goals:**

* Display clear feedback on payment success or failure
* Provide guidance on next steps (redirect to app or retry payment)
* Confirm subscription activation in case of success

---

## Components

* **Header**

  * Title: "Payment Status"
  * Back button → redirect to Landing Page (S1)

* **Status Message**

  * Success:

    * Icon: checkmark
    * Text: "Payment successful! Your subscription is now active."
  * Failure:

    * Icon: warning/cross
    * Text: "Payment failed. Please try again."

* **Buttons**

  * Success: "Go to Dashboard" → redirects to Home (3.1)
  * Failure: "Retry Payment" → redirects to Plans & Pricing (10.1)
  * Alternative: “Contact Support” → S2 (Help & FAQ)

---

## Functional Requirements

1. **Fetch Payment Status**

   * Capture Stripe session ID from query params
   * Verify payment status via server-side API or webhook validation

2. **Actions**

   * Success → update Supabase `users` table with subscription info
   * Failure → allow user to retry

3. **Dynamic Updates**

   * Display personalized message based on payment outcome

4. **Responsive Layout**

   * Mobile-first and desktop-friendly

---

## Error Handling

* Stripe session invalid → show error and redirect to 10.1 (Plans & Pricing)
* Network/API errors → toast notification: "Unable to verify payment. Try again."
* Supabase update fails → toast: "Subscription update failed. Contact support."

---

## Navigation

* Entry points:

  * Redirect from Stripe Checkout success/failure URL

* Exit points:

  * Success → Home (3.1)
  * Failure → Plans & Pricing (10.1) or Help & FAQ (S2)

---

## Technical Notes

* **Supabase Table**

  * `users` → `subscription_status`, `plan_id`, `current_period_end`

* **Payment Verification**

  * Use Stripe webhooks for server-side confirmation
  * Optional: client-side verification for immediate feedback

* **UI Components**

  * shadcn/ui → Button, Icon, Toast
  * Tailwind CSS → layout, typography, spacing

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Toast } from "@shadcn/ui";

export default function PaymentStatus() {
  const router = useRouter();
  const { session_id, status } = router.query; // received from Stripe redirect
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failure" | "loading">("loading");

  useEffect(() => {
    async function verifyPayment() {
      try {
        const res = await fetch(`/api/verify-payment?session_id=${session_id}`);
        const data = await res.json();
        setPaymentStatus(data.success ? "success" : "failure");
      } catch (err) {
        setPaymentStatus("failure");
        Toast.error("Unable to verify payment. Try again.");
      }
    }
    if (session_id) verifyPayment();
  }, [session_id]);

  if (paymentStatus === "loading") return <div>Verifying payment...</div>;

  return (
    <div className="p-4 text-center">
      {paymentStatus === "success" ? (
        <>
          <div className="text-green-600 text-2xl font-bold mb-2">✓ Payment Successful!</div>
          <p>Your subscription is now active.</p>
          <Button className="mt-4" onClick={() => router.push("/home")}>Go to Dashboard</Button>
        </>
      ) : (
        <>
          <div className="text-red-600 text-2xl font-bold mb-2">✗ Payment Failed</div>
          <p>Please try again or contact support.</p>
          <div className="mt-4 space-x-2">
            <Button onClick={() => router.push("/plans")}>Retry Payment</Button>
            <Button onClick={() => router.push("/help")}>Contact Support</Button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

## Acceptance Criteria

* Payment status correctly displayed (success/failure)
* Appropriate buttons navigate to next steps
* Subscription status updated in Supabase upon success
* Error handling works for invalid or missing session ID

---

## Security Considerations

* Verify payment server-side (webhook or API) before activating subscription
* Only authenticated users can access this page
* Prevent URL tampering to fake success

---

## Next.js App Routing & Middleware

* Route: `/payment-status`
* Accessible only after redirect from Stripe Checkout
* Redirect unauthenticated users to `/login`

---

## Integration & Server-Side Details

### Libraries & Helpers

* `@supabase/supabase-js` → fetch/update subscription info
* `@stripe/stripe-js` → client-side session verification
* shadcn/ui → Button, Toast, Icons
* Tailwind CSS → styling

### Supabase SQL Checks

```sql
-- Verify subscription status update
SELECT subscription_status, plan_id, current_period_end FROM users WHERE id = '<user_id>';
```

---


---

# Screen ID: S2 – Help & FAQ / Contact

## Overview

The **Help & FAQ / Contact screen** provides guidance to users, reduces support tickets, and helps users navigate the app efficiently. It centralizes common questions and provides a direct channel to contact support.

**Main Goals:**

* Provide clear answers to the most frequent questions
* Offer categorized FAQs for faster navigation
* Enable users to contact support directly via form or email link
* Support onboarding and troubleshooting without leaving the app

---

## Components

* **Header**

  * Title: "Help & FAQ"
  * Back button → returns to Landing Page (S1) or previous screen

* **Search Bar**

  * Placeholder: "Search FAQs..."
  * Filters results in real-time based on keywords

* **FAQ Sections**

  * Categories:

    * Account & Login
    * Subscriptions & Payment
    * Diets & Meal Plans
    * Tracking & Progress
    * Technical & Bugs
  * Each category expands to show questions with collapsible answers
  * Example FAQ:

    * Q: "How do I change my password?"
    * A: "Go to Eu > Security. Enter your current password and set a new one."
    * Q: "How can I switch diet plans?"
    * A: "Go to Diets, select a plan, and click 'Follow now'."

* **Contact Form**

  * Fields:

    * Name (prefilled from user profile if logged in)
    * Email (prefilled)
    * Subject (dropdown: Account, Payment, Diets, Other)
    * Message (textarea)
    * Optional file upload (none for MVP)
  * Submit button: “Send Message”
  * Confirmation toast: “Your message has been sent. We’ll respond via email.”

* **Direct Contact Option**

  * Email link: [support@example.com](mailto:support@example.com)

* **Navigation Buttons**

  * Back → Landing Page (S1) or previous screen

---

## Functional Requirements

1. **Search**

   * Filter FAQ questions and categories as user types
   * Highlight matched keywords

2. **Collapsible FAQ**

   * Click question → expand answer
   * Only one open at a time (optional)

3. **Contact Form**

   * Client-side validation: all fields required except optional attachments
   * On submit → POST request to `/api/contact` → saves message in Supabase table
   * Confirmation message on success

4. **Responsive Layout**

   * Works on mobile and desktop

---

## Error Handling

* Form validation errors → inline messages (e.g., “Email is required”)
* Submission failure → toast: “Unable to send message. Try again.”
* Search returns no matches → show “No results found”

---

## Navigation

* Entry points:

  * Footer link on all screens
  * “Eu > Help” link (optional future shortcut)

* Exit points:

  * Back to previous screen
  * Click FAQ link → scroll to answer
  * Submit contact form → stay on page or redirect to success toast

---

## Technical Notes

* **Supabase Table**: `support_messages`

  * Columns: `id`, `user_id`, `name`, `email`, `subject`, `message`, `created_at`

* **API Endpoint**: `/api/contact`

  * Handles form submission
  * Stores data in Supabase
  * Optional: trigger email to support team

* **UI Components**

  * shadcn/ui → Input, Textarea, Button, Accordion/Collapsible
  * Tailwind CSS → spacing, layout, typography

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useState } from "react";
import { Button, Input, Textarea, Accordion } from "@shadcn/ui";

const faq = [
  { category: "Account & Login", questions: [
      { q: "How do I change my password?", a: "Go to Eu > Security." },
      { q: "I forgot my password, what do I do?", a: "Use the Forgot Password feature on login." },
    ] 
  },
  { category: "Diets & Meal Plans", questions: [
      { q: "Can I switch diet plans?", a: "Go to Diets, select a plan, click 'Follow now'." },
    ] 
  },
];

export default function HelpFAQ() {
  const [form, setForm] = useState({name: "", email: "", subject: "", message: ""});
  
  const handleSubmit = async () => {
    // POST to /api/contact
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) alert("Message sent!");
    else alert("Submission failed, try again.");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Help & FAQ</h2>
      <input type="text" placeholder="Search FAQs..." className="border p-2 mb-4 w-full" />
      
      {faq.map(cat => (
        <div key={cat.category} className="mb-4">
          <h3 className="font-bold mb-2">{cat.category}</h3>
          <Accordion type="single" collapsible>
            {cat.questions.map((item, idx) => (
              <Accordion.Item key={idx} value={`q-${idx}`}>
                <Accordion.Trigger>{item.q}</Accordion.Trigger>
                <Accordion.Content>{item.a}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      ))}

      <div className="mt-6 border-t pt-4">
        <h3 className="font-bold mb-2">Contact Us</h3>
        <Input placeholder="Name" value={form.name} onChange={e => setForm({...form, name:e.target.value})}/>
        <Input placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})}/>
        <Input placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject:e.target.value})}/>
        <Textarea placeholder="Message" value={form.message} onChange={e => setForm({...form, message:e.target.value})}/>
        <Button className="mt-2" onClick={handleSubmit}>Send Message</Button>
      </div>
    </div>
  );
}
```

---

## Acceptance Criteria

* FAQ categories and questions displayed correctly
* Search filters results dynamically
* Accordion opens/closes correctly
* Contact form validates inputs and stores message in Supabase
* Confirmation displayed on successful submission
* Responsive layout works on all devices

---

## Security Considerations

* Validate inputs server-side to prevent injection
* Rate-limit submissions to prevent spam
* No sensitive user data exposed

---

## Next.js App Routing & Middleware

* Route: `/help`
* Publicly accessible

---

## Integration & Server-Side Details

### Libraries & Helpers

* shadcn/ui → Accordion, Input, Textarea, Button
* Tailwind CSS → styling
* Supabase → store contact messages

### Supabase SQL Checks

```sql
-- Check last 5 support messages from user
SELECT * FROM support_messages WHERE user_id = '<user_id>' ORDER BY created_at DESC LIMIT 5;
```

---




---

# Screen ID: S3 – Terms / Privacy / Legal Notice

## Overview

The **Terms / Privacy / Legal Notice** screen serves to ensure transparency, regulatory compliance, and trust with users. It clarifies the scope of the service, user responsibilities, data usage, and limitations of liability.

**Main Goals:**

* Provide legally compliant terms of service and privacy policies
* Clarify that the platform provides diet guidance, not personalized medical prescriptions
* Ensure users consent to data collection and processing
* Protect the company from liability while remaining clear and user-friendly

---

## Components

* **Header**

  * Title: “Terms & Privacy”
  * Back button → returns to Landing Page (S1) or previous page

* **Tab Navigation / Section Links**

  * Optional sticky sidebar or top navigation for:

    * Terms of Service
    * Privacy Policy
    * Disclaimer / Legal Notice

* **Terms of Service Section**

  * Overview of user rights and responsibilities
  * User obligations:

    * Account creation and maintaining credentials
    * Accurate personal information
    * Proper usage of the app according to rules
  * Restrictions:

    * No sharing of subscription accounts
    * No unlawful usage

* **Privacy Policy Section**

  * Data collection:

    * Name, email, age, weight, height, diet preferences, subscription data
  * Data storage: Supabase
  * Data usage:

    * Personalization of diet recommendations
    * Analytics and feature improvement
  * Third-party services:

    * Stripe → payment processing
    * Vercel → hosting
    * Supabase → backend
  * User rights:

    * Request access, correction, or deletion of personal data
  * Cookie and tracking usage:

    * Vercel Analytics for usage stats

* **Disclaimer / Legal Notice**

  * Service is **informational and educational only**
  * Does **not constitute a medical prescription**
  * Users must consult qualified health professionals before making dietary changes
  * Limitation of liability for any adverse outcomes

* **Acknowledgment / Consent**

  * Checkbox confirming user has read and accepts Terms & Privacy
  * Only allows proceeding with registration if checked

* **Footer Links**

  * Optional links to contact support (S2)
  * Quick navigation to top of page

---

## Functional Requirements

1. **Expandable / Scrollable Sections**

   * Sections can expand/collapse or scrollable for readability
   * Optional anchor links for quick jump

2. **Consent Checkbox**

   * Must be checked before registration/signup completion
   * Prevents user from bypassing terms

3. **Responsive Layout**

   * Works on desktop and mobile

4. **Text Management**

   * Text stored in the frontend for MVP (hardcoded)
   * Future: external markdown/JSON for easy updates

---

## Error Handling

* Consent checkbox unchecked → show toast/error: “You must accept the Terms & Privacy to continue.”
* Page fails to load → fallback message: “Unable to display Terms & Privacy, please refresh.”

---

## Navigation

* Entry points:

  * Footer link on all screens
  * Paywall screen redirects
  * Registration signup flow (mandatory acceptance)

* Exit points:

  * Back to Landing Page (S1)
  * Continue with signup/login once terms accepted

---

## Technical Notes

* **Supabase Table**: `user_acceptance`

  * Columns: `id`, `user_id`, `accepted_terms` (boolean), `accepted_at` (timestamp)

* **API Endpoint**: `/api/accept-terms`

  * POST request storing acceptance in Supabase
  * Optional: log user IP/timestamp for compliance

* **UI Components**

  * shadcn/ui → Checkbox, Accordion (for collapsible sections), Button
  * Tailwind CSS → spacing, typography, layout

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { useState } from "react";
import { Button, Checkbox, Accordion } from "@shadcn/ui";

export default function TermsPrivacy() {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = async () => {
    if (!accepted) {
      alert("You must accept the Terms & Privacy to continue.");
      return;
    }
    const res = await fetch("/api/accept-terms", {
      method: "POST",
      body: JSON.stringify({ user_id: "<USER_ID>", accepted_terms: true }),
    });
    if (res.ok) alert("Accepted successfully!");
    else alert("Failed to save acceptance.");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Terms of Service & Privacy Policy</h2>
      
      <Accordion type="single" collapsible>
        <Accordion.Item value="tos">
          <Accordion.Trigger>Terms of Service</Accordion.Trigger>
          <Accordion.Content>
            <p>Overview of user obligations, restrictions, and proper usage...</p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="privacy">
          <Accordion.Trigger>Privacy Policy</Accordion.Trigger>
          <Accordion.Content>
            <p>Information about data collection, usage, storage, third-party services...</p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="disclaimer">
          <Accordion.Trigger>Disclaimer / Legal Notice</Accordion.Trigger>
          <Accordion.Content>
            <p>This app is for educational purposes only. Not a medical prescription...</p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>

      <div className="mt-4">
        <Checkbox checked={accepted} onCheckedChange={setAccepted}>
          I have read and accept the Terms of Service & Privacy Policy
        </Checkbox>
        <Button className="mt-2" onClick={handleAccept}>Continue</Button>
      </div>
    </div>
  );
}
```

---

## Acceptance Criteria

* All sections (Terms, Privacy, Disclaimer) visible and readable
* Accordion expands/collapses correctly
* Checkbox must be checked to proceed
* User acceptance recorded in Supabase
* Responsive on mobile and desktop

---

## Security Considerations

* Validate POST requests server-side
* Store timestamp of acceptance for compliance
* Ensure no personal data is exposed in public view

---

## Next.js App Routing & Middleware

* Route: `/terms`
* Publicly accessible
* Middleware check before allowing signup completion

---

## Integration & Server-Side Details

### Libraries & Helpers

* shadcn/ui → Accordion, Checkbox, Button
* Tailwind CSS → layout, typography
* Supabase → store user acceptance

### Supabase SQL Checks

```sql
-- Verify if a user has accepted terms
SELECT accepted_terms, accepted_at FROM user_acceptance WHERE user_id = '<USER_ID>';
```

---



---

# Screen ID: S4 – Empty States & 404

## Overview

The **Empty States & 404** screen serves as a guide for users when they encounter:

* Non-existent pages (404)
* Modules without data (e.g., no favorite diets, no weight entries yet)

**Main Goals:**

* Prevent confusion or frustration when data is missing
* Provide clear guidance on next actions
* Maintain consistency with the overall UX
* Serve as a “friendly fallback” for broken or empty content

---

## Components

* **Header**

  * Title: “Page Not Found” or “No Data Available” depending on context
  * Optional small description below

* **Illustration / Icon**

  * Minimal graphic showing empty state or 404 symbol
  * Should be subtle, non-distracting

* **Message Text**

  * 404 Page: “Oops! This page does not exist.”
  * Empty Module: “No data available yet. Start by adding your first entry!”

* **Primary CTA**

  * 404 Page: “Go Back Home” → redirect to Home (3.1)
  * Empty Module: Action depending on context

    * Favorites → “Browse Diets”
    * Weight Tracker → “Add Your First Weight”
    * List of Badges → “Complete Your First Week”

* **Secondary Links**

  * Support / Help (S2)
  * Optional: Contact us link or report broken page

* **Footer**

  * Same footer as Landing Page (S1)
  * Optional quick navigation links to other main modules

---

## Functional Requirements

1. **Responsive Layout**

   * Works on desktop and mobile
   * Proper scaling of illustrations and text

2. **Dynamic Empty States**

   * Detect when module has no data → show contextual message
   * Detect 404 route → show 404 illustration and guidance

3. **Navigation**

   * All CTAs must redirect to valid pages (Home or relevant module)
   * Include “Back” browser compatibility

4. **Fallback Handling**

   * No uncaught errors if module query returns empty dataset
   * Friendly messaging rather than blank screens

---

## Technical Notes

* **Supabase Queries**

  * Favorites Empty → `SELECT * FROM user_favorites WHERE user_id = '<USER_ID>';`
  * Weight Tracker Empty → `SELECT * FROM user_weight_entries WHERE user_id = '<USER_ID>';`
  * Badges Empty → `SELECT * FROM user_badges WHERE user_id = '<USER_ID>';`

* **Routing**

  * 404 handled by Next.js catch-all route `[...slug].tsx`
  * Middleware checks for protected routes → redirect to login if unauthenticated

* **UI Components**

  * shadcn/ui → Button for CTA, Card for illustration box
  * Tailwind CSS → responsive typography, spacing, and layout

---

## Suggested Implementation Snippet (client pseudo-code)

```tsx
import { Button } from "@shadcn/ui";
import Link from "next/link";

export default function EmptyState({ type }: { type: "404" | "favorites" | "weight" }) {
  let title = "", message = "", ctaLink = "", ctaText = "";
  
  switch(type) {
    case "404":
      title = "Oops! Page Not Found";
      message = "The page you are looking for does not exist.";
      ctaLink = "/home";
      ctaText = "Go Back Home";
      break;
    case "favorites":
      title = "No Favorites Yet";
      message = "You haven't added any favorite diets. Start exploring!";
      ctaLink = "/diets";
      ctaText = "Browse Diets";
      break;
    case "weight":
      title = "No Weight Entries";
      message = "Start tracking your progress by adding your first weight.";
      ctaLink = "/eu/registro-peso";
      ctaText = "Add Your First Weight";
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <div className="mb-4 text-2xl font-bold">{title}</div>
      <p className="mb-6">{message}</p>
      <Link href={ctaLink}>
        <Button>{ctaText}</Button>
      </Link>
    </div>
  );
}
```

---

## Acceptance Criteria

* Empty states appear when dataset is empty
* 404 page appears for non-existent routes
* Primary CTA correctly redirects
* Layout responsive on desktop and mobile
* Friendly illustration or placeholder text displayed

---

## Security Considerations

* Ensure no sensitive data exposure in empty states
* No access to protected modules without authentication

---

## Next.js App Routing & Middleware

* `[...slug].tsx` handles unknown routes → render 404 empty state
* Module queries → if empty, render contextual empty state component

---



