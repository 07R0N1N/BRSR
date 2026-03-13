# BRSR Data Collection — Codebase Context

This document gives all context needed to understand and work on the codebase: purpose, stack, database, auth, routes, APIs, and BRSR questionnaire logic.

---

## 1. Project overview

**BRSR** = Business Responsibility and Sustainability Reporting (India). This app is an internal data-collection platform for BRSR questionnaires.

- **Master area** (`/master`): Super-admin. Manages organizations, users, roles, and question visibility. Role slug: `master`.
- **Dashboard** (`/dashboard`): Org users. Fill the BRSR questionnaire (General Data, Section A/B/C, Principles 1–9) per organization and reporting year. Roles: `admin`, `normal` (and custom).
- **Auth**: Email/password via Supabase Auth. Post-login redirect by role (master → `/master`, others → `/dashboard`).

**Phases**

- **Phase 1**: Login, Master dashboard (orgs, users, roles, visibility), RLS.
- **Phase 2a**: Questionnaire UI, answers storage, calculations, General Data → Principle 6 autofill.

---

## 2. Tech stack

| Layer        | Choice |
|-------------|--------|
| Framework   | Next.js 14 (App Router) |
| Auth / DB  | Supabase (Auth + Postgres) |
| Styling    | Tailwind CSS |
| Language   | TypeScript |

- **Package manager**: npm  
- **Path alias**: `@/` → project root (see `tsconfig.json`).

---

## 3. Directory structure (high level)

```
BRSR/
├── app/
│   ├── (dashboard)/dashboard/
│   │   ├── hooks/                # Custom React hooks (useAnswers, useAssignments, useAssignmentStats)
│   │   ├── panels/               # PanelGeneralData, PanelGeneral, PanelSectionB, PanelPrinciple,
│   │   │                         #   PanelPrinciple6 (P6 JSX), LegacyPrincipleRenderer (P1-5, P7-9)
│   │   ├── admin-workspace/      # AdminWorkspaceClient
│   │   └── QuestionnaireShell.tsx
│   ├── (master)/master/           # Master layout, nav, orgs/users/roles/visibility
│   ├── api/                       # API routes (auth, answers, orgs, users, roles, visibility, assignments)
│   ├── login/                     # Login page
│   ├── layout.tsx, page.tsx       # Root layout; / redirects to /dashboard or /login
│   └── globals.css                # BRSR dark theme (.brsr-dark)
├── components/
│   └── QuestionInput.tsx          # Shared text input bound to a question code
├── lib/
│   ├── supabase/                  # createClient (server), client, admin
│   └── brsr/
│       ├── constants.ts           # REPORTING_YEARS, SAVE_DEBOUNCE_MS
│       ├── questionCodes.ts       # All *_CODES arrays, getQuestionCodesForPanel, isQuestionCode
│       ├── calcRules.ts           # CALC_RULES array (all panels)
│       ├── panels.ts              # PANELS array
│       ├── questionConfig.ts      # Re-export barrel (preserves existing import paths)
│       ├── calcEngine.ts          # runCalculations()
│       ├── types.ts               # AnswersState, PanelId, CalcRule
│       ├── assignmentBlocks.ts    # AssignmentBlock metadata for Admin UI
│       ├── principleTemplates.ts  # Raw HTML templates for P1-5, P7-9
│       └── flowGeneralDataToP6.ts # General Data → Principle 6 autofill
├── supabase/migrations/           # SQL migrations (001 → 005)
├── scripts/
│   └── seed-master.ts             # Create first Master user
├── middleware.ts                  # Auth + role-based redirect
├── .env.local.example
├── CONTEXT.md                     # This file
└── README.md                      # Quick setup
```

---

## 4. Database

### 4.1 Schema summary

| Table | Purpose |
|-------|--------|
| `organizations` | Tenants/clients. `id`, `name`, `plan_tier`, `created_at`. |
| `roles` | System (`master`, `admin`, `normal`) + custom. `id`, `name`, `slug` (unique), `is_system`, `created_at`. Seeded in 001. |
| `profiles` | Extends `auth.users`. `id` = `auth.uid()`, `org_id`, `role_id`, `email`, `display_name`, `created_by`, timestamps. |
| `user_role_slug_cache` | Cache for RLS: `user_id` → `role_slug`, `org_id`. Kept in sync by trigger on `profiles` (002). Avoids reading `profiles` inside RLS (recursion). |
| `brsr_questions_visibility` | Per-role (and optionally org) visibility: `role_id`, `section`, `principle_no`, `question_code`. Unique on (org_id, role_id, section, principle_no, question_code). |
| `answers` | Questionnaire answers. `org_id`, `reporting_year`, `question_code`, `value`, `updated_by`, `updated_at`. Unique on (org_id, reporting_year, question_code). |

### 4.2 Migrations (run in order)

