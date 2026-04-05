## Summary

<!-- What changed and why (1–3 sentences). -->

## Checklist

### If this PR touches answer save/load logic:

- [ ] useAnswers cleanup flushes pending save on unmount
- [ ] All upserts include org_id + reporting_year + question_code in conflict target

### If this PR touches visibility or assignments:

- [ ] Vitest: `isQuestionCodeAllowedForRestrictedUser` covers the changed prefix (`lib/brsr/blockAccessPrefixes.test.ts`)
- [ ] Playwright: `dynamic-row-visibility.spec.ts` passes locally (`npm run test:e2e -- --project=dynamic-rows`)
- [ ] RLS: tested with a restricted user token against local Supabase (`SUPABASE_RLS_INTEGRATION=1 npm run test:rls`)

### If this PR adds a new multi-record question block:

- [ ] New prefix added to all four sync locations (see `docs/prefix-sync.md`)
- [ ] Test 3 in `dynamic-row-visibility.spec.ts` extended for the new block (or equivalent regression)
- [ ] `docs/question-structure.md` updated with the new block

### Always:

- [ ] `CONTEXT.md` updated if any file, route, or table was added
- [ ] `npm test` passes (Vitest unit suite; RLS suite optional via `npm run test:rls`)
