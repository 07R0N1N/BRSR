"use client";

import { useState } from "react";

const SECTIONS = [
  { id: "sectionA", label: "Section A" },
  { id: "sectionB", label: "Section B" },
  { id: "p1", label: "P1" },
  { id: "p2", label: "P2" },
  { id: "p3", label: "P3" },
  { id: "p4", label: "P4" },
  { id: "p5", label: "P5" },
  { id: "p6", label: "P6" },
  { id: "p7", label: "P7" },
  { id: "p8", label: "P8" },
  { id: "p9", label: "P9" },
] as const;

const FORMATS = [
  { id: "docx", label: "Word (.docx)", available: true },
  { id: "xlsx", label: "Excel (.xlsx)", available: true },
  { id: "json", label: "JSON", available: true },
  { id: "pdf", label: "PDF", available: false, note: "Coming soon" },
] as const;

export function ExportModal({
  open,
  onClose,
  orgId,
  year,
  orgName,
}: {
  open: boolean;
  onClose: () => void;
  orgId: string;
  year: string;
  orgName: string;
}) {
  const [format, setFormat] = useState<string>("docx");
  const [sections, setSections] = useState<Set<string>>(
    new Set(SECTIONS.map((s) => s.id))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSections(new Set(SECTIONS.map((s) => s.id)));
  const deselectAll = () => setSections(new Set());

  const handleGenerate = async () => {
    if (!orgId || !year) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/export/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgId,
          year,
          format,
          sections: Array.from(sections),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Export failed (${res.status})`);
      }
      const contentType = res.headers.get("Content-Type") ?? "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `BRSR_${orgName.replace(/[^a-zA-Z0-9_-]/g, "_")}_${year}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const blob = await res.blob();
        const disposition = res.headers.get("Content-Disposition");
        let filename = `BRSR_${orgName}_${year}.${format}`;
        const match = disposition?.match(/filename="?([^";\n]+)"?/);
        if (match) filename = match[1];
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface)] shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-4 py-3">
          <h2 id="export-modal-title" className="text-lg font-bold text-[var(--ink)]">
            Export BRSR Report
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-sm)] p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 px-4 py-4">
          <p className="text-sm text-[var(--text)]">
            {orgName} — {year}
          </p>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
              Format
            </label>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <label
                  key={f.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border px-3 py-2 text-sm transition-colors ${
                    f.available
                      ? format === f.id
                        ? "border-[var(--teal)] bg-[var(--teal-50)] text-[var(--teal)]"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--text-muted)]"
                      : "cursor-not-allowed border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={f.id}
                    checked={format === f.id}
                    onChange={() => f.available && setFormat(f.id)}
                    disabled={!f.available}
                    className="sr-only"
                  />
                  {f.label}
                  {"note" in f && f.note && (
                    <span className="text-xs text-[var(--text-muted)]">({f.note})</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text)]">
                Sections to include
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs font-semibold text-[var(--teal)] hover:underline"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:underline"
                >
                  None
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSection(s.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    sections.has(s.id)
                      ? "bg-[var(--teal-50)] text-[var(--teal)] ring-1 ring-[var(--teal)]"
                      : "bg-[var(--surface-2)] text-[var(--text-muted)] ring-1 ring-[var(--border)] hover:ring-[var(--text-muted)]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-[var(--radius-sm)] bg-[var(--amber-50)] px-3 py-2 text-sm font-semibold text-[var(--red)]">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[var(--radius-sm)] border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-2)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--teal)] px-4 py-2 text-sm font-bold text-white transition-colors hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden
                  />
                  Generating…
                </>
              ) : (
                "Generate report"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
