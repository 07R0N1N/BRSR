import { getBlock } from "@/lib/brsr/blockIndex";
import { isQuestionAnswered } from "./AnswersContext";
import type { AnswersState } from "@/lib/brsr/types";

export type SectionProgress = {
  answered: number;
  total: number;
};

export function computeSectionProgress(
  blockIds: string[],
  answers: AnswersState
): SectionProgress {
  let answered = 0;
  let total = 0;

  for (const blockId of blockIds) {
    const block = getBlock(blockId);
    if (!block) continue;
    for (const code of block.questionCodes) {
      total += 1;
      if (isQuestionAnswered(answers[code])) answered += 1;
    }
  }

  return { answered, total };
}
