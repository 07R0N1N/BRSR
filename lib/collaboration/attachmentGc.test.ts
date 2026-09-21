/**
 * @testfile
 * Suite:    Attachment GC orphan-diff helpers
 * Breaker:  N/A
 * Covers:   orphanPathsToEnqueue skips metadata hits and young objects;
 *            pendingGcPaths filters purged rows.
 * Run:      npx vitest run lib/collaboration/attachmentGc.test.ts
 * Depends:  none — pure unit
 */

import { describe, expect, it } from "vitest";
import { orphanPathsToEnqueue, pendingGcPaths } from "./attachmentGc";

describe("orphanPathsToEnqueue", () => {
  const now = Date.parse("2026-09-21T12:00:00.000Z");
  const day = 24 * 60 * 60 * 1000;

  it("returns storage paths missing from metadata and older than minAge", () => {
    const result = orphanPathsToEnqueue({
      nowMs: now,
      minAgeMs: day,
      metadataPaths: new Set(["org/y/b/kept.pdf"]),
      storagePaths: [
        { path: "org/y/b/kept.pdf", updatedAt: "2026-09-01T00:00:00.000Z" },
        { path: "org/y/b/orphan.pdf", updatedAt: "2026-09-01T00:00:00.000Z" },
        { path: "org/y/b/fresh.pdf", updatedAt: "2026-09-21T11:00:00.000Z" },
      ],
    });
    expect(result).toEqual(["org/y/b/orphan.pdf"]);
  });

  it("includes objects with missing updatedAt", () => {
    const result = orphanPathsToEnqueue({
      nowMs: now,
      metadataPaths: new Set(),
      storagePaths: [{ path: "org/y/b/no-date.pdf" }],
    });
    expect(result).toEqual(["org/y/b/no-date.pdf"]);
  });
});

describe("pendingGcPaths", () => {
  it("returns only rows without purged_at", () => {
    expect(
      pendingGcPaths([
        { storage_path: "a", purged_at: null },
        { storage_path: "b", purged_at: "2026-09-21T00:00:00.000Z" },
        { storage_path: "c", purged_at: null },
      ])
    ).toEqual(["a", "c"]);
  });
});
