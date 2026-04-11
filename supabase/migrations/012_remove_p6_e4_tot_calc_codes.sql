-- Removes p6_e4_tot_cy and p6_e4_tot_py from the question registry.
-- These are calc-only outputs (sum of 10 discharge sub-components).
-- They were incorrectly registered as input codes. No user-entered
-- data exists for them — the panel renders them via calcDisplay only
-- and the export mapper reads from runCalculations output, not answers.
-- See docs/brsr-platform-comparison.md and git blame for context.

-- Remove stale answer rows saved under these calc codes
-- (safe: these codes were never user-entered, only calc outputs)
DELETE FROM answers
WHERE question_code IN ('p6_e4_tot_cy', 'p6_e4_tot_py');

-- Remove from brsr_questions if present
DELETE FROM brsr_questions
WHERE question_code IN ('p6_e4_tot_cy', 'p6_e4_tot_py');
