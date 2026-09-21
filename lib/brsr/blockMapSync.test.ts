/**
 * @testfile
 * Suite:    brsr_assignment_blocks seed sync with blockIndex
 * Breaker:  VISIBILITY
 * Covers:   Migration 014 INSERT seed for brsr_assignment_blocks must list
 *            every assignment block with the same panel_id and representative
 *            question_code as lib/brsr/blockIndex.ts. Drift breaks can_access_block
 *            and poison-insert prevention.
 * Run:      npx vitest run lib/brsr/blockMapSync.test.ts
 * Depends:  none — pure unit, no DB
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allBlockIds, getBlock, representativeCodeFor } from "./blockIndex";

function parseSeedRows(sql: string): Map<string, { panel_id: string; question_code: string }> {
  const map = new Map<string, { panel_id: string; question_code: string }>();
  // Match ('block_id', 'panel_id', 'question_code') triples in the INSERT VALUES.
  const re = /\(\s*'((?:''|[^'])*)'\s*,\s*'((?:''|[^'])*)'\s*,\s*'((?:''|[^'])*)'\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) {
    const block_id = m[1].replace(/''/g, "'");
    const panel_id = m[2].replace(/''/g, "'");
    const question_code = m[3].replace(/''/g, "'");
    map.set(block_id, { panel_id, question_code });
  }
  return map;
}

describe("brsr_assignment_blocks seed sync with blockIndex", () => {
  const migrationPath = join(
    process.cwd(),
    "supabase/migrations/014_question_collaboration.sql"
  );
  const sql = readFileSync(migrationPath, "utf8");
  const seed = parseSeedRows(sql);

  it("seeds exactly the same block ids as blockIndex", () => {
    const expected = allBlockIds().sort();
    const actual = Array.from(seed.keys()).sort();
    expect(actual).toEqual(expected);
  });

  it("matches panel_id and representative question_code for every block", () => {
    for (const id of allBlockIds()) {
      const block = getBlock(id);
      const code = representativeCodeFor(id);
      expect(block, id).toBeTruthy();
      expect(code, id).toBeTruthy();
      const row = seed.get(id);
      expect(row, `missing seed row for ${id}`).toBeTruthy();
      expect(row!.panel_id).toBe(block!.panelId);
      expect(row!.question_code).toBe(code);
    }
  });
});
