"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Org = { id: string; name: string };
type Role = { id: string; name: string; slug: string };

export function UsersForm({
  organizations,
  roles,
}: {
  organizations: Org[];
  roles: Role[];
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgId, setOrgId] = useState("");
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        password,
        org_id: orgId || null,
        role_id: roleId,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to create user");
      return;
    }
    setEmail("");
    setPassword("");
    setOrgId("");
    setRoleId(roles[0]?.id ?? "");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="user-email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="user-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-64 rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label htmlFor="user-password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="user-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="mt-1 block w-48 rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="user-org" className="block text-sm font-medium text-gray-700">
            Organization
          </label>
          <select
            id="user-org"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            className="mt-1 block w-56 rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">— None (Master) —</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="user-role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="user-role"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
            className="mt-1 block w-40 rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Adding…" : "Add user"}
        </button>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
