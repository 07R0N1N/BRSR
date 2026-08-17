"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrganizationsForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [planTier, setPlanTier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, plan_tier: planTier || null }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to create organization");
      return;
    }
    setName("");
    setPlanTier("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-[var(--brand)] px-4 py-2 text-[13px] font-bold text-white hover:bg-[var(--brand-600)]"
      >
        + New organization
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="org-name" className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
          Name
        </label>
        <input
          id="org-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          className="w-52 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-50)]"
          placeholder="Acme Corp"
        />
      </div>
      <div>
        <label htmlFor="org-plan" className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">
          Plan tier
        </label>
        <input
          id="org-plan"
          type="text"
          value={planTier}
          onChange={(e) => setPlanTier(e.target.value)}
          className="w-32 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-50)]"
          placeholder="Growth"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[var(--brand)] px-4 py-2 text-[13px] font-bold text-white hover:bg-[var(--brand-600)] disabled:opacity-50"
      >
        {loading ? "Adding…" : "Add"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="rounded-full border border-[var(--border)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
      >
        Cancel
      </button>
      {error && (
        <p className="w-full text-sm text-[var(--red)]" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
