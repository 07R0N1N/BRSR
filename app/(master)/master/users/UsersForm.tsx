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
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    router.refresh();
  }

  const inputClass =
    "rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-50)]";
  const labelClass = "mb-1 block text-xs font-semibold text-[var(--text-muted)]";

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-[var(--brand)] px-4 py-2 text-[13px] font-bold text-white hover:bg-[var(--brand-600)]"
      >
        + New user
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="flex flex-wrap gap-3">
        <div>
          <label htmlFor="user-email" className={labelClass}>
            Email
          </label>
          <input
            id="user-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className={`w-56 ${inputClass}`}
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label htmlFor="user-password" className={labelClass}>
            Password
          </label>
          <input
            id="user-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={`w-40 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="user-org" className={labelClass}>
            Organization
          </label>
          <select id="user-org" value={orgId} onChange={(e) => setOrgId(e.target.value)} className={`w-48 ${inputClass}`}>
            <option value="">— None (Master) —</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="user-role" className={labelClass}>
            Role
          </label>
          <select
            id="user-role"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
            className={`w-36 ${inputClass}`}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[var(--brand)] px-4 py-2 text-[13px] font-bold text-white hover:bg-[var(--brand-600)] disabled:opacity-50"
        >
          {loading ? "Adding…" : "Add user"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-[var(--border)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
        >
          Cancel
        </button>
        {error && (
          <p className="text-sm text-[var(--red)]" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
