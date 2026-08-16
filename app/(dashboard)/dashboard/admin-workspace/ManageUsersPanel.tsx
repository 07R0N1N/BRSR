"use client";

import { useRef, useState } from "react";
import { useBulkUserInvite } from "@/lib/hooks/useBulkUserInvite";
import { useOrgUsers } from "../hooks/useOrgUsers";
import { AvatarChip, cardClass, captionClass, ghostBtnClass, userLabel } from "./shared";

const inputClass =
  "w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--ink)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_var(--brand-50)]";

/**
 * Add / remove team members. The CSV/manual add form reuses
 * useBulkUserInvite — the same flow as onboarding's "Invite team" step,
 * calling the same admin-scoped POST /api/onboarding/users. Delete calls
 * DELETE /api/users, which the admin path in that route restricts to
 * "user"-role members of the caller's own org (see app/api/users/route.ts).
 */
export function ManageUsersPanel() {
  const { users, loading: loadingUsers, error: usersError, reload } = useOrgUsers();
  const {
    entries,
    csvError,
    submitError,
    rowErrors,
    loading: submitting,
    handleFile,
    downloadTemplate,
    addRow,
    updateEntry,
    removeEntry,
    submit,
  } = useBulkUserInvite();
  const [isDragging, setIsDragging] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAddSubmit() {
    submit(() => reload());
  }

  async function handleDelete(id: string, label: string) {
    if (!confirm(`Remove "${label}" from your organization? This cannot be undone.`)) return;
    setDeleteError(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(data.error ?? "Failed to remove user");
        return;
      }
      await reload();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className={cardClass}>
        <h2 className="text-xl font-bold text-[var(--ink)]">Add team members</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Upload a CSV or add people one by one. New accounts get the standard user role.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          onClick={() => fileRef.current?.click()}
          className={`mt-5 cursor-pointer rounded-[var(--radius-md)] border-2 border-dashed p-8 text-center transition-colors ${
            isDragging ? "border-[var(--brand)] bg-[var(--brand-50)]" : "border-[var(--border)] hover:border-[var(--text-muted)]"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <p className="text-sm text-[var(--text)]">Upload a CSV file</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            name, email, password columns ·{" "}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                downloadTemplate();
              }}
              className="font-semibold text-[var(--brand)] hover:underline"
            >
              Download template
            </button>
          </p>
          {csvError && <p className="mt-2 text-xs font-semibold text-[var(--red)]">{csvError}</p>}
        </div>

        <div className="mt-5">
          <p className="mb-2 text-center text-xs text-[var(--text-muted)]">or add one by one</p>
          <div className="space-y-3">
            {entries.map((entry, idx) => (
              <div key={idx} className="flex flex-wrap items-start gap-3">
                <div className="min-w-[140px] flex-1">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={entry.name}
                    onChange={(e) => updateEntry(idx, "name", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="min-w-[140px] flex-1">
                  <input
                    type="email"
                    placeholder="Work email"
                    value={entry.email}
                    onChange={(e) => updateEntry(idx, "email", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="min-w-[140px] flex-1">
                  <input
                    type="password"
                    placeholder="Password"
                    value={entry.password}
                    onChange={(e) => updateEntry(idx, "password", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeEntry(idx)}
                  disabled={entries.length === 1}
                  className="mt-0.5 rounded-[var(--radius-sm)] border border-[var(--border)] px-2.5 py-2.5 text-[var(--text-muted)] hover:text-[var(--red)] disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label="Remove row"
                >
                  ✕
                </button>
                {rowErrors[idx] && (
                  <p className="w-full text-xs font-semibold text-[var(--red)]">{rowErrors[idx]}</p>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addRow} className={`mt-3 ${ghostBtnClass}`}>
            + Add row
          </button>
        </div>

        {submitError && (
          <p className="mt-4 text-sm font-semibold text-[var(--red)]">{submitError}</p>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            data-testid="submit-invite-users"
            onClick={handleAddSubmit}
            disabled={submitting}
            className="rounded-[var(--radius-sm)] bg-[var(--brand)] px-[18px] py-2.5 text-sm font-bold text-white hover:bg-[var(--brand-600)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {submitting ? "Adding..." : "Add team members"}
          </button>
        </div>
      </section>

      <section className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-[var(--ink)]">Team members</h2>
          {deleteError && <p className="text-sm font-semibold text-[var(--red)]">{deleteError}</p>}
        </div>

        {loadingUsers ? (
          <p className="mt-5 text-sm text-[var(--text-muted)]">Loading team members...</p>
        ) : usersError ? (
          <p className="mt-5 text-sm font-semibold text-[var(--red)]">{usersError}</p>
        ) : users.length === 0 ? (
          <p className="mt-5 text-sm text-[var(--text-muted)]">No team members yet. Add one above.</p>
        ) : (
          <div className="mt-5 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-soft)]">
            <table className="min-w-full border-collapse">
              <thead className="bg-[var(--surface-2)]">
                <tr>
                  <th className={`px-4 py-2.5 text-left ${captionClass}`}>User</th>
                  <th className={`px-4 py-2.5 text-left ${captionClass}`}>Email</th>
                  <th className={`px-4 py-2.5 text-right ${captionClass}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const label = userLabel(u);
                  return (
                    <tr key={u.id} className="border-t border-[var(--border-soft)]">
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center gap-2.5 font-semibold text-[var(--ink)]">
                          <AvatarChip seed={u.id} label={label} />
                          {label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text)]">{u.email ?? "—"}</td>
                      <td className="px-4 py-3 text-right text-sm">
                        <button
                          type="button"
                          data-testid={`remove-user-${u.id}`}
                          onClick={() => handleDelete(u.id, label)}
                          disabled={deletingId === u.id}
                          className="font-semibold text-[var(--red)] hover:underline disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          {deletingId === u.id ? "Removing..." : "Remove"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
