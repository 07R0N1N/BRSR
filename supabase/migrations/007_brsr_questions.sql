-- Migration 007: brsr_questions catalogue
-- Additive only — no changes to existing tables, FK constraints, or RLS policies.
-- question_code is sourced from the TypeScript question-code definitions.
-- Seed via: npm run seed:questions

CREATE TABLE public.brsr_questions (
  question_code  TEXT        PRIMARY KEY,
  panel_id       TEXT        NOT NULL,
  section_label  TEXT,
  question_order INTEGER     NOT NULL DEFAULT 0,
  brsr_version   TEXT        NOT NULL DEFAULT 'SEBI-2023',
  is_active      BOOLEAN     NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.brsr_questions ENABLE ROW LEVEL SECURITY;

-- All authenticated users may read the catalogue; writes are service-role only.
CREATE POLICY "brsr_questions_select_authed"
  ON public.brsr_questions FOR SELECT
  USING (auth.role() = 'authenticated');
