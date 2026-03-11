"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserDeleteButton({
  userId,
  email,
  roleSlug,
  currentUserId,
}: {
  userId: string;
  email: string;
  roleSlug: string;
  currentUserId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (roleSlug === "master" || roleSlug === "admin") {
    return null;
  }
  if (userId === currentUserId) {
    return null;
  }

  async function handleDelete() {
    if (!confirm(`Delete user "${email}"? This cannot be undone.`)) return;
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/users?id=${encodeURIComponent(userId)}`, { method: "DELETE" });
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
