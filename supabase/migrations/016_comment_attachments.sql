-- Phase 4: attach files to individual comments (nullable — block-level rows remain valid).

ALTER TABLE public.question_attachments
  ADD COLUMN IF NOT EXISTS comment_id UUID
    REFERENCES public.question_comments(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_question_attachments_comment
  ON public.question_attachments(comment_id);

COMMENT ON COLUMN public.question_attachments.comment_id IS
  'When set, attachment is shown on that comment; NULL = legacy block-level upload.';
