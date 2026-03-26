# BRSR Data Collection — Codebase Context

This document gives all context needed to understand and work on the codebase: purpose, stack, database, auth, routes, APIs, and BRSR questionnaire logic.

---

## 1. Project overview

**BRSR** = Business Responsibility and Sustainability Reporting (India). This app is an internal data-collection platform for BRSR questionnaires.

- **Master area** (`/master`): Super-admin. Manages organizations, users, roles, and question visibility. Role slug: `master`.
- **Onboarding** (`/onboarding`): First-time setup for a new org. Admins complete a multi-step wizard (create org, invite team, configure question assignments, launch). Non-admin users see a "pending" screen until the admin finishes onboarding.
- **Dashboard** (`/dashboard`): Org users. Fill the BRSR questionnaire (General Data, Section A/B/C, Principles 1–9) per organization and reporting year. Includes per-user question assignments (admin assigns specific codes to users) and BRSR export (DOCX/XLSX/JSON). Roles: `admin`, `user` (and custom).
- **Auth**: Email/password via Supabase Auth. Post-login redirect by role (master → `/master`, others → `/` where onboarding gate applies).

**Phases**

- **Phase 1**: Login, Master dashboard (orgs, users, roles, visibility), RLS.
- **Phase 2a**: Questionnaire UI, answers storage, calculations, General Data → Principle 6 autofill.

The codebase now also includes onboarding (multi-step org setup wizard), BRSR export (DOCX/XLSX/JSON), per-user question assignments with completion tracking, and the `brsr_questions` metadata table — functionality beyond the original Phase 2a scope.

---

## 2. Tech stack

