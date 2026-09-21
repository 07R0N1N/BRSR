# ADR 006: Collaboration RLS hardening

## Context

Migrations 014–016 introduce block-scoped threads, comments, and attachments. The first draft of those policies reused `can_access_question(org_id, question_code)` for thread rows and org-folder checks for Storage. That left three gaps: a restricted user could insert a thread with a mismatched `(block_id, question_code)` and occupy the unique slot (poison insert); Storage allowed any org member to list/download/delete any path under the org folder; and non-admins could set `resolved_at` via PostgREST even though the API restricted resolve to admin/master. Separately, deleting a user cascaded away comment authorship, and deleting attachment metadata left orphaned Storage objects.

## Decision

Harden 014/015 **before first apply** (they were never applied loose):

1. **`brsr_assignment_blocks`** — seed of every `(block_id, panel_id, question_code)` from `lib/brsr/blockIndex.ts`, kept in sync via `scripts/generate-block-map.ts` and `lib/brsr/blockMapSync.test.ts`.
2. **`can_access_block(org, block_id)`** — looks up the representative code and calls `can_access_question`.
3. **Thread insert/update** — `WITH CHECK` requires the triple to match the map; a `BEFORE UPDATE` trigger freezes identity columns and allows only admin/master to change `resolved_at` / `resolved_by`. Notes remain editable by anyone with question access.
4. **Comment updates** — trigger freezes identity columns; only the author may change `body` (admins may soft-delete via `deleted_at`).
5. **Authorship snapshots** — `author_label` / `uploader_label` filled by `SECURITY DEFINER` insert triggers; FKs to `auth.users` are `ON DELETE SET NULL`.
6. **Storage policies** — org folder **and** `can_access_block` on path segment 3; DELETE also requires uploader-or-admin via `question_attachments` join. Compensating remove after a failed metadata insert uses the service-role client.
7. **`attachment_object_gc`** — `AFTER DELETE` on attachments enqueues paths; `npm run purge:attachments` drains (optional `--reconcile` / `--dry-run`).

## Consequences

- Postgres, not the Next.js API, is the trust boundary for block binding, resolve, and Storage access.
- Adding an assignment block requires regenerating the 014 seed (fifth sync surface alongside prefix sync).
- Operators must run `purge:attachments` periodically (or after bulk deletes) so orphaned bytes do not accumulate.
- UI shows `"Name (removed)"` when `author_id` / `uploaded_by` is null but the snapshot label remains.
