/**
 * Seed the brsr_questions catalogue table from the TypeScript question definitions.
 * Run once after applying migration 007, and re-run any time question codes change.
 *
 * Usage: npm run seed:questions
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Idempotent — uses ON CONFLICT DO NOTHING, safe to re-run.
 */

import { resolve } from "path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

import { PANELS } from "../lib/brsr/panels";
import { getAssignmentBlocksForPanel } from "../lib/brsr/assignmentBlocks";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type QuestionRow = {
  question_code: string;
  panel_id: string;
  section_label: string;
  question_order: number;
  brsr_version: string;
  is_active: boolean;
};

async function main() {
  const rows: QuestionRow[] = [];

  for (const panel of PANELS) {
    const blocks = getAssignmentBlocksForPanel(panel.id);
    let order = 0;

    for (const block of blocks) {
      for (const code of block.questionCodes) {
        rows.push({
          question_code: code,
          panel_id: panel.id,
          section_label: block.label,
          question_order: order++,
          brsr_version: "SEBI-2023",
          is_active: true,
        });
      }
    }
  }

  console.log(`Upserting ${rows.length} question rows…`);

  // Batch in chunks of 500 to stay within Supabase request limits
  const CHUNK = 500;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("brsr_questions")
      .upsert(chunk, { onConflict: "question_code", ignoreDuplicates: true });

    if (error) {
      console.error(`Error upserting chunk starting at index ${i}:`, error.message);
      process.exit(1);
    }

    inserted += chunk.length;
    console.log(`  ${inserted} / ${rows.length} rows processed`);
  }

  console.log(`Done. ${rows.length} question codes seeded across ${PANELS.length} panels.`);
}

main();
