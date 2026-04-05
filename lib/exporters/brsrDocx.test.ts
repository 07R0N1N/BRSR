/**
 * @testfile
 * Suite:    brsrDocx helpers
 * Breaker:  N/A
 * Covers:   tv(), pv(), isRowEmpty() correctly map mapper sentinel / null / blank
 *           to the right display value for table cells and prose paragraphs.
 *           Without this, empty cells would show "—" in exports or prose fields
 *           would be silently blank instead of stating disclosure unavailability.
 * Run:      npx vitest run lib/exporters/brsrDocx.test.ts
 * Depends:  none — pure unit
 */
import { describe, it, expect } from "vitest";
import { tv, pv, isRowEmpty, buildStructuredTable, PROSE_EMPTY } from "./brsrDocx";
import type { StructuredTable } from "@/types/brsr";

describe("tv (table-cell value)", () => {
  it("returns empty string for the mapper sentinel '—'", () => {
    expect(tv("—")).toBe("");
  });

  it("returns empty string for an empty string", () => {
    expect(tv("")).toBe("");
  });

  it("returns empty string for null", () => {
    expect(tv(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(tv(undefined)).toBe("");
  });

  it("passes through an actual value unchanged", () => {
    expect(tv("Yes")).toBe("Yes");
  });

  it("passes through a numeric string unchanged", () => {
    expect(tv("42")).toBe("42");
  });
});

describe("pv (prose value)", () => {
  it("returns PROSE_EMPTY for the mapper sentinel '—'", () => {
    expect(pv("—")).toBe(PROSE_EMPTY);
  });

  it("returns PROSE_EMPTY for an empty string", () => {
    expect(pv("")).toBe(PROSE_EMPTY);
  });

  it("returns PROSE_EMPTY for null", () => {
    expect(pv(null)).toBe(PROSE_EMPTY);
  });

  it("returns PROSE_EMPTY for undefined", () => {
    expect(pv(undefined)).toBe(PROSE_EMPTY);
  });

  it("passes through an actual value unchanged", () => {
    expect(pv("Our director is committed to sustainability.")).toBe(
      "Our director is committed to sustainability."
    );
  });

  it("PROSE_EMPTY is the expected disclosure string", () => {
    expect(PROSE_EMPTY).toBe("Disclosure Not Available");
  });
});

describe("isRowEmpty", () => {
  it("returns true when all values are the mapper sentinel", () => {
    expect(isRowEmpty(["—", "—", "—"])).toBe(true);
  });

  it("returns true when all values are empty strings", () => {
    expect(isRowEmpty(["", "", ""])).toBe(true);
  });

  it("returns true when all values are null", () => {
    expect(isRowEmpty([null, null])).toBe(true);
  });

  it("returns true when all values are undefined", () => {
    expect(isRowEmpty([undefined, undefined])).toBe(true);
  });

  it("returns true for a mixed empty array", () => {
    expect(isRowEmpty(["—", null, "", undefined])).toBe(true);
  });

  it("returns false when any value is non-empty", () => {
    expect(isRowEmpty(["—", "Yes", "—"])).toBe(false);
  });

  it("returns false when all values have content", () => {
    expect(isRowEmpty(["P1", "Yes", "Board"])).toBe(false);
  });

  it("returns true for an empty array", () => {
    expect(isRowEmpty([])).toBe(true);
  });
});

describe("buildStructuredTable", () => {
  const st: StructuredTable = {
    columns: ["A", "B", "C"],
    rows: [
      ["1", "2", "3"],
      [null, null, null],  // all-empty row — should be skipped
      ["4", "5", "6"],
    ],
  };

  it("returns null when all rows are empty", () => {
    const empty: StructuredTable = { columns: ["X"], rows: [[null], [null]] };
    expect(buildStructuredTable(empty)).toBeNull();
  });

  it("returns null for zero rows", () => {
    const empty: StructuredTable = { columns: ["X"], rows: [] };
    expect(buildStructuredTable(empty)).toBeNull();
  });

  it("produces a Table object for non-empty data", () => {
    const result = buildStructuredTable(st);
    expect(result).not.toBeNull();
  });

  it("skips all-empty rows (null values) in the output", () => {
    // After skipping all-empty row, only 2 data rows should be present
    const result = buildStructuredTable(st);
    // Table has 1 header + 2 body rows = 3 rows total
    // Access via the internal rows property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tableRows = (result as any).root.filter((n: any) => n.constructor?.name === "TableRow");
    expect(tableRows.length).toBe(3); // header + 2 data
  });
});
