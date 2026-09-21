# ADR 005: Panel primitives layer

## Context

Dashboard questionnaire panels (`PanelGeneral`, `PanelSectionB`, `PanelPrinciple1-9`, etc.) duplicated layout markup: inconsistent heading levels (`h1` → `h3` with no `h2`), legacy Tailwind gray classes patched by `.app-panels` overrides, ad-hoc table scroll wrappers, and per-field `QuestionBlock` cards that made Section A visually dense.

The collaboration UI (`ActivityDrawer`) packed inbox, notes, attachments, field history, and comments into a 380px drawer — too much for per-question context.

## Decision

1. Introduce shared panel primitives under `components/panel/`:
   - `PanelHeader` — unified panel title + subtitle
   - `PanelSection` — collapsible `h2` sections with `n of m answered` progress via block registration context
   - `FieldGrid` / `Field` — labelled inputs without one-input-per-card density
   - `DataTable` — sticky first column, shared borders, numeric alignment
   - `AnswersProvider` — answers context for section progress without per-section code lists

2. Move internal team notes onto the question card (`InlineBlockNote`), lazy-loaded from the existing thread note API. Keep BRSR export notes (`p{n}_notes`) separate.

3. Replace `ActivityDrawer` with `ChatPanel` — comments only, attachments inline in the composer (via nullable `comment_id` on `question_attachments`, migration 016).

4. Contributor inbox becomes a full-page route (`/dashboard/inbox`) reusing `GET /api/threads` summaries, Admin-Workspace-style layout.

5. Retire dead `.app-qblocks > [data-testid^="qblock-"]` CSS (DOM mismatch after `QuestionBlock` wrapper div). Block spacing moves to `.question-block + .question-block`.

## Consequences

- Panel files gain imports from `components/panel/`; Roman sections use `PanelSection` with `label` + `title`.
- `.app-panels` legacy Tailwind bridge remains until all panels migrate to token-based primitives; new uncovered classes (`text-gray-400`, `border-slate-600`, etc.) are tokenized in `globals.css`.
- `QuestionBlock` registers with nearest `PanelSection` for progress; requires `AnswersProvider` in `QuestionnaireShell`.
- Attachment uploads can be comment-scoped; block-level uploads (no `comment_id`) remain valid for backward compatibility.
- Design review mock: `Archive 1/workflow-mockup/panel-restructure-mock.html`.
