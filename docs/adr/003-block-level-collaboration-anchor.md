# ADR 003: Block-level collaboration anchor

## Context

The dashboard collaboration layer (comments, internal notes, attachments, authorship) needs a stable key that aligns with how admins assign work and how users perceive the questionnaire. Individual `question_code` values (~2,098) are too granular for UI and would multiply storage rows. Assignment blocks (~166) already exist in `getAssignmentBlocksForPanel()` and match Admin Workspace assignment UX.

## Decision

Anchor all collaboration features to **assignment block id** (`general_20a`, `p6_e4`, …), not raw `question_code`.

- UI: `QuestionBlock` wraps each block; heavy UI lives in one `ActivityDrawer`.
- API/server: resolves `panel_id` and representative `question_code` from `lib/brsr/blockIndex.ts` — never trusts the client.
- RLS: each thread/attachment row stores the block’s **first** `question_code`; policies call `can_access_question(org_id, question_code)`.

## Consequences

- Panel JSX must wrap at block boundaries (`QuestionBlock`), but table markup inside blocks stays unchanged.
- The representative-code RLS shortcut is safe only while blocks never mix codes with different assignment access (composite-splitting discipline + tests in `blockIndex.test.ts`).
- Future schema-versioning work on panels is less risky: block ids are stable even when inner codes change, as long as block boundaries stay aligned with assignment config.