1. **001_initial_schema.sql**
   - Creates `organizations`, `roles`, `profiles`, `brsr_questions_visibility`.
   - Seeds `roles` (Master, Admin, Normal).
   - Enables RLS; policies use `public.user_role_slug()` (reads from `profiles`).
   - Trigger: `profiles.updated_at`.

2. **002_fix_profiles_rls_recursion.sql**
   - Adds `user_role_slug_cache` and trigger to sync it from `profiles`.
   - Adds `current_user_role_slug()` and `current_user_org_id()` (read from cache only).
   - Replaces all RLS policies to use these helpers instead of `user_role_slug()` so no policy reads `profiles` (avoids recursion).

3. **003_allow_master_delete_orgs_roles.sql**
   - Adds DELETE policies for `organizations` and `roles` for Master. API still prevents deleting system roles (e.g. master/admin).

4. **004_brsr_answers.sql**
   - Creates `answers` table and indexes.
   - RLS: select/insert/update/delete for own org or Master. Uses `current_user_org_id()` and `user_role_slug() = 'master'`.  
   - **Note:** For consistency with 002, answers RLS could use `current_user_role_slug() = 'master'` instead of `user_role_slug()`; both work if 001’s `user_role_slug()` is still present.

### 4.3 RLS summary

- **organizations**: Master = full CRUD; others = SELECT only own org (`current_user_org_id()`).
- **roles**: All authenticated = SELECT; Master = INSERT, UPDATE, DELETE (API restricts system role deletes).
- **profiles**: Master = all; same-org = SELECT; user = SELECT own. Only Master INSERT/UPDATE.
- **brsr_questions_visibility**: Master = all; others SELECT by own org (or org_id NULL). Insert/Update/Delete = Master or Admin.
- **answers**: SELECT/INSERT/UPDATE/DELETE for rows where `org_id = current_user_org_id()` OR user is Master.

---

## 5. Auth and routing

### 5.1 Login flow

- **Page**: `app/login/page.tsx`. Email/password → `supabase.auth.signInWithPassword`. On success: fetch profile (role), then `router.push("/master")` or `router.push("/dashboard")` + `router.refresh()`.
- Loading state: spinner until redirect on success; on error, loading is cleared and error message shown.
- Password field has a show/hide toggle (eye icon).

### 5.2 Middleware (`middleware.ts`)

- Matcher: `/login`, `/dashboard/:path*`, `/master/:path*`.
- If not authenticated → redirect to `/login`.
- If authenticated: loads profile (role).  
  - On `/login` → redirect to `/master` or `/dashboard` by role.  
  - On `/master` and role ≠ master → redirect to `/dashboard`.  
  - On `/dashboard` and role = master → redirect to `/master`.

### 5.3 Roles

- **master**: No org; access only to `/master`. Full admin over orgs, users, roles, visibility.
- **admin** / **normal**: Has `org_id`; access to `/dashboard`. Can manage visibility (admin) and fill questionnaire. Difference between admin and normal is scope (e.g. visibility, user management) as implemented in API/UI.

---

## 6. App routes

| Path | Who | Description |
|------|-----|--------------|
| `/` | All | Redirect: logged in → `/dashboard` (or `/master` by middleware); else `/login`. |
| `/login` | All | Login form; post-login redirect by role. |
| `/dashboard` | Non-master | Dashboard layout + questionnaire (org from profile). If no org, message only. |
| `/master` | Master | Master layout; overview with stat cards. |
| `/master/organizations` | Master | List/create/delete organizations. |
| `/master/users` | Master | List/create/delete users; assign org and role. |
| `/master/roles` | Master | List/create/delete (custom) roles. |
| `/master/visibility` | Master | BRSR question visibility by role/section/principle/code. |

Dashboard uses a single shell (`QuestionnaireShell`) with sidebar panels: General Data, Section A, Section B, Section C – Principles (P1–P9). Master uses `MasterNav` (client) for sidebar with active state.

---

## 7. API routes

| Route | Methods | Auth | Purpose |
|-------|---------|------|--------|
| `/api/auth/signout` | POST | - | Sign out (form post from AccountDropdown). |
| `/api/answers` | GET, POST | Yes | GET: `org_id`, `reporting_year` → `{ answers }`. POST: upsert answers (org_id, reporting_year, answers). RLS enforces org/Master. |
| `/api/organizations` | POST, DELETE | Master | Create org; delete org (by id). |
| `/api/users` | POST, DELETE | Master | Create user (email, password, org_id, role_id); delete user. Uses service role for create. |
| `/api/roles` | POST, DELETE | Master | Create custom role (name, slug); delete role (API blocks system role delete). |
| `/api/visibility` | GET, POST, etc. | Master/Admin | Manage `brsr_questions_visibility` (exact shape depends on implementation). |

All authenticated APIs use `createClient()` from `lib/supabase/server`; RLS applies. User creation uses `lib/supabase/admin` (service role) where needed.

