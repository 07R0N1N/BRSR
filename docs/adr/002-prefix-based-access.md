# ADR 002: Prefix-based assignment blocks for RLS and UI

## Context

Per-user questionnaire access is stored as discrete `question_code` values in `user_question_assignments`. Row-level security on `answers` uses `can_access_question(org_id, question_code)` so non-admin users may only read/write codes they are assigned.

An earlier approach treated access as **exact code match** (or equivalent strict set membership) between the assigned code and the row being written. That **broke dynamic row questions**: codes such as `p8_e1_row3_link` did not match a single assigned anchor like `p8_e1_name`, even though they belong to the same admin “assignment block” and should be editable together.

The admin UI already groups questions into blocks (General sections, Section B blocks, principle essential/leadership blocks, P6 prefixes, etc.). Restricted users should unlock **all codes under the same block** when any code in that block is assigned.

## Decision

Use **prefix-based matching** (longest-prefix-first) so two codes are in the same block if they share a configured prefix from a single canonical list:

- **TypeScript**: `lib/brsr/blockAccessPrefixes.ts` — `BLOCK_ACCESS_PREFIXES`, `questionCodesShareAssignmentBlock`, `isQuestionCodeAllowedForRestrictedUser`, and related helpers used by hooks and panels.
- **Postgres**: `question_codes_share_assignment_block(assigned_code, target_code)` used inside `can_access_question` so RLS matches the same block boundaries as the app.

Migration **010** introduced prefix alignment in SQL (inline array). Migration **011** replaced the inline array with table `brsr_assignment_block_prefixes` seeded from the same set for maintainability; behavior remains prefix-based.

## Consequences

- **Four-way sync** is mandatory when adding a new assignment block family: TypeScript list, migration 010 historical array (for fresh installs that run in order), migration 011 seed, and the Vitest check that prefix **counts** match. See **`docs/prefix-sync.md`** for the checklist.
- Contributors must not reintroduce **exact-match-only** checks for restricted save paths without an ADR; UI and RLS must stay aligned.
- Dynamic row suffixes (`_rowN_`, etc.) continue to work as long as they share the block prefix with an assigned code.
