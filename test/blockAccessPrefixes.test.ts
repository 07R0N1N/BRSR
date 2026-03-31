import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  BLOCK_ACCESS_PREFIXES,
  computeAllowedBlockPrefixes,
  isQuestionCodeAllowedForRestrictedUser,
  questionCodesShareAssignmentBlock,
} from "@/lib/brsr/blockAccessPrefixes";

describe("questionCodesShareAssignmentBlock", () => {
  it("treats identical codes as same block", () => {
    expect(questionCodesShareAssignmentBlock("p8_e1_name", "p8_e1_name")).toBe(true);
  });

  it("matches dynamic row variants under the same principle block prefix", () => {
    expect(questionCodesShareAssignmentBlock("p8_e1_name", "p8_e1_row3_link")).toBe(true);
    expect(questionCodesShareAssignmentBlock("p8_e1_row1_name", "p8_e1_notif")).toBe(true);
  });

  it("matches numbered general rows", () => {
    expect(questionCodesShareAssignmentBlock("gen_16_1_main", "gen_16_2_main")).toBe(true);
    expect(questionCodesShareAssignmentBlock("gen_16_1_main", "gen_16_row_count")).toBe(true);
  });

  it("does not match unrelated blocks", () => {
    expect(questionCodesShareAssignmentBlock("p8_e1_name", "p8_e2_row0_name")).toBe(false);
    expect(questionCodesShareAssignmentBlock("gen_16_1_main", "gen_1_cin")).toBe(false);
  });
});

describe("isQuestionCodeAllowedForRestrictedUser", () => {
  it("allows all codes when allowedSet is null", () => {
    expect(isQuestionCodeAllowedForRestrictedUser("anything_row99_x", null)).toBe(true);
  });

  it("allows exact assigned codes", () => {
    const s = new Set(["p8_e1_name"]);
    expect(isQuestionCodeAllowedForRestrictedUser("p8_e1_name", s)).toBe(true);
  });

  it("allows dynamic row codes when a block peer is assigned", () => {
    const s = new Set(["p8_e1_name"]);
    expect(isQuestionCodeAllowedForRestrictedUser("p8_e1_row3_link", s)).toBe(true);
  });

  it("allows extra general rows when row 1 fields are assigned", () => {
    const s = new Set(["gen_16_1_main", "gen_16_1_activity", "gen_16_1_pct"]);
    expect(isQuestionCodeAllowedForRestrictedUser("gen_16_3_main", s)).toBe(true);
  });

  it("denies codes outside assigned blocks", () => {
    const s = new Set(["p8_e1_name"]);
    expect(isQuestionCodeAllowedForRestrictedUser("p1_e1_foo", s)).toBe(false);
  });

  it("fast path (precomputed prefixes) matches legacy when third arg is omitted vs provided", () => {
    const sets = [
      new Set(["p8_e1_name"]),
      new Set(["gen_16_1_main", "gen_16_1_activity"]),
      new Set(["p8_e1_name", "p1_e2_foo"]),
    ];
    const codes = ["p8_e1_row3_link", "gen_16_2_main", "p1_e2_row0_x", "p8_e2_name", "p8_e1_name"];
    for (const s of sets) {
      const pre = computeAllowedBlockPrefixes(s);
      for (const code of codes) {
        expect(isQuestionCodeAllowedForRestrictedUser(code, s, pre)).toBe(
          isQuestionCodeAllowedForRestrictedUser(code, s)
        );
      }
    }
  });
});

describe("computeAllowedBlockPrefixes", () => {
  it("collects longest-matching prefixes for assigned codes", () => {
    const s = new Set(["p7_e1b_1_name", "p7_e1a_x"]);
    const pre = computeAllowedBlockPrefixes(s);
    expect(pre.has("p7_e1b_")).toBe(true);
    expect(pre.has("p7_e1a_")).toBe(true);
    expect(pre.has("p7_e1_")).toBe(false);
  });
});

describe("BLOCK_ACCESS_PREFIXES sync with migration 011 seed", () => {
  it("has the same prefix count as 011_brsr_assignment_block_prefixes.sql ARRAY", () => {
    const migrationPath = join(
      process.cwd(),
      "supabase/migrations/011_brsr_assignment_block_prefixes.sql"
    );
    const sql = readFileSync(migrationPath, "utf8");
    const m = sql.match(/ARRAY\[\s*([\s\S]*?)\s*\]::text\[\]/);
    expect(m).toBeTruthy();
    const body = m![1];
    const literals = body.match(/'((?:''|[^'])*)'/g) ?? [];
    expect(literals.length).toBe(BLOCK_ACCESS_PREFIXES.length);
  });
});