| Layer        | Choice |
|-------------|--------|
| Framework   | Next.js 14 (App Router) |
| Auth / DB  | Supabase (Auth + Postgres) |
| Styling    | Tailwind CSS |
| Language   | TypeScript |
| Export     | docx, xlsx (BRSR document generation) |
| Testing    | Vitest (unit), Playwright (E2E) |

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
│   │   │                         #   PanelPrinciple1–9 (per-principle JSX),
│   │   │                         #   LegacyPrincipleRenderer (unused — legacy)
│   │   ├── admin-workspace/      # AdminWorkspaceClient
│   │   └── QuestionnaireShell.tsx
│   ├── (master)/master/           # Master layout, nav, orgs/users/roles/visibility
│   ├── onboarding/                # Onboarding wizard (layout, page, OnboardingClient)
│   ├── api/                       # API routes (auth, answers, orgs, users, roles, visibility,
│   │                              #   assignments, assignment-stats, export, onboarding)
│   ├── login/                     # Login page
│   ├── layout.tsx, page.tsx       # Root layout; / redirects by role + onboarding status
│   └── globals.css                # BRSR dark theme (.brsr-dark)
├── components/
│   ├── QuestionInput.tsx          # Shared text input bound to a question code
│   ├── CalcCell.tsx               # CalcCell (read-only calc display) + InlinePct
│   ├── ExportButton.tsx           # Opens export modal
│   └── ExportModal.tsx            # Format/section picker, triggers /api/export/generate
├── lib/
│   ├── supabase/                  # createClient (server), client, admin
│   ├── auth/
│   │   ├── accessPolicy.ts       # Pure policy: isMaster, canUseApp, redirectForIncompleteApp, etc.
│   │   └── requireAppAccess.ts   # API route guard (builds AccessContext, returns 401/403)
│   ├── exporters/
│   │   ├── brsrDataMapper.ts     # mapAnswersToBRSR (answers → structured BRSR JSON)
│   │   ├── brsrDocx.ts           # buildBRSRDocx
│   │   └── brsrXlsx.ts           # buildBRSRXlsx
│   └── brsr/
│       ├── constants.ts           # REPORTING_YEARS, SAVE_DEBOUNCE_MS
│       ├── questionCodes.ts       # All *_CODES arrays, getQuestionCodesForPanel, isQuestionCode
│       ├── calcRules.ts           # CALC_RULES array (all panels)
│       ├── panels.ts              # PANELS array
│       ├── questionConfig.ts      # Re-export barrel (preserves existing import paths)
│       ├── calcEngine.ts          # runCalculations()
│       ├── types.ts               # AnswersState, PanelId, CalcRule
│       ├── assignmentBlocks.ts    # AssignmentBlock, getAssignmentBlocksForPanel, label maps
│       ├── principleTemplates.ts  # Raw HTML templates for P1–P9
│       ├── flowGeneralDataToP6.ts # General Data → Principle 6 autofill
│       ├── visibilityUtils.ts     # isAllowed, filterByAllowed, sectionHasAnyAllowed
│       ├── fyLabels.ts            # getFYLabelsFromReportingYear, getFYLabels
│       └── principleBlocksConfig.ts # getStaticPrincipleBlocks (P1–5, P7–9 assignment blocks)
├── playwright/
│   ├── tests/
│   │   ├── global-setup.ts                   # Saves admin + user storageState
│   │   ├── panel-checklist.spec.ts           # Full panel-by-panel visibility checklist
│   │   └── user-question-visibility.spec.ts  # User-only smoke tests
│   └── .auth/                                # Saved auth state (gitignored)
│       ├── admin.json
│       └── user.json
├── playwright.config.ts           # Playwright config (4 projects; workers=1 for serial)
├── supabase/migrations/           # SQL migrations (001 → 008)
├── scripts/
│   ├── seed-master.ts             # Create first Master user
│   ├── seed-brsr-questions.ts     # Seed brsr_questions table
│   └── audit-principle-codes.ts   # Diagnostic: audit principle question codes
├── middleware.ts                  # Auth + role-based + onboarding-gate redirect
├── .env.local.example
├── CONTEXT.md                     # This file
└── README.md                      # Quick setup
```

---

## 4. Database

### 4.1 Schema summary

| Table | Purpose |
|-------|--------|
| `organizations` | Tenants/clients. `id`, `name`, `plan_tier`, `created_at`. Added in 006: `reporting_year`, `company_type`, `industry`, `hq_city`, `country` (default `'India'`), `cin`, `website`, `onboarding_complete` (boolean, default `false`). Constraint: name must not be blank (008). |
| `roles` | System (`master`, `admin`, `user`) + custom. `id`, `name`, `slug` (unique), `is_system`, `created_at`. Seeded in 001; migration 009 renames Normal → User (`slug` `user`). |
| `profiles` | Extends `auth.users`. `id` = `auth.uid()`, `org_id`, `role_id`, `email`, `display_name`, `created_by`, timestamps. |
| `user_role_slug_cache` | Cache for RLS: `user_id` → `role_slug`, `org_id`. Kept in sync by trigger on `profiles` (002). Avoids reading `profiles` inside RLS (recursion). |
| `brsr_questions_visibility` | Per-role (and optionally org) visibility: `role_id`, `section`, `principle_no`, `question_code`. Unique on (org_id, role_id, section, principle_no, question_code). |
| `answers` | Questionnaire answers. `org_id`, `reporting_year`, `question_code`, `value`, `updated_by`, `updated_at`. Unique on (org_id, reporting_year, question_code). |
| `user_question_assignments` | Per-user question assignments. `id`, `org_id`, `user_id`, `question_code`, `created_at`. Unique on (org_id, user_id, question_code). Created in 005. |
| `brsr_questions` | Question metadata. `question_code` (PK), `panel_id`, `section_label`, `question_order`, `brsr_version` (default `'SEBI-2023'`), `is_active` (default `true`), `created_at`. Created in 007. |

### 4.2 Migrations (run in order)

1. **001_initial_schema.sql**
   - Creates `organizations`, `roles`, `profiles`, `brsr_questions_visibility`.
   - Seeds `roles` (Master, Admin, Normal; later migration renames Normal to User / `user`).
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

5. **005_user_question_assignments.sql**
   - Creates `user_question_assignments` table with RLS (select for master, admin same-org, or own rows; insert/update/delete for master or admin same-org).
   - Creates `can_access_question(target_org_id, target_question_code)` function (master → true; admin → true if same org; non-admin org users → requires matching row in `user_question_assignments`).
   - **Rewrites all 4 `answers` RLS policies** to use `can_access_question(org_id, question_code)` instead of direct org/role checks.

6. **006_onboarding_fields.sql**
   - Adds columns to `organizations`: `reporting_year`, `company_type`, `industry`, `hq_city`, `country` (default `'India'`), `cin`, `website`, `onboarding_complete` (boolean, default `false`).
   - Adds `organizations_update_admin_own_org` UPDATE policy so admins can update their own org.

7. **007_brsr_questions.sql**
   - Creates `brsr_questions` table (`question_code` PK, `panel_id`, `section_label`, `question_order`, `brsr_version`, `is_active`).
   - RLS: `brsr_questions_select_authed` — SELECT for all authenticated users.
   - Seeded via `npm run seed:questions` (not inline SQL).

8. **008_organizations_name_not_blank.sql**
   - Updates any blank org names to `'Unnamed Organization'`.
   - Adds CHECK constraint: `length(trim(name)) > 0`.

### 4.3 RLS summary

- **organizations**: Master = full CRUD; Admin = UPDATE own org (006); others = SELECT only own org (`current_user_org_id()`).
- **roles**: All authenticated = SELECT; Master = INSERT, UPDATE, DELETE (API restricts system role deletes).
- **profiles**: Master = all; same-org = SELECT; user = SELECT own. Only Master INSERT/UPDATE.
- **brsr_questions_visibility**: Master = all; others SELECT by own org (or org_id NULL). Insert/Update/Delete = Master or Admin.
- **answers**: After 005, all operations use `can_access_question(org_id, question_code)` — master always; admin if same org; User-role accounts only if assigned that code in `user_question_assignments`.
- **user_question_assignments**: SELECT for master, admin (same org), or own rows. INSERT/UPDATE/DELETE for master or admin (same org).
- **brsr_questions**: SELECT for all authenticated users.

---

## 5. Auth and routing

### 5.1 Login flow

- **Page**: `app/login/page.tsx`. Email/password → `supabase.auth.signInWithPassword`. On success: fetch profile (role), then `router.push("/master")` for master or `router.push("/")` for others (home page applies onboarding gate) + `router.refresh()`.
- Loading state: spinner until redirect on success; on error, loading is cleared and error message shown.
- Password field has a show/hide toggle (eye icon).

### 5.2 Middleware (`middleware.ts`)

- Matcher: `/`, `/login`, `/onboarding`, `/onboarding/:path*`, `/dashboard/:path*`, `/master/:path*`.
- If not authenticated and path ≠ `/login` → redirect to `/login`.
- If authenticated: loads profile (role, org_id) and `organizations.onboarding_complete` if org exists. Builds `AccessContext` and uses policy helpers from `lib/auth/accessPolicy.ts`:
  - On `/login` → redirect to `/master` (if master), `/dashboard` (if `canUseApp`), or `redirectForIncompleteApp` (→ `/onboarding` or `/login`).
  - On `/master` and role ≠ master → redirect to `/dashboard`.
  - On `/dashboard` and role = master → redirect to `/master`.
  - On `/onboarding` and `canUseApp` → redirect to `/dashboard` (onboarding already done).
  - On `/dashboard` or `/` and not master and not `canUseApp` → `redirectForIncompleteApp`.

### 5.2a Access policy (`lib/auth/accessPolicy.ts`)

Pure-function policy layer used by middleware, API routes (`requireAppAccess`), and pages:

- `isMaster(roleSlug)` — true if `'master'`.
- `canUseApp(ctx)` — master always; others need `orgId` and `onboardingComplete === true`.
- `redirectForIncompleteApp(ctx)` — no org + admin → `/onboarding`; no org + non-admin → `/login`; has org but incomplete → `/onboarding`.
- `canUseAdminOnboardingWizard(ctx)` — admin only.
- `shouldShowOrgPendingOnly(ctx)` — non-admin with org but incomplete onboarding.
- `canAccessAssignmentEndpoints(ctx)` — master, `canUseApp`, or admin with org during onboarding.

### 5.3 Roles

- **master**: No org; access only to `/master`. Full admin over orgs, users, roles, visibility.
- **admin** / **user**: Has `org_id`; access to `/dashboard`. Admin drives onboarding (create org, invite users, configure assignments, launch), manages visibility and question assignments, and can export. User-role accounts fill their assigned questions. Difference between admin and User is scope (e.g. visibility, assignments, user management, export) as implemented in API/UI.

---

## 6. App routes

| Path | Who | Description |
|------|-----|--------------|
| `/` | All | Server component: auth + profile + onboarding check. Redirects to `/login`, `/master`, `/onboarding`, or `/dashboard`. |
| `/login` | All | Login form; post-login redirect by role. |
| `/onboarding` | Admin / Non-master | Multi-step onboarding wizard (admin: create org, invite team, configure assignments, launch). Non-admin with incomplete onboarding sees "pending" screen. Redirects to `/dashboard` once complete. |
| `/dashboard` | Non-master | Dashboard layout + questionnaire (org from profile). Requires `onboarding_complete`. Header includes `ExportButton`. |
| `/dashboard/admin-workspace` | Admin | Admin workspace: completion stats per user, per-user question assignment management. |
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
| `/api/auth/signout` | POST | — | Sign out (form post from AccountDropdown). 302 → `/login`. |
| `/api/answers` | GET, POST | `requireAppAccess("data")` | GET: `org_id`, `reporting_year` → `{ answers }`. POST: upsert answers (org_id, reporting_year, answers). |
| `/api/assignments` | GET, PUT | `requireAppAccess("assignments")` + admin/master | GET: list org users + assignments (`?user_id=`, `?org_id=`). PUT: replace a user's assigned question codes. |
| `/api/assignments/me` | GET | `requireAppAccess("data")` | Current user's assigned codes → `{ mode: "all"\|"restricted", question_codes }`. |
| `/api/assignment-stats` | GET | `requireAppAccess("data")` + admin/master | Per-user completion stats for a reporting year (`?reporting_year=`, `?org_id=`). |
| `/api/export/brsr` | GET | `requireAppAccess("data")` + admin/master | Mapped BRSR JSON export (`?orgId=`, `?year=`). |
| `/api/export/generate` | POST | Same as export/brsr | Generate DOCX/XLSX/JSON download (body: `orgId`, `year`, `format`, `sections`). PDF → 501. |
| `/api/onboarding/organization` | POST | Auth + admin (no org yet) | Create organization and link to admin's profile. |
| `/api/onboarding/users` | POST | Auth + admin (has org) | Bulk invite users to org. |
| `/api/onboarding/launch` | POST | Auth + admin (has org) | Set `onboarding_complete = true` on org. |
| `/api/organizations` | PATCH, POST, DELETE | Master (POST/DELETE); admin/master (PATCH) | POST: create org. DELETE: delete org by id. PATCH: update org fields (admin own org only). |
| `/api/users` | POST, DELETE | Master | Create user (email, password, org_id, role_id); delete user. Uses service role for create. |
| `/api/roles` | POST, DELETE | Master | Create custom role (name, slug); delete role (API blocks system role delete). |
| `/api/visibility` | POST | Master/Admin | Insert `brsr_questions_visibility` row (role_id, section, principle_no, question_code). |

All authenticated APIs use `createClient()` from `lib/supabase/server`; RLS applies. User creation and onboarding user invites use `lib/supabase/admin` (service role) where needed.

**`requireAppAccess(mode)`** (`lib/auth/requireAppAccess.ts`): Shared API route guard. Authenticates the user, loads profile + org, builds `AccessContext`, and applies the appropriate policy check. Modes: `"data"` — requires `canUseApp` (master, or org with completed onboarding); `"assignments"` — requires `canAccessAssignmentEndpoints` (also allows admin during onboarding).

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
- **`visibilityUtils.ts`** — `isAllowed(code, allowedSet)`, `filterByAllowed(codes, allowedSet)`, `sectionHasAnyAllowed(codes, allowedSet)`. Used in panel components for restricted-user visibility filtering.
- **`fyLabels.ts`** — `getFYLabelsFromReportingYear(reportingYear)`, `getFYLabels(ry)`. Returns `[FY current, FY previous, FY prior]` display strings.
- **`principleBlocksConfig.ts`** — `getStaticPrincipleBlocks(principleNum, codes)`. Static prefix-based assignment blocks for migrated principles P1–P5, P7–P9.
- **`assignmentBlocks.ts`** — `AssignmentBlock` type, `GENERAL_LABELS`, `SECTION_B_LABELS`, `P6_PREFIX_LABELS`, `getAssignmentBlocksForPanel(panelId)`. Used in `AdminWorkspaceClient` and `OnboardingClient`.
- **`principleTemplates.ts`** — `getPrincipleTemplate(principleNum)`. Raw HTML templates for P1–P9 (legacy `brsr-data-entry` style). Used by `parsePrincipleTemplateBlocks` for non-migrated flows (P6) and by `LegacyPrincipleRenderer` (unused legacy).

### 8.3 Calculation engine (`lib/brsr/calcEngine.ts`)

- **`runCalculations(values: AnswersState): Record<string, string>`**: Applies `CALC_RULES`; returns map of outputId → formatted string (percentages, sums, formula results). Safe formula parser (no eval); supports +, -, *, /, parentheses and question_code identifiers.

### 8.4 General Data → Principle 6 (`lib/brsr/flowGeneralDataToP6.ts`)

- **`flowGeneralDataToPrinciple6(values): Partial<AnswersState>`**: From `gdata_turnover_cy/py` and `gdata_ppp_cy/py`, fills P6 revenue and rev_ppp question codes (turnover copy and turnover/PPP ratio). Used in dashboard when General Data inputs change; result is merged into answers and saved.

### 8.5 Dashboard UI

- **QuestionnaireShell** (`QuestionnaireShell.tsx`): Reporting year selector; sidebar with panel list (active state); renders panel by `activePanel`. Data loading/saving is delegated to `hooks/useAnswers.ts`.
- **Custom hooks** (`hooks/`):
  - `useAnswers` — loads and debounce-saves answers; respects `allowedSet` (from `user_question_assignments`); exposes `answers`, `loading`, `saving`, `onChange`.
  - `useAssignmentStats` — fetches completion statistics for the Admin Workspace.
  - `useAssignments` — loads, toggles, and saves per-user question assignments.
- **Panels**: `PanelGeneralData`, `PanelGeneral`, `PanelSectionB`, `PanelPrinciple`. Each receives `values`, `onChange`, and (where needed) `calcDisplay` from `runCalculations`. Panels use `isAllowed` from `visibilityUtils.ts` to filter inputs for restricted users.
- **Principle panel** (`PanelPrinciple.tsx`): Orchestrator with essential/leadership tabs and a per-principle notes field (`p{n}_notes`). Imports `PanelPrinciple1.tsx` through `PanelPrinciple9.tsx`:
  - `PanelPrinciple1.tsx` … `PanelPrinciple9.tsx` — 9 individual JSX files, each exporting `PNEssentialContent` and `PNLeadershipContent`. All principles are now native JSX components.
  - `LegacyPrincipleRenderer.tsx` — HTML-template renderer (dynamic rows, calc display, input binding). **Unused — legacy code; not imported by any file.**
- **Shared components** (`components/`):
  - `QuestionInput.tsx` — Reusable `<input>` bound to a question code.
  - `CalcCell.tsx` — `CalcCell` (read-only display of `calcDisplay[code]`) and `InlinePct` (inline percentage from two values).
  - `ExportButton.tsx` — Opens `ExportModal`; used in dashboard header.
  - `ExportModal.tsx` — Format picker (DOCX/XLSX/JSON; PDF disabled), section selector, triggers `/api/export/generate` download.
- **Theme**: Dark theme via `.brsr-dark` in `globals.css` (inputs, tables, labels, borders). Header/sidebar use `#1a202c`, content `#0a0f12`, borders `#334155`.

