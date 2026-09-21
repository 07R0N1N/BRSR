import type { SupabaseClient } from "@supabase/supabase-js";
import { getBlock, representativeCodeFor } from "@/lib/brsr/blockIndex";

export type ThreadRow = {
  id: string;
  org_id: string;
  reporting_year: string;
  block_id: string;
  panel_id: string;
  question_code: string;
  note_body: string | null;
  note_updated_by: string | null;
  note_updated_at: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
};

export type EnsureThreadParams = {
  orgId: string;
  reportingYear: string;
  blockId: string;
};

/**
 * Resolve block metadata for APIs. Never trust client-supplied panel_id / question_code.
 * Returns null when blockId is unknown.
 */
export function resolveBlockMeta(blockId: string): {
  panelId: string;
  questionCode: string;
} | null {
  const block = getBlock(blockId);
  const questionCode = representativeCodeFor(blockId);
  if (!block || !questionCode) return null;
  return { panelId: block.panelId, questionCode };
}

/**
 * Ensure a question_threads row exists for (org, year, block).
 * panel_id and question_code come from the block index, not the client.
 */
export async function ensureThreadRow(
  supabase: SupabaseClient,
  params: EnsureThreadParams
): Promise<{ data: ThreadRow | null; error: string | null; notFound?: boolean }> {
  const meta = resolveBlockMeta(params.blockId);
  if (!meta) {
    return { data: null, error: "Unknown block", notFound: true };
  }

  const { data: existing, error: selectError } = await supabase
    .from("question_threads")
    .select("*")
    .eq("org_id", params.orgId)
    .eq("reporting_year", params.reportingYear)
    .eq("block_id", params.blockId)
    .maybeSingle();

  if (selectError) {
    return { data: null, error: selectError.message };
  }
  if (existing) {
    return { data: existing as ThreadRow, error: null };
  }

  const insertPayload = {
    org_id: params.orgId,
    reporting_year: params.reportingYear,
    block_id: params.blockId,
    panel_id: meta.panelId,
    question_code: meta.questionCode,
  };

  const { data: inserted, error: insertError } = await supabase
    .from("question_threads")
    .insert(insertPayload)
    .select("*")
    .single();

  if (insertError) {
    // Concurrent insert: re-select the winner of the unique constraint.
    if (insertError.code === "23505") {
      const { data: raced, error: raceError } = await supabase
        .from("question_threads")
        .select("*")
        .eq("org_id", params.orgId)
        .eq("reporting_year", params.reportingYear)
        .eq("block_id", params.blockId)
        .single();
      if (raceError) {
        return { data: null, error: raceError.message };
      }
      return { data: raced as ThreadRow, error: null };
    }
    return { data: null, error: insertError.message };
  }

  return { data: inserted as ThreadRow, error: null };
}

export function isRlsForbidden(error: { code?: string; message?: string }): boolean {
  const code = error.code ?? "";
  const msg = (error.message ?? "").toLowerCase();
  return (
    code === "42501" ||
    msg.includes("row-level security") ||
    msg.includes("permission denied")
  );
}
