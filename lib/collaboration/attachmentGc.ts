/**
 * Pure helpers for attachment storage garbage collection.
 * Used by scripts/purge-attachment-objects.ts and unit tests.
 */

export type StorageObjectRef = {
  path: string;
  /** ISO timestamp of object creation / last update when available */
  updatedAt?: string | null;
};

/**
 * Paths present in storage but absent from metadata, older than minAgeMs.
 * Used by --reconcile to catch orphans that never got a GC queue row
 * (e.g. upload succeeded, metadata insert failed, admin remove also failed).
 */
export function orphanPathsToEnqueue(params: {
  storagePaths: StorageObjectRef[];
  metadataPaths: Set<string>;
  nowMs?: number;
  minAgeMs?: number;
}): string[] {
  const now = params.nowMs ?? Date.now();
  const minAge = params.minAgeMs ?? 24 * 60 * 60 * 1000;
  const out: string[] = [];

  for (const obj of params.storagePaths) {
    if (params.metadataPaths.has(obj.path)) continue;
    if (obj.updatedAt) {
      const t = Date.parse(obj.updatedAt);
      if (!Number.isNaN(t) && now - t < minAge) continue;
    }
    out.push(obj.path);
  }

  return out;
}

/** Pending GC rows that still need a storage remove. */
export function pendingGcPaths(
  rows: { storage_path: string; purged_at: string | null }[]
): string[] {
  return rows.filter((r) => r.purged_at == null).map((r) => r.storage_path);
}
