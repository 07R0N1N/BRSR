"use client";

import { useState } from "react";
import { ExportModal } from "./ExportModal";

export function ExportButton({
  orgId,
  year,
  orgName,
}: {
  orgId: string;
  year: string;
  orgName: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition-colors hover:border-[var(--teal)] hover:bg-[var(--teal-50)] hover:text-[var(--teal)] focus:outline-none focus:shadow-[0_0_0_3px_var(--brand-50)]"
      >
        <span aria-hidden>📥</span>
        Export BRSR
      </button>
      <ExportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        orgId={orgId}
        year={year}
        orgName={orgName}
      />
    </>
  );
}