---

## 8. BRSR questionnaire (Phase 2a)

### 8.1 Data flow

- **Storage**: One row per (org_id, reporting_year, question_code) in `answers`. Values are strings. UI loads via GET `/api/answers`, saves via POST with debounce.
- **State**: `AnswersState = Record<string, string>` (question_code → value). Panels read from this and call `onChange(questionCode, value)`.

### 8.2 Question config (split across `lib/brsr/`)

`questionConfig.ts` is a re-export barrel. Edit the underlying files directly:

- **`constants.ts`** — `REPORTING_YEARS`, `SAVE_DEBOUNCE_MS`.
- **`questionCodes.ts`** — All `*_CODES` arrays per panel; `NGRBC_PRINCIPLE_TITLES`; `P6_AUTOFILL_REV_IDS`, `P6_AUTOFILL_REV_PPP_IDS`; `getQuestionCodesForPanel(panelId)`, `ALL_QUESTION_CODES`, `isQuestionCode(code)`.
- **`calcRules.ts`** — `CALC_RULES` array (`pct`, `sum`, `formula` rules with `outputId` and decimals). Used for read-only calc cells across all panels.
- **`panels.ts`** — `PANELS` array of `{ id, label, group }`. Groups: "General Data", "Section A", "Section B", "Section C – Principles".

### 8.3 Calculation engine (`lib/brsr/calcEngine.ts`)

- **`runCalculations(values: AnswersState): Record<string, string>`**: Applies `CALC_RULES`; returns map of outputId → formatted string (percentages, sums, formula results). Safe formula parser (no eval); supports +, -, *, /, parentheses and question_code identifiers.

### 8.4 General Data → Principle 6 (`lib/brsr/flowGeneralDataToP6.ts`)

- **`flowGeneralDataToPrinciple6(values): Partial<AnswersState>`**: From `gdata_turnover_cy/py` and `gdata_ppp_cy/py`, fills P6 revenue and rev_ppp question codes (turnover copy and turnover/PPP ratio). Used in dashboard when General Data inputs change; result is merged into answers and saved.

### 8.5 Dashboard UI

- **QuestionnaireShell** (`QuestionnaireShell.tsx`): Reporting year selector; sidebar with panel list (active state); renders panel by `activePanel`. Data loading/saving is delegated to `hooks/useAnswers.ts`.
- **Custom hooks** (`hooks/`):
  - `useAnswers` — loads and debounce-saves answers; exposes `answers`, `loading`, `saving`, `onChange`.
  - `useAssignmentStats` — fetches completion statistics for the Admin Workspace.
  - `useAssignments` — loads, toggles, and saves per-user question assignments.
- **Panels**: `PanelGeneralData`, `PanelGeneral`, `PanelSectionB`, `PanelPrinciple`. Each receives `values`, `onChange`, and (where needed) `calcDisplay` from `runCalculations`.
- **Principle panel** (`PanelPrinciple.tsx`): Orchestrator only (~60 lines). Delegates to:
  - `PanelPrinciple6.tsx` — P6 Essential and Leadership JSX components.
  - `LegacyPrincipleRenderer.tsx` — HTML-template renderer for P1-5 and P7-9 (dynamic rows, calc display, input binding).
- **Shared input** (`components/QuestionInput.tsx`): Reusable `<input>` bound to a question code. Used inside `PanelPrinciple6`.
- **Theme**: Dark theme via `.brsr-dark` in `globals.css` (inputs, tables, labels, borders). Header/sidebar use `#1a202c`, content `#0a0f12`, borders `#334155`.

---

## 9. Environment variables

| Variable | Required | Purpose |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key (public). |
| `SUPABASE_SERVICE_ROLE_KEY` | For Master user create + seed | Service role key. Never expose to client. |

Copy `.env.local.example` to `.env.local` and set values. See README for setup steps.

---

## 10. Scripts

- **`npm run dev`** — Next.js dev server.
- **`npm run build`** / **`npm run start`** — Production build and start.
- **`npm run seed:master`** — Create first Master user: `npm run seed:master -- <email> <password>`. Requires migrations and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
- **`npm run lint`** — Next.js lint.

---

## 11. Reference / conventions

- **Supabase client**: Server components and API routes use `createClient()` from `@/lib/supabase/server` (cookie-based). Client components use `createClient()` from `@/lib/supabase/client`. Admin operations (e.g. create user) use `@/lib/supabase/admin` with service role.
- **BRSR reference**: Question structure and codes align with `brsr-data-entry 2.html` (reference document). New panels or codes should stay in sync with that and `questionConfig.ts`.
- **Master vs Dashboard**: Shared `AccountDropdown` lives under `app/(dashboard)/dashboard/AccountDropdown.tsx` and is imported by the Master layout for the header.

This file is the single place for full codebase context; README remains the quick setup guide.
