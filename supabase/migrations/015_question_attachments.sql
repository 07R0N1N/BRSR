-- Phase 3: block-scoped file attachments on question threads.
-- Hardened before first apply: storage RLS gates by can_access_block on path
-- segment 3 (block_id); DELETE requires uploader or admin/master via metadata
-- join; orphaned bytes are queued in attachment_object_gc for purge script.
--
-- Metadata lives in question_attachments; bytes live in private storage bucket
-- brsr-attachments. Path convention:
--   {org_id}/{reporting_year}/{block_id}/{uuid}-{safeFileName}
-- RLS on rows joins the parent thread (same pattern as question_comments).

CREATE TABLE IF NOT EXISTS public.question_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.question_threads(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  question_code TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  uploader_label TEXT NOT NULL DEFAULT 'Unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_question_attachments_thread
  ON public.question_attachments(thread_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_question_attachments_storage_path
  ON public.question_attachments(storage_path);

COMMENT ON COLUMN public.question_attachments.question_code IS
  'Representative code for RLS via can_access_question; denormalized from parent thread.';

COMMENT ON COLUMN public.question_attachments.uploader_label IS
  'Snapshot of display_name/email at insert time; survives auth.users deletion.';

ALTER TABLE public.question_attachments ENABLE ROW LEVEL SECURITY;

-- Snapshot uploader_label from profiles at insert.
CREATE OR REPLACE FUNCTION public.question_attachments_set_uploader_label()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  label TEXT;
BEGIN
  IF NEW.uploaded_by IS NULL THEN
    NEW.uploader_label := COALESCE(NULLIF(trim(NEW.uploader_label), ''), 'Unknown');
    RETURN NEW;
  END IF;

  SELECT COALESCE(
    NULLIF(trim(p.display_name), ''),
    NULLIF(trim(p.email), ''),
    NEW.uploaded_by::text
  )
  INTO label
  FROM public.profiles p
  WHERE p.id = NEW.uploaded_by;

  NEW.uploader_label := COALESCE(label, NEW.uploaded_by::text, 'Unknown');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_question_attachments_set_uploader_label
  ON public.question_attachments;
CREATE TRIGGER trg_question_attachments_set_uploader_label
  BEFORE INSERT ON public.question_attachments
  FOR EACH ROW
  EXECUTE PROCEDURE public.question_attachments_set_uploader_label();

-- ── GC queue for orphaned storage objects ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.attachment_object_gc (
  storage_path TEXT PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  queued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  purged_at TIMESTAMPTZ
);

COMMENT ON TABLE public.attachment_object_gc IS
  'Paths queued when question_attachments rows are deleted; drained by scripts/purge-attachment-objects.ts. Service-role only.';

ALTER TABLE public.attachment_object_gc ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (bypasses RLS) can read/write.

CREATE OR REPLACE FUNCTION public.question_attachments_enqueue_gc()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.attachment_object_gc (storage_path, org_id)
  VALUES (OLD.storage_path, OLD.org_id)
  ON CONFLICT (storage_path) DO UPDATE SET
    queued_at = now(),
    purged_at = NULL;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_question_attachments_enqueue_gc ON public.question_attachments;
CREATE TRIGGER trg_question_attachments_enqueue_gc
  AFTER DELETE ON public.question_attachments
  FOR EACH ROW
  EXECUTE PROCEDURE public.question_attachments_enqueue_gc();

-- ── RLS: question_attachments ────────────────────────────────────────────────

DROP POLICY IF EXISTS "question_attachments_select" ON public.question_attachments;
DROP POLICY IF EXISTS "question_attachments_insert" ON public.question_attachments;
DROP POLICY IF EXISTS "question_attachments_delete" ON public.question_attachments;

CREATE POLICY "question_attachments_select"
  ON public.question_attachments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.question_threads t
      WHERE t.id = thread_id
        AND public.can_access_question(t.org_id, t.question_code)
    )
  );

CREATE POLICY "question_attachments_insert"
  ON public.question_attachments
  FOR INSERT
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.question_threads t
      WHERE t.id = thread_id
        AND t.org_id = org_id
        AND public.can_access_question(t.org_id, t.question_code)
    )
  );

CREATE POLICY "question_attachments_delete"
  ON public.question_attachments
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.question_threads t
      WHERE t.id = thread_id
        AND public.can_access_question(t.org_id, t.question_code)
    )
    AND (
      uploaded_by = auth.uid()
      OR public.current_user_role_slug() IN ('admin', 'master')
    )
  );

-- Private storage bucket (10 MB, mime allowlist enforced in API as well)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brsr-attachments',
  'brsr-attachments',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
) ON CONFLICT (id) DO NOTHING;

-- storage.objects policies ---------------------------------------------------
-- Path: {org_id}/{reporting_year}/{block_id}/{file}
-- foldername[1] = org, [3] = block_id → can_access_block

DROP POLICY IF EXISTS "brsr_attachments_select" ON storage.objects;
DROP POLICY IF EXISTS "brsr_attachments_insert" ON storage.objects;
DROP POLICY IF EXISTS "brsr_attachments_delete" ON storage.objects;

CREATE POLICY "brsr_attachments_select"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'brsr-attachments'
    AND (
      public.current_user_role_slug() = 'master'
      OR (
        public.current_user_org_id() IS NOT NULL
        AND (storage.foldername(name))[1] = public.current_user_org_id()::text
        AND public.can_access_block(
          public.current_user_org_id(),
          (storage.foldername(name))[3]
        )
      )
    )
  );

CREATE POLICY "brsr_attachments_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'brsr-attachments'
    AND (
      public.current_user_role_slug() = 'master'
      OR (
        public.current_user_org_id() IS NOT NULL
        AND (storage.foldername(name))[1] = public.current_user_org_id()::text
        AND public.can_access_block(
          public.current_user_org_id(),
          (storage.foldername(name))[3]
        )
      )
    )
  );

-- DELETE: block access + (uploader of matching metadata row OR admin/master).
-- Compensating remove after failed metadata insert must use service role
-- (see app/api/attachments/route.ts) because no metadata row exists yet.
CREATE POLICY "brsr_attachments_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'brsr-attachments'
    AND (
      public.current_user_role_slug() = 'master'
      OR (
        public.current_user_org_id() IS NOT NULL
        AND (storage.foldername(name))[1] = public.current_user_org_id()::text
        AND public.can_access_block(
          public.current_user_org_id(),
          (storage.foldername(name))[3]
        )
        AND (
          public.current_user_role_slug() = 'admin'
          OR EXISTS (
            SELECT 1
            FROM public.question_attachments a
            WHERE a.storage_path = name
              AND a.uploaded_by = auth.uid()
          )
        )
      )
    )
  );
