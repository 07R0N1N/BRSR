"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrganizationDeleteButton({
  orgId,
  name,
  redirectTo,
}: {
  orgId: string;
  name: string;
  /** If set, navigate here on success instead of just refreshing (e.g. org detail page → back to the list). */
  redirectTo?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete organization "${name}"? Users in this org will have their org cleared.`)) return;
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/organizations?id=${encodeURIComponent(orgId)}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to delete");
      return;
    }
    if (redirectTo) router.push(redirectTo);
    else router.refresh();
  }

  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded-full border border-[var(--red)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--red)] hover:bg-[var(--red-50)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Deleting…" : "Delete organization"}
      </button>
      {error && <span className="text-xs text-[var(--red)]">{error}</span>}
    </span>
  );
}
