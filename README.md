# BRSR Data Collection Platform

Phase 1: Login, Master Dashboard, Roles & Visibility.

## Setup

1. **Supabase**: Create a project at [supabase.com](https://supabase.com). In SQL Editor, run in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_fix_profiles_rls_recursion.sql` (fixes RLS recursion so Master login redirect works)
   - `supabase/migrations/003_allow_master_delete_orgs_roles.sql` (allows Master to delete organizations and non-system roles)
   If you already ran 001/002, run 003 so delete buttons work in the Master dashboard.

2. **Env**: Copy `.env.local.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL` — project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key  
   For creating users from Master Dashboard, also set:
   - `SUPABASE_SERVICE_ROLE_KEY` — service role key (keep secret, server-only)

3. **First Master user**: Either run the seed script or create manually:
   - **Script**: `npm run seed:master -- your@email.com YourPassword` (loads `.env.local`; requires `SUPABASE_SERVICE_ROLE_KEY`).
   - **Manual**: In Supabase Dashboard → Authentication → Users, create a user (email + password). In SQL Editor: insert into `profiles` (id, org_id, role_id, email) with that user's id, NULL org_id, and the role id for `slug = 'master'` from `roles`.

4. **Install and run**:
   ```bash
   npm install
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000). Sign in → Master goes to `/master`, others to `/dashboard`.

## Scripts

- `npm run dev` — Next.js dev server (Turbopack)
- `npm run seed:master` — Creates first Master user (requires env with service role key; run once)
