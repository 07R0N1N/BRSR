#!/usr/bin/env npx ts-node
/**
 * Audit script: compare question codes between the legacy HTML template and a new JSX component.
 *
 * Usage:
 *   # Extract template codes for a principle (run BEFORE writing the JSX component):
 *   npx ts-node scripts/audit-principle-codes.ts --template 1
 *
 *   # Compare template codes vs JSX codes (run AFTER writing the JSX component):
 *   npx ts-node scripts/audit-principle-codes.ts --compare 1 app/(dashboard)/dashboard/panels/PanelPrinciple1.tsx
 *
 * Exit code 0 = audit passed (no missing codes), 1 = audit failed.
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractTemplateIds(html: string): string[] {
  const ids: string[] = [];
  // Match id="..." attributes inside input/textarea/select tags
  const re = /id="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const id = m[1];
    // Skip generic JS/HTML structural ids (not BRSR question codes)
    if (/^p\d+_/.test(id) || /^gen_|^gdata_|^sb_/.test(id)) {
      ids.push(id);
    }
  }
  return Array.from(new Set(ids)).sort();
}

function extractJsxCodes(content: string): string[] {
  const ids: string[] = [];
  // Patterns: values["code"], values['code'], values[`code`]
  const reStr = /values\[["'`]([^"'`\]]+)["'`]\]/g;
  let m: RegExpExecArray | null;
  while ((m = reStr.exec(content))) {
    ids.push(m[1]);
  }
  // Pattern: onChange(code, ...) where code is a literal string in the JSX
  // captures: onChange("p1_foo", ...) or onChange(`${p}_foo`, ...)
  const reOnChange = /onChange\(["'`]([^"'`\)]+)["'`]/g;
  while ((m = reOnChange.exec(content))) {
    ids.push(m[1]);
  }
  // Pattern: QuestionInput code="..." or code={...}
  const reQuestionInput = /code=["'`]([^"'`]+)["'`]/g;
  while ((m = reQuestionInput.exec(content))) {
    ids.push(m[1]);
  }
  return Array.from(new Set(ids)).filter((id) => /^p\d+_/.test(id)).sort();
}

function expandDynamicCodes(templateIds: string[]): { static: string[]; dynamicPrefixes: string[] } {
  const staticIds: string[] = [];
  const dynamicPrefixes: string[] = [];
  for (const id of templateIds) {
    if (/_row0_/.test(id)) {
      // This is a row0 code; it implies a row-pattern
      dynamicPrefixes.push(id.replace(/_row0_/, "_row{N}_"));
    } else {
      staticIds.push(id);
    }
  }
  return { static: staticIds, dynamicPrefixes };
}

function jsxCoversRowPattern(jsxCodes: string[], pattern: string): boolean {
  // pattern like "p2_l1_row{N}_nic"
  // JSX typically uses row0 as the base and maps over rows; check if row0 variant is present
  const row0 = pattern.replace("_row{N}_", "_row0_");
  // or check if the prefix (before _row{N}_) appears in any JSx code via dynamic access
  const prefix = pattern.split("_row{N}_")[0];
  return jsxCodes.some((c) => c === row0 || c.startsWith(prefix + "_row"));
}

// ---------------------------------------------------------------------------
// Load template codes for a principle
// ---------------------------------------------------------------------------

function getPrincipleTemplateCodes(principleNum: number): string[] {
  const templatesPath = path.resolve(__dirname, "../lib/brsr/principleTemplates.ts");
  const src = fs.readFileSync(templatesPath, "utf-8");

  // We need to evaluate/extract the template for a specific principle.
  // Since we can't safely eval TS, we extract the HTML string between case N: return { ... }
  // by finding the case block and then regex-extracting id= from it.

  const caseRe = new RegExp(`case ${principleNum}:\\s*return \\{([\\s\\S]*?)\\};\\s*case \\d+:`);
  const lastCaseRe = new RegExp(`case ${principleNum}:\\s*return \\{([\\s\\S]*?)\\};\\s*default:`);

  const block = caseRe.exec(src)?.[1] ?? lastCaseRe.exec(src)?.[1];
  if (!block) {
    // Try last case (no following case)
    const lastRe = new RegExp(`case ${principleNum}:\\s*return \\{([\\s\\S]*)\\}`);
    const lastBlock = lastRe.exec(src)?.[1];
    if (!lastBlock) {
      console.error(`Could not find template for principle ${principleNum}`);
      process.exit(1);
    }
    return extractTemplateIds(lastBlock);
  }
  return extractTemplateIds(block);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

if (args[0] === "--template") {
  const n = parseInt(args[1], 10);
  if (isNaN(n)) { console.error("Usage: --template <principleNum>"); process.exit(1); }
  const ids = getPrincipleTemplateCodes(n);
  console.log(`\nTemplate codes for Principle ${n} (${ids.length} codes):\n`);
  ids.forEach((id) => console.log(`  ${id}`));
  console.log(`\nSave this list to compare after writing the JSX component.`);

} else if (args[0] === "--compare") {
  const n = parseInt(args[1], 10);
  const jsxPath = args[2];
  if (isNaN(n) || !jsxPath) {
    console.error("Usage: --compare <principleNum> <path/to/PanelPrincipleN.tsx>");
    process.exit(1);
  }

  const templateIds = getPrincipleTemplateCodes(n);
  const jsxContent = fs.readFileSync(path.resolve(process.cwd(), jsxPath), "utf-8");
  const jsxCodes = extractJsxCodes(jsxContent);
  const { static: staticIds, dynamicPrefixes } = expandDynamicCodes(templateIds);

  const missingStatic = staticIds.filter((id) => !jsxCodes.includes(id));
  const missingDynamic = dynamicPrefixes.filter((p) => !jsxCoversRowPattern(jsxCodes, p));
  const extraInJsx = jsxCodes.filter(
    (id) =>
      !templateIds.includes(id) &&
      !dynamicPrefixes.some((p) => {
        const row0 = p.replace("_row{N}_", "_row0_");
        return id === row0 || id.startsWith(p.split("_row{N}_")[0] + "_row");
      })
  );

  console.log(`\n=== Principle ${n} Code Audit ===`);
  console.log(`Template codes: ${templateIds.length}`);
  console.log(`JSX codes:      ${jsxCodes.length}`);

  if (missingStatic.length === 0 && missingDynamic.length === 0) {
    console.log(`\n✓ PASSED: All template codes are covered by the JSX component.`);
  } else {
    if (missingStatic.length > 0) {
      console.log(`\n✗ MISSING in JSX (${missingStatic.length}):`);
      missingStatic.forEach((id) => console.log(`  - ${id}`));
    }
    if (missingDynamic.length > 0) {
      console.log(`\n✗ MISSING dynamic row patterns in JSX (${missingDynamic.length}):`);
      missingDynamic.forEach((p) => console.log(`  - ${p}`));
    }
  }

  if (extraInJsx.length > 0) {
    console.log(`\n⚠ EXTRA codes in JSX not in template (${extraInJsx.length}) — may be intentional:`);
    extraInJsx.forEach((id) => console.log(`  + ${id}`));
  }

  const failed = missingStatic.length > 0 || missingDynamic.length > 0;
  process.exit(failed ? 1 : 0);

} else {
  console.log(`
BRSR Principle Code Audit

Usage:
  npx ts-node scripts/audit-principle-codes.ts --template <N>
      List all question codes (id=) from the HTML template for Principle N.
      Run this BEFORE writing the JSX component.

  npx ts-node scripts/audit-principle-codes.ts --compare <N> <path/to/PanelPrincipleN.tsx>
      Compare template codes vs JSX codes. Exits 0 if all template codes are
      covered, 1 if any are missing.
      Run this AFTER writing the JSX component.
`);
}
