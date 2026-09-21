"use client";

import { useCallback, useEffect, useState } from "react";
import { useCollaboration } from "@/components/CollaborationContext";

type Props = {
  blockId: string;
  orgId: string;
  reportingYear: string;
};

/**
 * Collapsible internal note on the question card (team-only, not BRSR export).
 * Lazy-loads note body on first expand; saves via PUT /api/threads/[blockId]/note.
 */
export function InlineBlockNote({ blockId, orgId, reportingYear }: Props) {
  const { threadSummaries, refreshSummaries } = useCollaboration();
  const hasNote = threadSummaries[blockId]?.hasNote ?? false;
  const [open, setOpen] = useState(hasNote);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasNote) setOpen(true);
  }, [hasNote]);

  const loadNote = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ org_id: orgId, reporting_year: reportingYear });
      const res = await fetch(`/api/threads/${encodeURIComponent(blockId)}?${params}`);
      const data = await res.json();
      if (res.ok) {
        setDraft(data.thread?.note_body ?? "");
        setLoaded(true);
        setDirty(false);
      }
    } finally {
      setLoading(false);
    }
  }, [blockId, orgId, reportingYear, loaded]);

  const saveNote = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/threads/${encodeURIComponent(blockId)}/note`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_id: orgId,
          reporting_year: reportingYear,
          note_body: draft,
        }),
      });
      if (res.ok) {
        setDirty(false);
        refreshSummaries?.();
      }
    } finally {
      setSaving(false);
    }
  }, [blockId, orgId, reportingYear, draft, refreshSummaries]);

  return (
    <details
      className="mt-3 border-t border-[var(--border-soft)] pt-2"
      open={open}
      onToggle={(e) => {
        const el = e.target as HTMLDetailsElement;
        setOpen(el.open);
        if (el.open) void loadNote();
      }}
    >
      <summary className="cursor-pointer text-[12px] font-semibold text-[var(--text-muted)]">
        Internal note (team only)
      </summary>
      {open && (
        <div className="mt-2">
          {loading ? (
            <p className="text-[11px] text-[var(--text-muted)]">Loading…</p>
          ) : (
            <>
              <textarea
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setDirty(true);
                }}
                onBlur={() => {
                  if (dirty) void saveNote();
                }}
                rows={3}
                placeholder="Team-only note for this assignment block…"
                className="w-full resize-y rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2 text-[13px] text-[var(--ink)] placeholder:text-[var(--text-muted)] focus:border-[var(--brand)] focus:outline-none"
              />
              {(dirty || saving) && (
                <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                  {saving ? "Saving…" : "Unsaved changes"}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </details>
  );
}
