import type { AnswersState } from "@/lib/brsr/types";

/** Build POST body for /api/answers — only codes in the dirty set. */
export function buildDirtyAnswersPayload(
  dirty: Set<string>,
  answers: AnswersState
): Record<string, string | null> {
  const payload: Record<string, string | null> = {};
  for (const code of Array.from(dirty)) {
    payload[code] = answers[code] ?? null;
  }
  return payload;
}
