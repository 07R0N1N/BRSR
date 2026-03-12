-- BRSR Phase 2a: answers table for questionnaire (org, reporting_year, question_code, value)
-- Run in Supabase SQL Editor or via Supabase CLI.

CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  reporting_year TEXT NOT NULL,
  question_code TEXT NOT NULL,
  value TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, reporting_year, question_code)
);

CREATE INDEX idx_answers_org_year ON answers(org_id, reporting_year);

ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Users can read/write answers only for their org (non-master: org_id = current_user_org_id(); master: all)
CREATE POLICY "answers_select_own_org" ON answers
  FOR SELECT USING (
    org_id = public.current_user_org_id() OR public.user_role_slug() = 'master'
  );

CREATE POLICY "answers_insert_own_org" ON answers
  FOR INSERT WITH CHECK (
    org_id = public.current_user_org_id() OR public.user_role_slug() = 'master'
  );

CREATE POLICY "answers_update_own_org" ON answers
  FOR UPDATE USING (
    org_id = public.current_user_org_id() OR public.user_role_slug() = 'master'
  );

CREATE POLICY "answers_delete_own_org" ON answers
  FOR DELETE USING (
    org_id = public.current_user_org_id() OR public.user_role_slug() = 'master'
  );
