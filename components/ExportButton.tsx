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
        className="flex items-center gap-1.5 rounded-md border border-[#334155] bg-[#0f172a] px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
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
