import { describe, expect, it } from "vitest";
import { computeSectionProgress } from "@/components/panel/sectionProgress";

describe("computeSectionProgress", () => {
  it("counts answered vs total codes across registered blocks", () => {
    const answers = {
      gen_1_cin: "L123",
      gen_2_name: "",
      gen_3_year_inc: "2020-01-01",
    };
    const progress = computeSectionProgress(["general_1", "general_2", "general_3"], answers);
    expect(progress.total).toBeGreaterThanOrEqual(3);
    expect(progress.answered).toBe(2);
  });

  it("returns zero totals for unknown block ids", () => {
    const progress = computeSectionProgress(["nonexistent_block"], {});
    expect(progress).toEqual({ answered: 0, total: 0 });
  });
});
