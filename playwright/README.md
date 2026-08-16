# Playwright E2E tests

End-to-end tests live in `playwright/tests/`. Configuration is in `playwright.config.ts` at the repo root.

## Prerequisites

1. App dependencies installed (`npm install`).
2. `.env.local` with:
   - `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` — admin user in an org with **completed onboarding**
   - `E2E_USER_EMAIL` / `E2E_USER_PASSWORD` — user in the **same** org
   - Optional: `PLAYWRIGHT_BASE_URL` (default `http://127.0.0.1:3000`)

## Commands

- **All E2E tests**: `npm run test:e2e`
- **Panel-by-panel visibility checklist only**: `npm run test:e2e -- --project=panel-checklist`
- **User-context smoke tests only**: `npm run test:e2e -- --project=user-visibility`
- **Dynamic row / P8 regression only**: `npm run test:e2e -- --project=dynamic-rows`
- **UI mode**: `npm run test:e2e:ui`

The config starts `npm run dev` automatically unless a server is already running (`reuseExistingServer` when not in CI).

## Projects

| Project           | Purpose |
|-------------------|--------|
| `auth-setup`      | Runs `global-setup.ts`; writes `playwright/.auth/admin.json` and `user.json` (gitignored). |
| `panel-checklist` | Admin assigns via API; user verifies panels (depends on `auth-setup`). |
| `admin`           | Matches `admin-*.spec.ts` (`admin-unassigned-blocks.spec.ts`, `admin-manage-users.spec.ts`). Factory-isolated (no saved admin storageState). |
| `user-visibility` | Matches `user-*.spec.ts`; uses saved user storage state. |
| `dynamic-rows`    | `dynamic-row-visibility.spec.ts` — restricted user + Principle 8 multi-row saves. |

## Auth artifacts

Do not commit `playwright/.auth/*.json`. They are produced by `global-setup.ts` and listed in `.gitignore`.

For full env and script list, see **CONTEXT.md** §9 and §10.
