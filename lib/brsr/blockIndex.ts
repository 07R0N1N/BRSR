import type { PanelId } from "./types";
import type { AssignmentBlock } from "./assignmentBlocks";
import { getAssignmentBlocksForPanel } from "./assignmentBlocks";
import { ALL_QUESTION_CODES } from "./questionCodes";
import { PANELS } from "./panels";

type BlockIndex = {
  blocksById: Map<string, AssignmentBlock & { panelId: PanelId }>;
  blockIdByCode: Map<string, string>;
  blocksByPanel: Map<PanelId, AssignmentBlock[]>;
};

let cached: BlockIndex | null = null;

function buildIndex(): BlockIndex {
  const blocksById = new Map<string, AssignmentBlock & { panelId: PanelId }>();
  const blockIdByCode = new Map<string, string>();
  const blocksByPanel = new Map<PanelId, AssignmentBlock[]>();

  for (const panel of PANELS) {
    const blocks = getAssignmentBlocksForPanel(panel.id);
    blocksByPanel.set(panel.id, blocks);
    for (const block of blocks) {
      if (blocksById.has(block.id)) {
        throw new Error(
          `Duplicate assignment block id "${block.id}" across panels (also on ${blocksById.get(block.id)!.panelId})`
        );
      }
      blocksById.set(block.id, { ...block, panelId: panel.id });
      for (const code of block.questionCodes) {
        const existing = blockIdByCode.get(code);
        if (existing && existing !== block.id) {
          throw new Error(
            `Question code "${code}" appears in multiple blocks: ${existing} and ${block.id}`
          );
        }
        blockIdByCode.set(code, block.id);
      }
    }
  }

  return { blocksById, blockIdByCode, blocksByPanel };
}

function index(): BlockIndex {
  if (!cached) cached = buildIndex();
  return cached;
}

/** All assignment blocks for a panel (same order as getAssignmentBlocksForPanel). */
export function getBlocksForPanel(panelId: PanelId): AssignmentBlock[] {
  return index().blocksByPanel.get(panelId) ?? getAssignmentBlocksForPanel(panelId);
}

/** Lookup a block by its stable assignment-block id. */
export function getBlock(blockId: string): (AssignmentBlock & { panelId: PanelId }) | undefined {
  return index().blocksById.get(blockId);
}

/** Map a question_code to its assignment-block id, if any. */
export function getBlockIdForCode(code: string): string | undefined {
  return index().blockIdByCode.get(code);
}

/**
 * Representative question_code used for RLS on block-scoped rows
 * (threads, notes, attachments). Always the first code in the block.
 *
 * Safe only while a block never mixes codes with different assignment
 * access — enforced by the composite-splitting rule and covered by tests.
 */
export function representativeCodeFor(blockId: string): string | undefined {
  const block = index().blocksById.get(blockId);
  return block?.questionCodes[0];
}

/** Every known block id (across all panels). */
export function allBlockIds(): string[] {
  return Array.from(index().blocksById.keys());
}

/** Test helper — rebuilds the index (e.g. after mocking). */
export function resetBlockIndexCache(): void {
  cached = null;
}

/** Codes in ALL_QUESTION_CODES that are not in any assignment block. */
export function codesMissingFromBlocks(): string[] {
  const { blockIdByCode } = index();
  return ALL_QUESTION_CODES.filter((code) => !blockIdByCode.has(code));
}
