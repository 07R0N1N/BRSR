# ADR 004: Attachment storage (two-layer access)

## Context

Thread attachments are real files (PDF, images, spreadsheets). They must be isolated per organization and only discoverable by users who can access the parent assignment block. Using the Supabase service role in app routes would bypass RLS and complicate auditing.

## Decision

Use a **private** Supabase Storage bucket `brsr-attachments` plus a metadata table `question_attachments`.

**Path layout:** `{org_id}/{reporting_year}/{block_id}/{uuid}-{filename}`

**Two layers (hardened in ADR 006):**

1. **Storage (`storage.objects`)** — authenticated users may read/write objects when the first path segment equals `current_user_org_id()::text` **and** `can_access_block(org, path segment 3)` is true (master bypass). DELETE additionally requires an admin/master role or a matching `question_attachments` row where `uploaded_by = auth.uid()`.
2. **Metadata (`question_attachments`)** — rows are gated by joining the parent `question_threads` row and `can_access_question(org_id, question_code)`. API routes only issue signed URLs after a metadata SELECT succeeds under RLS.

Upload flow: validate mime + 10 MB cap → `ensureThreadRow` → storage upload → insert metadata row. If metadata insert fails, compensating remove uses the **service-role** client (no metadata row exists yet for the DELETE join). Delete via API: uploader or admin/master removes storage object then row; the row delete enqueues the path in `attachment_object_gc` for any missed cleanup via `npm run purge:attachments`.

## Consequences

- Org isolation alone is insufficient; block assignment is enforced on Storage as well as metadata.
- Attachment discovery requires both block-scoped storage access **and** a visible metadata row.
- Playwright/RLS tests in `supabase/tests/rls-collaboration.test.ts` verify unassigned-block denial for list/download/delete.