---

## 9. Environment variables

| Variable | Required | Purpose |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key (public). |
| `SUPABASE_SERVICE_ROLE_KEY` | For Master user create, seed, and onboarding | Service role key. Never expose to client. |
| `E2E_ADMIN_EMAIL` | For Playwright E2E | Email of an `admin`-role account (org with completed onboarding). |
| `E2E_ADMIN_PASSWORD` | For Playwright E2E | Password for the admin account. |
| `E2E_USER_EMAIL` | For Playwright E2E | Email of a `user`-role account in the same org. |
| `E2E_USER_PASSWORD` | For Playwright E2E | Password for the user account. |
| `PLAYWRIGHT_BASE_URL` | No (default `http://127.0.0.1:3000`) | Override base URL for E2E tests. |

Copy `.env.local.example` to `.env.local` and set values. See README for setup steps.

---

## 10. Scripts

- **`npm run dev`** — Next.js dev server.
- **`npm run build`** / **`npm run start`** — Production build and start.
- **`npm run seed:master`** — Create first Master user: `npm run seed:master -- <email> <password>`. Requires migrations and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
- **`npm run seed:questions`** — Seed `brsr_questions` table from code. Requires migrations and `SUPABASE_SERVICE_ROLE_KEY`.
- **`npm run test`** / **`npm run test:watch`** — Run unit tests with Vitest (one-shot / watch mode).
- **`npm run test:e2e`** — Run all Playwright E2E tests (headless Chromium). Requires `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`, `E2E_USER_EMAIL`, `E2E_USER_PASSWORD` in `.env.local`.
- **`npm run test:e2e -- --project=panel-checklist`** — Run only the panel-by-panel visibility checklist (admin assigns via API → user verifies per panel, Essential/Leadership separately).
- **`npm run test:e2e -- --project=user-visibility`** — Run only the user-context smoke tests.
- **`npm run test:e2e:ui`** — Open Playwright UI mode for interactive debugging.
- **`npm run lint`** — Next.js lint.

