/**
 * Writes docs/question-structure.md from assignment blocks + CALC_RULES.
 * Run: npx tsx scripts/build-question-structure-doc.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { getAssignmentBlocksForPanel, type AssignmentBlock } from "../lib/brsr/assignmentBlocks";
import { CALC_RULES } from "../lib/brsr/calcRules";
import { NGRBC_PRINCIPLE_TITLES } from "../lib/brsr/questionCodes";
import type { CalcRule, PanelId } from "../lib/brsr/types";

function formulaIds(formula: string): string[] {
  return (formula.match(/[a-z0-9_]+/gi) ?? []).filter((t) => t.includes("_"));
}

function ruleTouchesPrefix(rule: CalcRule, prefix: string): boolean {
  const ids: string[] = [rule.outputId];
  if (rule.type === "formula") ids.push(...formulaIds(rule.formula));
  if (rule.type === "sum") ids.push(...rule.sumIds);
  if (rule.type === "pct") ids.push(rule.num, rule.denom);
  return ids.some((id) => id.startsWith(prefix));
}

function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return "";
  let pref = strs[0];
  for (const s of strs) {
    while (!s.startsWith(pref)) pref = pref.slice(0, -1);
    if (!pref) return "";
  }
  if (pref.endsWith("_")) return pref;
  if (strs.every((s) => s.length > pref.length && s[pref.length] === "_")) return `${pref}_`;
  return pref;
}

function calcPrefixForBlock(panel: PanelId, block: AssignmentBlock, codes: string[]): string {
  if (codes.length === 0) return "";
  if (panel === "p6") {
    if (block.id === "p6_notes") return "p6_notes";
    return block.id === "p6_e10" ? "p6_e10" : `${block.id}_`;
  }
  if (panel === "general") {
    const m = codes[0].match(/^gen_(\d+[a-z]?|19b|19c)_/);
    return m ? `gen_${m[1]}_` : longestCommonPrefix(codes);
  }
  if (panel === "sectionb") {
    const m = codes[0].match(/^(sb_\d+[a-z]?)_/);
    return m ? `${m[1]}_` : longestCommonPrefix(codes);
  }
  if (/^p[1-9]$/.test(panel) && codes.length === 1) {
    const c = codes[0];
    if (c.endsWith("_notes")) return c;
    const m = c.match(/^(p\d+_(?:e\d+[a-z]?|l\d+))_/);
    if (m) return `${m[1]}_`;
  }
  return longestCommonPrefix(codes);
}

function calcSummaryForPrefix(prefix: string): string {
  if (!prefix) return "(none)";
  const needle =
    prefix === "p6_notes" || prefix.endsWith("_") || prefix === "p6_e10" ? prefix : `${prefix}_`;
  const rules = CALC_RULES.filter((r) => ruleTouchesPrefix(r, needle));
  if (rules.length === 0) return "(none — no `CALC_RULES` rows use this prefix)";
  const maxShow = 8;
  const parts = rules.slice(0, maxShow).map((r) => {
    if (r.type === "formula")
      return `\`${r.formula}\` → \`${r.outputId}\` (${r.decimals} dp)`;
    if (r.type === "sum")
      return `[…${r.sumIds.length} ids…] → \`${r.outputId}\` (sum)`;
    return `\`${r.num}\` / \`${r.denom}\` → \`${r.outputId}\` (pct)`;
  });
  const more = rules.length > maxShow ? ` … +${rules.length - maxShow} more rules in \`calcRules.ts\`` : "";
  return `${parts.join("; ")}${more}`;
}

function blockType(panel: PanelId, codes: string[]): "single field" | "table (multi-record)" | "matrix (per-principle grid)" {
  if (panel === "sectionb" && codes.some((c) => /_p[1-9]$/.test(c))) {
    return "matrix (per-principle grid)";
  }
  const hasRowCount = codes.some((c) => c.endsWith("_row_count") || /rowcount/i.test(c));
  if (hasRowCount) return "table (multi-record)";
  const numbered = codes.filter((c) => /_\d+_/.test(c)).length;
  if (numbered >= 3 && panel === "general") return "table (multi-record)";
  if (codes.length > 15 && panel === "general") return "table (multi-record)";
  return "single field";
}

function rowPatternNote(panel: PanelId, codes: string[]): string {
  if (codes.some((c) => /^p8_e1_/.test(c))) {
    return "Template row: `p8_e1_name`, …; added rows: `p8_e1_row{k}_*` for `k >= 1`; `p8_e1_rowcount`. Dynamic codes may exist only in `answers` (see `docs/prefix-sync.md`).";
  }
  if (codes.some((c) => c.startsWith("p8_e2_"))) {
    return "Rows: `p8_e2_row{i}_*` for `i >= 0`; `p8_e2_rowcount`.";
  }
  if (codes.some((c) => c.startsWith("p4_e2_"))) {
    return "Template `p4_e2_row0_*`, `p4_e2_rowcount`; UI may add `p4_e2_row{n}_*`.";
  }
  if (codes.some((c) => c.startsWith("p1_e2_"))) {
    return "Sub-tables: `p1_e2_pf_*`, `p1_e2_set_*`, `p1_e2_cmp_*`, `p1_e2_imp_*`, `p1_e2_pun_*` with `*_rowcount` / `*_row0_*` and optional extra rows.";
  }
  if (codes.some((c) => c.startsWith("gen_10_"))) return "Rows `gen_10_{n}_exchange|description|country`; `gen_10_row_count`.";
  if (codes.some((c) => c.startsWith("gen_14_"))) return "Rows `gen_14_{n}_*`; `gen_14_row_count`.";
  if (codes.some((c) => c.startsWith("gen_16_"))) return "Template `gen_16_1_*`; instances `gen_16_{n}_*`; `gen_16_row_count`.";
  if (codes.some((c) => c.startsWith("gen_17_"))) return "Rows `gen_17_{n}_*`; `gen_17_row_count`.";
  if (codes.some((c) => c.startsWith("gen_23_"))) return "Rows `gen_23_{n}_*`; `gen_23_row_count`.";
  if (codes.some((c) => c.startsWith("gen_26_"))) return "Rows `gen_26_{n}_*`; `gen_26_row_count`.";
  if (/^p\d/.test(panel) && codes.some((c) => /rowcount|_row\d+_/.test(c))) {
    return "Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).";
  }
  return "";
}

function formatCodesList(codes: readonly string[]): string {
  return codes.map((c) => `\`${c}\``).join(", ");
}

function renderBlocks(panel: PanelId, blocks: ReturnType<typeof getAssignmentBlocksForPanel>): string {
  const out: string[] = [];
  for (const b of blocks) {
    const displayPrefix = calcPrefixForBlock(panel, b, [...b.questionCodes]);
    const typ = blockType(panel, b.questionCodes);
    const rowNote = rowPatternNote(panel, b.questionCodes);
    const calcText =
      typ === "matrix (per-principle grid)"
        ? "(none — Section B cells are inputs; no `CALC_RULES` for `sb_*`)"
        : calcSummaryForPrefix(displayPrefix);

    out.push(`### ${b.label}`);
    out.push(`- **Prefix:** \`${displayPrefix}\``);
    out.push(`- **Codes:** ${formatCodesList(b.questionCodes)}`);
    out.push(`- **Type:** ${typ}`);
    if (rowNote) out.push(`- **If table:** ${rowNote}`);
    out.push(`- **Calculated from (read-only \`CALC_RULES\`):** ${calcText}`);
    out.push("");
  }
  return out.join("\n").trimEnd();
}

const HEAD = `# Question structure ledger

Plain reference: how panels map to question codes, assignment blocks, and calculated fields. The **authoritative enum of saved input codes** is \`lib/brsr/questionCodes.ts\` (\`GDATA_CODES\`, \`GEN_CODES\`, \`SB_CODES\`, \`P1_CODES\`…\`P9_CODES\`, \`ALL_QUESTION_CODES\`). This document explains structure and patterns; it does not duplicate every line of those arrays.

Panel metadata: \`lib/brsr/panels.ts\` (\`PANELS\`).

Assignment blocks (admin UI / export labels): \`getAssignmentBlocksForPanel\` in \`lib/brsr/assignmentBlocks.ts\`, with static prefix tables for migrated principles in \`lib/brsr/principleBlocksConfig.ts\`.

Catalogue table \`brsr_questions\` is seeded by \`scripts/seed-brsr-questions.ts\` from the same block decomposition — run \`npm run seed:questions\` after adding codes to \`questionCodes.ts\`.

---

## General Data Gathering (panel id: \`generaldata\`)

### Turnover & PPP (for intensity calculations)

- **Question codes:** \`gdata_turnover_cy\`, \`gdata_turnover_py\`, \`gdata_ppp_cy\`, \`gdata_ppp_py\`
- **Type:** single fields
- **Prefix:** \`gdata_\`
- **Calculated from:** read-only \`gdata_rev_ppp_cy_display\`, \`gdata_rev_ppp_py_display\` in \`calcRules.ts\` (formulas on turnover/PPP)

### Employee & worker counts

- **Question codes:** remaining \`GDATA_CODES\` entries (\`gdata_emp_*\`, \`gdata_wrk_*\`)
- **Type:** single fields (matrix of categories)
- **Prefix:** \`gdata_\`
- **Calculated from:** \`gdata_emp_perm_sum\`, \`gdata_emp_oth_sum\`, \`gdata_wrk_perm_sum\`, \`gdata_wrk_oth_sum\` (\`sum\` rules)

---

## General Disclosures — Section A (panel id: \`general\`)

Per-block layout from \`getAssignmentBlocksForPanel('general')\` and \`GENERAL_LABELS\` in \`assignmentBlocks.ts\`.
`;

const SECTION_B_HEAD = `
---

## Management & Process — Section B (panel id: \`sectionb\`)

Per-block layout from \`getAssignmentBlocksForPanel('sectionb')\` and \`SECTION_B_LABELS\` in \`assignmentBlocks.ts\`.
`;

function principleSection(n: 1 | 2 | 3 | 4 | 5 | 7 | 8 | 9): string {
  const title = NGRBC_PRINCIPLE_TITLES[n];
  const pid = `p${n}` as PanelId;
  const blocks = getAssignmentBlocksForPanel(pid);
  const body = renderBlocks(pid, blocks);
  return `---

## ${title} (panel id: \`${pid}\`)

Assignment blocks from \`getStaticPrincipleBlocks(${n}, …)\` / \`getAssignmentBlocksForPanel('${pid}')\`.

${body}`;
}

const P6_INTRO = `---

## ${NGRBC_PRINCIPLE_TITLES[6]} (panel id: \`p6\`)

Assignment blocks from \`getAssignmentBlocksForPanel('p6')\` (\`P6_PREFIX_LABELS\` / \`makeP6Blocks\`). Includes General Data autofill targets (\`P6_AUTOFILL_*\`) and many read-only intensities in \`CALC_RULES\`.
`;

const P6_AUTOFILL_SECTION = `---

## Principle 6 — autofill and revenue fields

- **Source inputs (General Data):** \`gdata_turnover_cy\`, \`gdata_turnover_py\`, \`gdata_ppp_cy\`, \`gdata_ppp_py\`
- **Autofill targets:** all codes in \`P6_AUTOFILL_REV_IDS\` and \`P6_AUTOFILL_REV_PPP_IDS\` (\`questionCodes.ts\`) — copied into \`answers\` as normal user-visible values.

`;

const TAIL = `---

## Naming conventions

- **\`_cy\` / \`_py\`:** Current financial year vs previous financial year (and analogous in P6 intensity columns).
- **\`_e1\`, \`_e2\`, …:** Essential indicator sections; **\`_l1\`, …:** Leadership indicator sections.
- **Row instances:** \`{panel}_{section}_row{n}_{field}\` or \`{panel}_{section}_row{n}\` (e.g. \`p8_e1_row2_name\`, \`gen_16_3_main\`). **Template row** may omit \`_row0_\` (e.g. \`p8_e1_name\` = record 1).
- **\`_rowcount\`:** Stringified count stored in \`answers\`, used by panel UI to render repeatable sections.

---

## Relationship: \`questionCodes.ts\` and \`brsr_questions\`

- New **static** inputs must appear in the appropriate \`*_CODES\` array (or \`ALL_QUESTION_CODES\` breaks, API assignment validation fails, seed is incomplete).
- After changing codes, run **\`npm run seed:questions\`** so \`brsr_questions\` stays aligned.
- **Dynamic row codes** (only appearing after users add rows) rely on **prefix** sync with RLS (\`docs/prefix-sync.md\`); they do not need a row in \`brsr_questions\` for save path if the prefix is already covered — but new **block families** need new prefixes everywhere in the four-way sync.

---

## Fields that must never be renamed

Renaming breaks autofill, calculations, export mapping, or RLS matching **without** TypeScript errors.

### \`flowGeneralDataToP6.ts\`

- **Inputs:** \`gdata_turnover_cy\`, \`gdata_turnover_py\`, \`gdata_ppp_cy\`, \`gdata_ppp_py\`
- **Outputs:** every id in **\`P6_AUTOFILL_REV_IDS\`** and **\`P6_AUTOFILL_REV_PPP_IDS\`**

### Autofill target ids (explicit)

\`p6_e1_rev_cy\`, \`p6_e3_rev_cy\`, \`p6_e7_rev_cy\`, \`p6_e9_rev_cy\`, \`p6_e1_rev_py\`, \`p6_e3_rev_py\`, \`p6_e7_rev_py\`, \`p6_e9_rev_py\`, \`p6_e1_rev_ppp_cy\`, \`p6_e3_rev_ppp_cy\`, \`p6_e7_rev_ppp_cy\`, \`p6_e9_rev_ppp_cy\`, \`p6_e1_rev_ppp_py\`, \`p6_e3_rev_ppp_py\`, \`p6_e7_rev_ppp_py\`, \`p6_e9_rev_ppp_py\`

### \`CALC_RULES\` outputIds (\`lib/brsr/calcRules.ts\`)

All \`outputId\` values are **display-only keys** in \`calcDisplay\`; many formulas reference **input** question codes by id (e.g. \`p6_e1_rev_cy\` in denominators). Do not rename:

- Any \`outputId\` string committed in \`CALC_RULES\`
- Any **input** code referenced inside a \`formula\`, or listed in \`sumIds\` / \`num\` / \`denom\` of a rule

Search \`calcRules.ts\` for your code before renaming. High-chaining examples: \`gen_20a_*\` / \`gen_20b_*\` totals and percentages; P6 \`p6_e1_*\`, \`p6_e3_*\`, \`p6_e7_*\`, \`p6_e9_*\` intensity outputs; optional waste stream blocks using \`p6_e9_rev_cy\` as denominator.

### Codes to avoid / retired

No separate retired list is maintained yet; use git history and \`docs/question-codes.md\` for future deprecation notes.

---

## Codes to avoid

- **Reserved / ambiguous:** Do not introduce codes that collide with another block’s prefix (longest-prefix wins in \`BLOCK_ACCESS_PREFIXES\` — order matters).
- **Legacy:** \`LegacyPrincipleRenderer\` and \`principleTemplates.ts\` use HTML \`id\` patterns; renaming template-bound ids without migrating JSX breaks old references.
`;

const doc = [
  HEAD,
  renderBlocks("general", getAssignmentBlocksForPanel("general")),
  SECTION_B_HEAD,
  renderBlocks("sectionb", getAssignmentBlocksForPanel("sectionb")),
  principleSection(1),
  principleSection(2),
  principleSection(3),
  principleSection(4),
  principleSection(5),
  P6_INTRO,
  renderBlocks("p6", getAssignmentBlocksForPanel("p6")),
  P6_AUTOFILL_SECTION.trimEnd(),
  principleSection(7),
  principleSection(8),
  principleSection(9),
  TAIL,
].join("\n\n");

writeFileSync(join(process.cwd(), "docs/question-structure.md"), doc);
console.log("Wrote docs/question-structure.md");
