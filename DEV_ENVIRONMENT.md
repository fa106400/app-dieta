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

## Supabase Local (optional)
- Use Supabase dashboard for schema
- Or install Supabase CLI if you want local emulation

## Code Style
- TypeScript strict
- ESLint (Next.js config)
- TailwindCSS v4
