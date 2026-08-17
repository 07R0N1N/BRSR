"use client";

import { useMemo, useState } from "react";
import { UserDeleteButton } from "./UserDeleteButton";

export type UserRow = {
  id: string;
  email: string;
  org_name: string | null;
  role_name: string;
  role_slug: string;
};

export function UsersTable({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const [query, setQuery] = useState("");
  const [org, setOrg] = useState("all");
  const [role, setRole] = useState("all");

  const orgs = useMemo(
    () => Array.from(new Set(users.map((u) => u.org_name).filter((n): n is string => !!n))).sort(),
    [users]
  );
  const roles = useMemo(() => Array.from(new Set(users.map((u) => u.role_name))).sort(), [users]);

  const filtered = users.filter((u) => {
    if (org !== "all" && u.org_name !== org) return false;
    if (role !== "all" && u.role_name !== role) return false;
    if (query.trim() && !u.email.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--text-muted)]" aria-hidden>
            ⌕
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email…"
            className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] py-2 pl-8 pr-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-50)]"
          />
        </div>
        <select
          aria-label="Filter by organization"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--text)]"
        >
          <option value="all">All organizations</option>
          {orgs.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--text)]"
        >
          <option value="all">All roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Email", "Organization", "Role", "Actions"].map((h) => (
              <th
                key={h}
                className="border-b border-[var(--border-soft)] px-3 py-2.5 text-left text-[11.5px] font-semibold uppercase tracking-wide text-[var(--text-muted)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id} className="hover:bg-[var(--surface-2)]">
              <td className="border-b border-[var(--border-soft)] px-3 py-2.5 text-[13px] font-bold text-[var(--ink)]">
                {u.email}
              </td>
              <td className="border-b border-[var(--border-soft)] px-3 py-2.5 text-[13px] text-[var(--text)]">
                {u.org_name ?? "—"}
              </td>
              <td className="border-b border-[var(--border-soft)] px-3 py-2.5 text-[13px] text-[var(--text)]">
                {u.role_name}
              </td>
              <td className="border-b border-[var(--border-soft)] px-3 py-2.5 text-[13px]">
                <UserDeleteButton
                  userId={u.id}
                  email={u.email}
                  roleSlug={u.role_slug}
                  currentUserId={currentUserId}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <p className="p-6 text-center text-sm text-[var(--text-muted)]">No users match these filters.</p>
      )}
    </div>
  );
}
