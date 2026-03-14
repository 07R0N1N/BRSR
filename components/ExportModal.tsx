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
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-[#334155] bg-[#1a202c] shadow-xl">
        <div className="flex items-center justify-between border-b border-[#334155] px-4 py-3">
          <h2 id="export-modal-title" className="text-lg font-semibold text-white">
            Export BRSR Report
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 px-4 py-4">
          <p className="text-sm text-gray-300">
            {orgName} — {year}
          </p>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Format
            </label>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <label
                  key={f.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                    f.available
                      ? format === f.id
                        ? "border-teal-500 bg-teal-500/20 text-teal-300"
                        : "border-[#334155] bg-[#0f172a] text-gray-300 hover:border-[#475569]"
                      : "cursor-not-allowed border-[#334155] bg-[#0f172a]/50 text-gray-500"
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
                    <span className="text-xs text-gray-500">({f.note})</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">
                Sections to include
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs text-teal-400 hover:underline"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="text-xs text-gray-400 hover:underline"
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
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    sections.has(s.id)
                      ? "bg-teal-500/30 text-teal-200 ring-1 ring-teal-500/50"
                      : "bg-[#0f172a] text-gray-500 ring-1 ring-[#334155] hover:ring-[#475569]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded bg-red-500/20 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#334155] px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-500 disabled:opacity-60"
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
