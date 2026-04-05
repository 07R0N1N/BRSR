-- Align RLS with prefix-based assignment blocks so restricted users can save dynamic row
-- question_codes (e.g. p8_e1_row1_name). Keep ARRAY in sync with lib/brsr/blockAccessPrefixes.ts (BLOCK_ACCESS_PREFIXES).
-- Migration 011 moves this list into table brsr_assignment_block_prefixes and replaces the function body; behavior stays the same.

CREATE OR REPLACE FUNCTION public.question_codes_share_assignment_block(assigned_code TEXT, target_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT assigned_code = target_code OR EXISTS (
    SELECT 1
    FROM unnest(
      ARRAY[
        'gen_19b_', 'gen_19c_', 'gen_20a_', 'gen_20b_', 'p3_e1a_', 'p3_e1b_', 'p3_e1c_', 'p3_e10_', 'p3_e11_', 'p3_e12_', 'p3_e13_', 'p3_e14_', 'p3_e15_', 'p5_e3a_', 'p5_e3b_', 'p5_e10_', 'p5_e11_', 'p7_e1a_', 'p7_e1b_', 'gen_10_', 'gen_11_', 'gen_12_', 'gen_13_', 'gen_14_', 'gen_15_', 'gen_16_', 'gen_17_', 'gen_18_', 'gen_19_', 'gen_21_', 'gen_22_', 'gen_23_', 'gen_24_', 'gen_25_', 'gen_26_', 'sb_10a_', 'sb_10b_', 'p6_e11_', 'p6_e12_', 'p6_e13_', 'p1_e1_', 'p1_e2_', 'p1_e3_', 'p1_e4_', 'p1_e5_', 'p1_e6_', 'p1_e7_', 'p1_e8_', 'p1_e9_', 'p1_l1_', 'p1_l2_', 'p2_e1_', 'p2_e2_', 'p2_e3_', 'p2_e4_', 'p2_l1_', 'p2_l2_', 'p2_l3_', 'p2_l4_', 'p2_l5_', 'p3_e2_', 'p3_e3_', 'p3_e4_', 'p3_e5_', 'p3_e6_', 'p3_e7_', 'p3_e8_', 'p3_e9_', 'p3_l1_', 'p3_l2_', 'p3_l3_', 'p3_l4_', 'p3_l5_', 'p3_l6_', 'p4_e1_', 'p4_e2_', 'p4_l1_', 'p4_l2_', 'p4_l3_', 'p5_e1_', 'p5_e2_', 'p5_e4_', 'p5_e5_', 'p5_e6_', 'p5_e7_', 'p5_e8_', 'p5_e9_', 'p5_l1_', 'p5_l2_', 'p5_l3_', 'p5_l4_', 'p5_l5_', 'p7_e2_', 'p7_l1_', 'p8_e1_', 'p8_e2_', 'p8_e3_', 'p8_e4_', 'p8_e5_', 'p8_l1_', 'p8_l2_', 'p8_l3_', 'p8_l4_', 'p8_l5_', 'p8_l6_', 'p9_e1_', 'p9_e2_', 'p9_e3_', 'p9_e4_', 'p9_e5_', 'p9_e6_', 'p9_l1_', 'p9_l2_', 'p9_l3_', 'p9_l4_', 'gen_1_', 'gen_2_', 'gen_3_', 'gen_4_', 'gen_5_', 'gen_6_', 'gen_7_', 'gen_8_', 'gen_9_', 'sb_11_', 'sb_1a_', 'sb_1b_', 'sb_1c_', 'p6_e1_', 'p6_e2_', 'p6_e3_', 'p6_e4_', 'p6_e5_', 'p6_e6_', 'p6_e7_', 'p6_e8_', 'p6_e9_', 'p6_e10', 'p6_l1_', 'p6_l2_', 'p6_l3_', 'p6_l4_', 'p6_l5_', 'p6_l6_', 'p6_l7_', 'p6_l8_', 'gdata_', 'p9_e7', 'sb_2_', 'sb_3_', 'sb_4_', 'sb_5_', 'sb_6_', 'sb_7_', 'sb_8_', 'sb_9_'
      ]::text[]
    ) AS t(prefix)
    WHERE starts_with(target_code, t.prefix) AND starts_with(assigned_code, t.prefix)
  );
$$;

-- @doc ACCESS TIERS
-- This function implements a 3-tier access model for answer rows:
--
--   Master  → always true (full access across all orgs)
--   Admin   → true if the answer's org_id matches the admin's org
--   User    → true only if the question_code (or a code sharing an
--             assignment block prefix) is in their user_question_assignments
--
-- "Sharing a prefix" is delegated to question_codes_share_assignment_block(),
-- which reads from brsr_assignment_block_prefixes (added in migration 011).
-- This handles dynamic row codes (e.g. p8_e1_row2_name) that differ from
-- the assigned base code (p8_e1_name) but belong to the same block.
--
-- If you change access logic here, also update:
--   lib/brsr/blockAccessPrefixes.ts (client-side mirror)
--   docs/adr/002-prefix-based-access.md (decision record)

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
      AND (
        a.question_code = target_question_code
        OR public.question_codes_share_assignment_block(a.question_code, target_question_code)
      )
  );
END;
$$;
