"use client";

import { useState } from "react";
import { normalizeEmail, normalizePassword } from "@/lib/auth/normalize";

export type BulkInviteEntry = { name: string; email: string; password: string };
export type InvitedUser = { id: string; email: string | null; display_name: string | null };

const EMPTY_ENTRY: BulkInviteEntry = { name: "", email: "", password: "" };

/**
 * Shared CSV/manual bulk-invite flow for POST /api/onboarding/users
 * (admin-only; server infers org from the caller's own profile and always
 * creates role="user" — safe to call both during onboarding and after launch).
 * Used by onboarding's "Invite team" step and Admin Workspace's Manage Users
 * tab so both surfaces share one upload/parse/submit implementation instead
 * of duplicating it.
 */
export function useBulkUserInvite() {
  const [entries, setEntries] = useState<BulkInviteEntry[]>([{ ...EMPTY_ENTRY }]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  function parseCSV(text: string): BulkInviteEntry[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length === 0) return [];
    const header = lines[0].toLowerCase().split(",").map((h) => h.trim());
    const nameIdx = header.indexOf("name");
    const emailIdx = header.indexOf("email");
    const passIdx = header.indexOf("password");
    if (emailIdx === -1 || passIdx === -1) {
      throw new Error("CSV must have 'email' and 'password' columns");
    }
    return lines
      .slice(1)
      .map((line) => {
        const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        return {
          name: nameIdx !== -1 ? (cols[nameIdx] ?? "") : "",
          email: normalizeEmail(cols[emailIdx]),
          password: normalizePassword(cols[passIdx]),
        };
      })
      .filter((e) => e.email);
  }

  function handleFile(file: File) {
    setCsvError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = parseCSV(ev.target?.result as string);
        if (parsed.length === 0) {
          setCsvError("No valid rows found in CSV");
          return;
        }
        setEntries(parsed);
      } catch (e) {
        setCsvError(e instanceof Error ? e.message : "Failed to parse CSV");
      }
    };
    reader.readAsText(file);
  }

  function downloadTemplate() {
    const csv = "name,email,password\nJohn Doe,john@example.com,securepassword123\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "team-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function addRow() {
    setEntries((prev) => [...prev, { ...EMPTY_ENTRY }]);
  }

  function updateEntry(idx: number, field: keyof BulkInviteEntry, value: string) {
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  }

  function removeEntry(idx: number) {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
  }

  function reset() {
    setEntries([{ ...EMPTY_ENTRY }]);
    setCsvError(null);
    setSubmitError(null);
    setRowErrors({});
  }

  /** Posts valid entries, reports per-row errors, and resets the form on full success. */
  async function submit(onSuccess: (users: InvitedUser[]) => void) {
    setSubmitError(null);
    setRowErrors({});
    const valid = entries.filter((e) => e.email.trim());
    if (valid.length === 0) {
      setSubmitError("Add at least one team member");
      return;
    }
    setLoading(true);
    const payload = valid.map((e) => ({
      email: normalizeEmail(e.email),
      password: normalizePassword(e.password),
      display_name: e.name.trim() || null,
    }));
    try {
      const res = await fetch("/api/onboarding/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok && res.status !== 207) {
        setSubmitError(data.error ?? "Failed to add users");
        return;
      }
      const results = (data.results ?? []) as {
        email: string;
        ok: boolean;
        error?: string;
        user_id?: string;
      }[];
      const errs: Record<number, string> = {};
      results.forEach((r, i) => {
        if (!r.ok) errs[i] = r.error ?? "Failed";
      });
      if (Object.keys(errs).length > 0) {
        setRowErrors(errs);
        return;
      }
      const addedUsers: InvitedUser[] = results
        .filter((r) => r.ok && r.user_id)
        .map((r, i) => ({ id: r.user_id!, email: r.email, display_name: payload[i].display_name ?? null }));
      onSuccess(addedUsers);
      reset();
    } finally {
      setLoading(false);
    }
  }

  return {
    entries,
    csvError,
    submitError,
    rowErrors,
    loading,
    handleFile,
    downloadTemplate,
    addRow,
    updateEntry,
    removeEntry,
    reset,
    submit,
  };
}
