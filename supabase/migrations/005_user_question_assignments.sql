-- User-specific question assignments and answers access enforcement.
-- Run after 004_brsr_answers.sql.

CREATE TABLE IF NOT EXISTS public.user_question_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id, question_code)
);

CREATE INDEX IF NOT EXISTS idx_user_question_assignments_org_user
  ON public.user_question_assignments(org_id, user_id);

CREATE INDEX IF NOT EXISTS idx_user_question_assignments_org_code
  ON public.user_question_assignments(org_id, question_code);

ALTER TABLE public.user_question_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "uqa_select" ON public.user_question_assignments;
DROP POLICY IF EXISTS "uqa_insert" ON public.user_question_assignments;
DROP POLICY IF EXISTS "uqa_update" ON public.user_question_assignments;
DROP POLICY IF EXISTS "uqa_delete" ON public.user_question_assignments;

CREATE POLICY "uqa_select" ON public.user_question_assignments
  FOR SELECT USING (
    public.current_user_role_slug() = 'master'
    OR (
      public.current_user_role_slug() = 'admin'
      AND org_id = public.current_user_org_id()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "uqa_insert" ON public.user_question_assignments
  FOR INSERT WITH CHECK (
    public.current_user_role_slug() = 'master'
    OR (
      public.current_user_role_slug() = 'admin'
      AND org_id = public.current_user_org_id()
    )
  );

CREATE POLICY "uqa_update" ON public.user_question_assignments
  FOR UPDATE USING (
    public.current_user_role_slug() = 'master'
    OR (
      public.current_user_role_slug() = 'admin'
      AND org_id = public.current_user_org_id()
    )
  );

CREATE POLICY "uqa_delete" ON public.user_question_assignments
  FOR DELETE USING (
    public.current_user_role_slug() = 'master'
    OR (
      public.current_user_role_slug() = 'admin'
      AND org_id = public.current_user_org_id()
    )
  );

CREATE OR REPLACE FUNCTION public.can_access_question(target_org_id UUID, target_question_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  role_slug TEXT;
  current_org UUID;
BEGIN
  role_slug := public.current_user_role_slug();
  current_org := public.current_user_org_id();

  IF role_slug = 'master' THEN
    RETURN TRUE;
  END IF;

  IF current_org IS NULL OR target_org_id IS NULL OR target_org_id <> current_org THEN
    RETURN FALSE;
  END IF;

  IF role_slug = 'admin' THEN
    RETURN TRUE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.user_question_assignments a
    WHERE a.org_id = target_org_id
      AND a.user_id = auth.uid()
      AND a.question_code = target_question_code
  );
END;
$$;

DROP POLICY IF EXISTS "answers_select_own_org" ON public.answers;
DROP POLICY IF EXISTS "answers_insert_own_org" ON public.answers;
DROP POLICY IF EXISTS "answers_update_own_org" ON public.answers;
DROP POLICY IF EXISTS "answers_delete_own_org" ON public.answers;

CREATE POLICY "answers_select_own_org" ON public.answers
  FOR SELECT USING (
    public.can_access_question(org_id, question_code)
  );

CREATE POLICY "answers_insert_own_org" ON public.answers
  FOR INSERT WITH CHECK (
    public.can_access_question(org_id, question_code)
  );

CREATE POLICY "answers_update_own_org" ON public.answers
  FOR UPDATE USING (
    public.can_access_question(org_id, question_code)
  );

CREATE POLICY "answers_delete_own_org" ON public.answers
  FOR DELETE USING (
    public.can_access_question(org_id, question_code)
  );
