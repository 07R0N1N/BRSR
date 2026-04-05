import { GENERAL_LABELS, P6_PREFIX_LABELS, SECTION_B_LABELS } from "./assignmentBlocks";
import { getAllMigratedPrincipleAssignmentPrefixes } from "./principleBlocksConfig";

function buildGeneralSectionPrefixes(): string[] {
  return Object.keys(GENERAL_LABELS).map((k) => `gen_${k}_`);
}

function buildSectionBPrefixes(): string[] {
  return Object.keys(SECTION_B_LABELS).map((k) => `sb_${k}_`);
}

function buildP6Prefixes(): string[] {
  const out: string[] = [];
  for (const k of Object.keys(P6_PREFIX_LABELS)) {
    if (k === "p6_e10") {
      out.push("p6_e10");
    } else {
      out.push(`${k}_`);
    }
  }
  return out;
}

function dedupeLongestFirst(prefixes: string[]): string[] {
  const seen = new Set<string>();
  const sorted = [...prefixes].sort((a, b) => b.length - a.length);
  const out: string[] = [];
  for (const p of sorted) {
    if (!seen.has(p)) {
      seen.add(p);
      out.push(p);
    }
  }
  return out;
}

function buildBlockAccessPrefixes(): string[] {
  return dedupeLongestFirst([
    ...getAllMigratedPrincipleAssignmentPrefixes(),
    ...buildGeneralSectionPrefixes(),
    ...buildSectionBPrefixes(),
    ...buildP6Prefixes(),
    "gdata_",
  ]);
}

/**
 * @doc PREFIX SYNC CONTRACT
 *
 * This file is one of four places that must encode identical prefix lists.
 * A mismatch causes restricted users to silently lose write access to
 * dynamic row codes (e.g. p8_e1_row2_name) even when the base code is assigned.
 *
 * The four locations — all must be updated together:
 *   1. BLOCK_ACCESS_PREFIXES constant in this file (client-side check)
 *   2. Inline array in supabase/migrations/010_can_access_question_dynamic_rows.sql
 *   3. Seed rows in supabase/migrations/011_brsr_assignment_block_prefixes.sql
 *   4. Prefix count assertion in lib/brsr/blockAccessPrefixes.test.ts
 *
 * Before adding a new prefix: read docs/prefix-sync.md for the full checklist.
 * The test enforces count parity — a mismatch will fail CI.
 */

/** Ordered longest-first for correct prefix matching (e.g. p7_e1b_ before p7_e1_). */
export const BLOCK_ACCESS_PREFIXES: readonly string[] = buildBlockAccessPrefixes();

/**
 * Which assignment-block prefixes are covered by the user’s assigned question codes.
 * Compute once when `allowedSet` changes; use with `isQuestionCodeAllowedForRestrictedUser` (third arg).
 */
export function computeAllowedBlockPrefixes(allowedSet: Set<string>): Set<string> {
  const unlocked = new Set<string>();
  for (const code of Array.from(allowedSet)) {
    for (const p of BLOCK_ACCESS_PREFIXES) {
      if (code.startsWith(p)) {
        unlocked.add(p);
        break;
      }
    }
  }
  return unlocked;
}

/**
 * True when two question codes belong to the same admin assignment block (including dynamic row variants).
 */
export function questionCodesShareAssignmentBlock(a: string, b: string): boolean {
  if (a === b) return true;
  for (const p of BLOCK_ACCESS_PREFIXES) {
    if (a.startsWith(p) && b.startsWith(p)) return true;
  }
  return false;
}

/**
 * Restricted users: allow edits when the code is listed or matches a block already represented in allowedSet.
 *
 * Pass `allowedBlockPrefixes` from `computeAllowedBlockPrefixes(allowedSet)` for O(|prefixes|) checks per
 * keystroke. If omitted, falls back to comparing every assigned code (legacy, O(|allowedSet| × |prefixes|)).
 */
export function isQuestionCodeAllowedForRestrictedUser(
  code: string,
  allowedSet: Set<string> | null,
  allowedBlockPrefixes?: Set<string>
): boolean {
  if (!allowedSet) return true;
  if (allowedSet.has(code)) return true;

  if (allowedBlockPrefixes !== undefined) {
    for (const p of BLOCK_ACCESS_PREFIXES) {
      if (code.startsWith(p) && allowedBlockPrefixes.has(p)) return true;
    }
    return false;
  }

  for (const assigned of Array.from(allowedSet)) {
    if (questionCodesShareAssignmentBlock(assigned, code)) return true;
  }
  return false;
}
