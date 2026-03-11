"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrganizationsForm() {
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
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-wrap items-end gap-4">
      <div>
        <label htmlFor="org-name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="org-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-64 rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Acme Corp"
        />
      </div>
      <div>
        <label htmlFor="org-plan" className="block text-sm font-medium text-gray-700">
          Plan tier (optional)
        </label>
        <input
          id="org-plan"
          type="text"
          value={planTier}
          onChange={(e) => setPlanTier(e.target.value)}
          className="mt-1 block w-40 rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="basic"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Adding…" : "Add organization"}
      </button>
      {error && (
        <p className="w-full text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
