# Development Environment

## Tooling
- Node.js LTS (v20+)
- npm 10+
- VSCode with recommended extensions

## Scripts
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - run ESLint
- `npm run commit` - commit with Commitizen

## Git Hooks
- pre-commit: runs lint-staged (ESLint on staged files)
- commit-msg: commitlint (enforce Conventional Commits)

## Conventional Commits
Examples:
- `feat: add diet recommendations panel`
- `fix: correct RLS policy for favorites`
- `chore: update dependencies`

## Environment Variables
Copy `env.example` to `.env.local` and fill values.

## Supabase Configuration
- Supabase client properly configured with generated types
- Environment variables handled gracefully during build
- All TypeScript type issues resolved

## Deployment
- **Vercel**: Primary deployment platform
- **Build**: Standard Next.js build (no static export)
- **API Routes**: Fully supported
- **Server-side**: Full functionality enabled

## Code Style
- TypeScript strict
- ESLint (Next.js config)
- TailwindCSS v4
