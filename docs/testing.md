# Testing

## Test suite index

| File | Type | Breaker | What it covers | Run command |
|------|------|---------|----------------|-------------|
| `lib/exporters/brsrDocx.test.ts` | Vitest unit | N/A | `tv()`, `pv()`, `isRowEmpty()` helpers map mapper sentinel / null / blank to correct table-cell ("") and prose ("Disclosure Not Available") display values. | `npx vitest run lib/exporters/brsrDocx.test.ts` |
| `lib/brsr/blockAccessPrefixes.test.ts` | Vitest unit | VISIBILITY | Prefix-based access matches RLS/UI so dynamic row codes save when the block is assigned; migration 011 array stays in sync with TS. | `npx vitest run lib/brsr/blockAccessPrefixes.test.ts` |
| `test/accessPolicy.test.ts` | Vitest unit | VISIBILITY | Role + onboarding combinations gate app use and redirects (master / admin / user). | `npx vitest run test/accessPolicy.test.ts` |
| `supabase/tests/rls-dynamic-rows.test.ts` | Vitest RLS integration | BOTH | Postgres RLS on `answers` for dynamic row codes; restricted vs admin vs master. | `SUPABASE_RLS_INTEGRATION=1 npx vitest run --config vitest.rls.config.ts supabase/tests/rls-dynamic-rows.test.ts` |
| `playwright/tests/dynamic-row-visibility.spec.ts` | Playwright E2E | BOTH | P8 restricted-user DOM, edit + reload persistence, +ADD path, forbidden POST for unassigned code. | `npx playwright test dynamic-row-visibility` |
| `playwright/tests/panel-checklist.spec.ts` | Playwright E2E | VISIBILITY | Sidebar + question-block visibility for every panel; admin sees all panels; multi-panel assignment. | `npx playwright test panel-checklist` |
| `playwright/tests/user-question-visibility.spec.ts` | Playwright E2E | VISIBILITY | User-only smoke: dashboard load, empty vs assigned shell, first-panel click (adaptive to DB state). | `npx playwright test user-question-visibility` |

## The two breakers

### Breaker 1 — Data safety

Answers are stored one row per `(org_id, reporting_year, question_code)`; saves must upsert on that key and never drop in-flight edits. Client hooks should flush pending saves on unmount where applicable. If a save fails, the UI should not leave users believing data was stored.

- **`rls-dynamic-rows.test.ts`** — Proves unauthorized **INSERT**/**SELECT** on `answers` fails at Postgres for wrong codes; authorized dynamic-row writes succeed.
- **`dynamic-row-visibility.spec.ts`** — Proves values survive **reload** after edit and after **+ADD**; proves **POST /api/answers** returns **403** when the DB policy blocks the upsert.

### Breaker 2 — Visibility

Restricted users see only assigned question codes. Dynamic rows share the same **prefix** as static block codes for RLS and client filtering. Hiding UI is not enough; **can_access_question()** and matching TS helpers must align.

- **`blockAccessPrefixes.test.ts`** (unit) — `questionCodesShareAssignmentBlock` / `isQuestionCodeAllowedForRestrictedUser` / prefix list parity with migration **011**.
- **`accessPolicy.test.ts`** (unit) — Who may reach the app vs onboarding vs login.
- **`rls-dynamic-rows.test.ts`** (DB) — Row visibility and writeability vs assignments and role tier.
- **`dynamic-row-visibility.spec.ts`** (E2E) — Assigned **p8_e1** visible/editable; **p8_e2** absent from DOM; API forbidden path.
- **`panel-checklist.spec.ts`** (E2E) — Every **panel-*** sidebar entry and **qblock-*** in-panel filtering for admin vs restricted user.
- **`user-question-visibility.spec.ts`** (E2E) — Smoke on real user session: empty state vs restricted banner and panel buttons.

## Running the tests

### Default suite (Vitest unit)

`npm test` runs `vitest run` with **`include`**: `test/**/*.test.ts`, `lib/**/*.test.ts` (`vitest.config.ts`). It does **not** run `supabase/tests/**` (use `test:rls`) or Playwright.

### RLS integration tests

Full project (all files under `supabase/tests/**/*.test.ts` per `vitest.rls.config.ts`):

`SUPABASE_RLS_INTEGRATION=1 npm run test:rls`

Equivalent: `SUPABASE_RLS_INTEGRATION=1 npx vitest run --config vitest.rls.config.ts`

**Required** (from `rls-dynamic-rows.test.ts` `rlsIntegrationEnabled()` plus `.env.local.example` for URL/keys and E2E accounts):

- `SUPABASE_RLS_INTEGRATION=1` (shell; not shown in `.env.local.example`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `E2E_USER_EMAIL`, `E2E_USER_PASSWORD`
- `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`

**Optional** (for `master can SELECT and INSERT any code in any org`): `E2E_MASTER_EMAIL`, `E2E_MASTER_PASSWORD`

Load `.env.local` via the test file’s `dotenv` + run from repo root. If the flag or any required var is missing, the suite is **skipped**.

**When to run:** Before merging changes to **migrations**, **`can_access_question`**, **`question_codes_share_assignment_block`**, or **`blockAccessPrefixes.ts`** / migration **010/011** prefix lists.

### Playwright E2E

**Prerequisites:**

1. Local app reachable at `PLAYWRIGHT_BASE_URL` (default `http://127.0.0.1:3000` in `playwright.config.ts`); config starts `npm run dev` via **webServer** unless reuse is on.
2. Auth storage: `npx playwright test --project=auth-setup`  
   **Regenerate** after credential changes, DB wipe, or new E2E users.

