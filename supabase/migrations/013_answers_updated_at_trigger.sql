-- Keep answers.updated_at current on every UPDATE/UPSERT.
-- Without this, DEFAULT now() only applies on INSERT, so authorship timestamps
-- freeze at first write. Mirrors profiles_updated_at from 001_initial_schema.

CREATE OR REPLACE FUNCTION public.answers_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS answers_set_updated_at ON public.answers;

CREATE TRIGGER answers_set_updated_at
  BEFORE UPDATE ON public.answers
  FOR EACH ROW
  EXECUTE PROCEDURE public.answers_set_updated_at();
