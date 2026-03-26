# BRSR tests

## Unit tests (Vitest)

```bash
npm test
npm run test:watch
```

Policy tests live in [`accessPolicy.test.ts`](accessPolicy.test.ts) and cover [`lib/auth/accessPolicy.ts`](../lib/auth/accessPolicy.ts): app access after onboarding, redirects, assignment API access during admin setup, and org create vs update mode.

## Manual regression (onboarding gate)

Run `npm run dev` with a valid Supabase project and `.env.local`.

1. **Master** — Sign in as master → should land on `/master`; `/dashboard` redirects to `/master`.
2. **New admin (no org)** — Create admin without org from Master users UI → sign in as that admin → should reach `/onboarding` wizard; Step 2 creates org via `POST /api/onboarding/organization` → complete steps → Launch → `/dashboard`.
3. **Invited user (User role) before launch** — While admin has not launched, sign in as invited user → should see “Organisation setup in progress” on `/onboarding` with logout only.
4. **After launch** — User-role account and admin can use `/dashboard`; questionnaire and exports work; calling `/api/answers` before launch (as User role) returns 403.

## Production build

```bash
npm run build
```
