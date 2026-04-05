# Prefix sync contract

Assignment-block access uses **one canonical ordered list of prefixes** (longest-prefix-first) in the app and in Postgres. If this list drifts, restricted users may be blocked in the UI while RLS allows writes (or the opposite).

## The four places to keep in sync

When you add or rename an assignment block that should unlock dynamic row codes together:

1. **`lib/brsr/blockAccessPrefixes.ts`**  
   - `BLOCK_ACCESS_PREFIXES` is built from `principleBlocksConfig`, `assignmentBlocks` labels, and fixed entries (e.g. `gdata_`).  
   - This is the **source of truth for TypeScript** and drives `questionCodesShareAssignmentBlock` / `isQuestionCodeAllowedForRestrictedUser`.

2. **`supabase/migrations/010_can_access_question_dynamic_rows.sql`**  
   - Contains the **inline `ARRAY[...]`** inside `question_codes_share_assignment_block` as it existed before migration 011.  
   - Fresh databases run migrations in order; keep this array aligned with `BLOCK_ACCESS_PREFIXES` for historical consistency and for installs that replay from scratch.

3. **`supabase/migrations/011_brsr_assignment_block_prefixes.sql`**  
   - **Seed** into `brsr_assignment_block_prefixes` must list the **same prefixes** as `BLOCK_ACCESS_PREFIXES` (same count and same strings).  
   - The live function body reads from this table.

4. **`lib/brsr/blockAccessPrefixes.test.ts`**  
   - Test **“BLOCK_ACCESS_PREFIXES sync with migration 011 seed”** asserts the number of string literals in the 011 `ARRAY[...]` matches `BLOCK_ACCESS_PREFIXES.length`.  
   - After edits, run `npm run test` and fix any mismatch.

## Checklist (new block)

- [ ] Add or adjust labels/prefixes in `assignmentBlocks.ts` / `principleBlocksConfig.ts` as needed so `blockAccessPrefixes.ts` builds the right entries.
- [ ] Run unit tests locally; update **010** array and **011** seed to match `BLOCK_ACCESS_PREFIXES`.
- [ ] Update **CONTEXT.md** §4 if schema or RLS behavior changed.
- [ ] If the change is non-obvious, reference **ADR** `docs/adr/002-prefix-based-access.md`.

## Related

- `docs/adr/002-prefix-based-access.md` — why prefix matching exists (exact-match broke dynamic rows).
- `CONTEXT.md` §4 — `can_access_question` and `brsr_assignment_block_prefixes`.
