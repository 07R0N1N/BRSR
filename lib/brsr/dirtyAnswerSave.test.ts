/**
 * @testfile
 * Suite:    Dirty-set answer save payload
 * Breaker:  AUTHORSHIP
 * Covers:   Only changed question codes are included in the POST body so
 *            updated_by is not stamped on the whole questionnaire.
 * Run:      npx vitest run lib/brsr/dirtyAnswerSave.test.ts
 */

import { describe, expect, it } from "vitest";
import { buildDirtyAnswersPayload } from "./dirtyAnswerSave";

describe("buildDirtyAnswersPayload", () => {
  it("includes only dirty codes", () => {
    const dirty = new Set(["gen_1_cin", "gen_2_name"]);
    const answers = {
      gen_1_cin: "ABC",
      gen_2_name: "Co",
      gen_3_year_inc: "1990",
    };
    expect(buildDirtyAnswersPayload(dirty, answers)).toEqual({
      gen_1_cin: "ABC",
      gen_2_name: "Co",
    });
  });

  it("returns empty object when dirty set is empty", () => {
    expect(buildDirtyAnswersPayload(new Set(), { gen_1_cin: "x" })).toEqual({});
  });

  it("uses null for missing values on dirty codes", () => {
    expect(buildDirtyAnswersPayload(new Set(["gen_1_cin"]), {})).toEqual({
      gen_1_cin: null,
    });
  });
});