**Run full suite:** `npx playwright test`  
**Run single spec (by path):** `npx playwright test playwright/tests/dynamic-row-visibility.spec.ts`  
**Filter by name substring:** `npx playwright test dynamic-row-visibility` (same pattern for `panel-checklist`, `user-question-visibility`)  
**Headed:** `npx playwright test [spec-name] --headed`  
**Debug:** `npx playwright test [spec-name] --headed --debug`  
**Last HTML report:** `npx playwright show-report`

**Workers:** `workers: 1` and `fullyParallel: false` — E2E specs share server state and some tests use serial describe; a single worker avoids cross-spec flakiness.

### Full pre-PR sequence

1. `npm test` — Vitest unit (always).
2. `SUPABASE_RLS_INTEGRATION=1 npm run test:rls` — if migrations or RLS/prefix access changed.
3. `npx playwright test` — E2E (always before merge if dashboard/access touched).

## Adding a new test

1. Add an **`@testfile`** header as the **first lines** of the file:

```text
/**
 * @testfile
 * Suite:    [short name]
 * Breaker:  [VISIBILITY | DATA SAFETY | BOTH | N/A]
 * Covers:   [business rule in plain English — what would break if
 *            this test did not exist, not the function name]
 * Run:      [exact command to run this file in isolation]
 * Depends:  [seed state / env vars / auth needed, or "none — pure unit"]
 */
```

2. Add a row to the **Test suite index** table in this file.
3. If the test is a **regression guard**, add inside the relevant `describe()`:

```text
// Regression: [what broke] — [date or PR if known]
// Example:
// Regression: add-record produced visible but non-editable inputs
// for restricted users — fixed in migrations 010/011 (prefix-based access)
```

4. If it covers a **new breaker scenario**, add a bullet under **Data safety** or **Visibility** above.

## Known gaps (not yet tested)

- **`useAnswers` hook** — debounced save and flush on unmount: no unit test; risk of lost edits if navigation races the debounce.
- **`lib/exporters/*`** (`brsrDocx`, `brsrXlsx`, `brsrDataMapper`) — no snapshot/fixture tests; risk of silent export regressions.
- **Save failure rollback** — when `POST /api/answers` fails, no test asserts the input reverts to the last saved value; risk of UI/db mismatch.
- **`lib/brsr/calcEngine.ts` / `CALC_RULES`** — no Vitest coverage beyond indirect UI; risk of wrong display-only totals.
- **Next.js middleware / most `app/api/*` routes** — no automated tests; risk of auth or validation drift.
