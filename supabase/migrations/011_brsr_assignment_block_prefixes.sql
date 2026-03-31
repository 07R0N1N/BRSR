-- Reference table for assignment-block prefixes (same set as lib/brsr/blockAccessPrefixes.ts).
-- Replaces inline ARRAY in question_codes_share_assignment_block for maintainability and planner-friendly lookups.

CREATE TABLE IF NOT EXISTS public.brsr_assignment_block_prefixes (
  prefix TEXT PRIMARY KEY
);

COMMENT ON TABLE public.brsr_assignment_block_prefixes IS
  'BRSR question_code block prefixes; keep rows in sync with lib/brsr/blockAccessPrefixes.ts BLOCK_ACCESS_PREFIXES.';

-- Seed: must match BLOCK_ACCESS_PREFIXES (see migration 010 ARRAY for ordering of literals).
INSERT INTO public.brsr_assignment_block_prefixes (prefix)
SELECT unnest(
  ARRAY[
    'gen_19b_', 'gen_19c_', 'gen_20a_', 'gen_20b_', 'p3_e1a_', 'p3_e1b_', 'p3_e1c_', 'p3_e10_', 'p3_e11_', 'p3_e12_', 'p3_e13_', 'p3_e14_', 'p3_e15_', 'p5_e3a_', 'p5_e3b_', 'p5_e10_', 'p5_e11_', 'p7_e1a_', 'p7_e1b_', 'gen_10_', 'gen_11_', 'gen_12_', 'gen_13_', 'gen_14_', 'gen_15_', 'gen_16_', 'gen_17_', 'gen_18_', 'gen_19_', 'gen_21_', 'gen_22_', 'gen_23_', 'gen_24_', 'gen_25_', 'gen_26_', 'sb_10a_', 'sb_10b_', 'p6_e11_', 'p6_e12_', 'p6_e13_', 'p1_e1_', 'p1_e2_', 'p1_e3_', 'p1_e4_', 'p1_e5_', 'p1_e6_', 'p1_e7_', 'p1_e8_', 'p1_e9_', 'p1_l1_', 'p1_l2_', 'p2_e1_', 'p2_e2_', 'p2_e3_', 'p2_e4_', 'p2_l1_', 'p2_l2_', 'p2_l3_', 'p2_l4_', 'p2_l5_', 'p3_e2_', 'p3_e3_', 'p3_e4_', 'p3_e5_', 'p3_e6_', 'p3_e7_', 'p3_e8_', 'p3_e9_', 'p3_l1_', 'p3_l2_', 'p3_l3_', 'p3_l4_', 'p3_l5_', 'p3_l6_', 'p4_e1_', 'p4_e2_', 'p4_l1_', 'p4_l2_', 'p4_l3_', 'p5_e1_', 'p5_e2_', 'p5_e4_', 'p5_e5_', 'p5_e6_', 'p5_e7_', 'p5_e8_', 'p5_e9_', 'p5_l1_', 'p5_l2_', 'p5_l3_', 'p5_l4_', 'p5_l5_', 'p7_e2_', 'p7_l1_', 'p8_e1_', 'p8_e2_', 'p8_e3_', 'p8_e4_', 'p8_e5_', 'p8_l1_', 'p8_l2_', 'p8_l3_', 'p8_l4_', 'p8_l5_', 'p8_l6_', 'p9_e1_', 'p9_e2_', 'p9_e3_', 'p9_e4_', 'p9_e5_', 'p9_e6_', 'p9_l1_', 'p9_l2_', 'p9_l3_', 'p9_l4_', 'gen_1_', 'gen_2_', 'gen_3_', 'gen_4_', 'gen_5_', 'gen_6_', 'gen_7_', 'gen_8_', 'gen_9_', 'sb_11_', 'sb_1a_', 'sb_1b_', 'sb_1c_', 'p6_e1_', 'p6_e2_', 'p6_e3_', 'p6_e4_', 'p6_e5_', 'p6_e6_', 'p6_e7_', 'p6_e8_', 'p6_e9_', 'p6_e10', 'p6_l1_', 'p6_l2_', 'p6_l3_', 'p6_l4_', 'p6_l5_', 'p6_l6_', 'p6_l7_', 'p6_l8_', 'gdata_', 'p9_e7', 'sb_2_', 'sb_3_', 'sb_4_', 'sb_5_', 'sb_6_', 'sb_7_', 'sb_8_', 'sb_9_'
  ]::text[]
)
ON CONFLICT (prefix) DO NOTHING;

ALTER TABLE public.brsr_assignment_block_prefixes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "brsr_assignment_block_prefixes_select_authed"
  ON public.brsr_assignment_block_prefixes;

CREATE POLICY "brsr_assignment_block_prefixes_select_authed"
  ON public.brsr_assignment_block_prefixes
  FOR SELECT
  TO authenticated
  USING (true);

GRANT SELECT ON public.brsr_assignment_block_prefixes TO authenticated;

CREATE OR REPLACE FUNCTION public.question_codes_share_assignment_block(assigned_code TEXT, target_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT assigned_code = target_code OR EXISTS (
    SELECT 1
    FROM public.brsr_assignment_block_prefixes p
    WHERE starts_with(target_code, p.prefix) AND starts_with(assigned_code, p.prefix)
  );
$$;
