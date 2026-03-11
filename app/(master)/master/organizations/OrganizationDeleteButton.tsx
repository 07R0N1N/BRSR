"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrganizationDeleteButton({
  orgId,
  name,
}: {
  orgId: string;
  name: string;
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
    router.refresh();
  }

  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50"
      >
        {loading ? "Deleting…" : "Delete"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
