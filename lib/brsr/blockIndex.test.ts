/**
 * @testfile
 * Suite:    Assignment-block index
 * Breaker:  COLLABORATION_ANCHOR
 * Covers:   Every ALL_QUESTION_CODES entry maps to exactly one block id;
 *            block ids are unique across panels; representativeCodeFor is
 *            always the first code in the block (RLS shortcut invariant).
 * Run:      npx vitest run lib/brsr/blockIndex.test.ts
 * Depends:  none — pure unit
 */

import { describe, expect, it } from "vitest";
import { ALL_QUESTION_CODES } from "./questionCodes";
import { PANELS } from "./panels";
import { getAssignmentBlocksForPanel } from "./assignmentBlocks";
import {
  allBlockIds,
  codesMissingFromBlocks,
  getBlock,
  getBlockIdForCode,
  getBlocksForPanel,
  representativeCodeFor,
  resetBlockIndexCache,
} from "./blockIndex";

describe("blockIndex", () => {
  it("covers every code in ALL_QUESTION_CODES", () => {
    resetBlockIndexCache();
    const missing = codesMissingFromBlocks();
    expect(missing).toEqual([]);
  });

  it("block ids are unique across all panels", () => {
    resetBlockIndexCache();
    const seen = new Set<string>();
    for (const panel of PANELS) {
      for (const block of getAssignmentBlocksForPanel(panel.id)) {
        expect(seen.has(block.id), `duplicate block id ${block.id}`).toBe(false);
        seen.add(block.id);
      }
    }
    expect(allBlockIds().length).toBe(seen.size);
  });

  it("getBlockIdForCode round-trips through getBlock", () => {
    resetBlockIndexCache();
    for (const code of ALL_QUESTION_CODES.slice(0, 50)) {
      const blockId = getBlockIdForCode(code);
      expect(blockId, `no block for ${code}`).toBeTruthy();
      const block = getBlock(blockId!);
      expect(block?.questionCodes).toContain(code);
    }
  });

  it("representativeCodeFor is the first question code in the block", () => {
    resetBlockIndexCache();
    for (const blockId of allBlockIds()) {
      const block = getBlock(blockId)!;
      expect(representativeCodeFor(blockId)).toBe(block.questionCodes[0]);
    }
  });

  it("getBlocksForPanel matches getAssignmentBlocksForPanel", () => {
    resetBlockIndexCache();
    for (const panel of PANELS) {
      expect(getBlocksForPanel(panel.id).map((b) => b.id)).toEqual(
        getAssignmentBlocksForPanel(panel.id).map((b) => b.id)
      );
    }
  });
});
