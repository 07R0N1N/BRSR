"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RolesForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function slugFromName(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setName(v);
    if (!slug || slug === slugFromName(name)) setSlug(slugFromName(v));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const s = slug.trim() || slugFromName(name);
    if (!s) {
      setError("Name or slug is required");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() || s, slug: s }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to create role");
      return;
    }
    setName("");
    setSlug("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-wrap items-end gap-4">
      <div>
        <label htmlFor="role-name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="role-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          className="mt-1 block w-48 rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Auditor"
        />
      </div>
      <div>
        <label htmlFor="role-slug" className="block text-sm font-medium text-gray-700">
          Slug
        </label>
        <input
          id="role-slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-1 block w-40 rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="auditor"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Adding…" : "Add role"}
      </button>
      {error && (
        <p className="w-full text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