---

## 11. Reference / conventions

- **Supabase client**: Server components and API routes use `createClient()` from `@/lib/supabase/server` (cookie-based). Client components use `createClient()` from `@/lib/supabase/client`. Admin operations (e.g. create user, onboarding invites) use `createAdminClient()` from `@/lib/supabase/admin` with service role.
- **Access policy**: `lib/auth/accessPolicy.ts` is a pure-function policy layer (no DB calls) used by middleware, API routes, and pages. `lib/auth/requireAppAccess.ts` is the standard API route guard that builds `AccessContext` and returns 401/403 on failure. All new API routes should use `requireAppAccess(mode)`.
- **Exporters**: `lib/exporters/` contains `brsrDataMapper.ts` (answers → structured BRSR JSON), `brsrDocx.ts`, and `brsrXlsx.ts`. Used by `/api/export/*` routes.
- **BRSR reference**: Question structure and codes align with `brsr-data-entry 2.html` (reference document). New panels or codes should stay in sync with that, `questionConfig.ts`, `principleBlocksConfig.ts`, `visibilityUtils.ts`, and `fyLabels.ts`.
- **Master vs Dashboard**: Shared `AccountDropdown` lives under `app/(dashboard)/dashboard/AccountDropdown.tsx` and is imported by the Master layout for the header.

This file is the single place for full codebase context; README remains the quick setup guide.
