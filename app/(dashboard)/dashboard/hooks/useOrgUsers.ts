"use client";

import { useCallback, useEffect, useState } from "react";

export type OrgUser = { id: string; email: string | null; display_name: string | null };

/**
 * Org roster for the Admin Workspace Manage Users tab. Reuses GET
 * /api/assignments without `user_id` — that route already scopes to the
 * caller's org and excludes admin/master profiles, so this is the same
 * assignable-user list the Assign tab uses, not a second source of truth.
 */
export function useOrgUsers() {
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assignments");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to load users");
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { users, loading, error, reload };
}
