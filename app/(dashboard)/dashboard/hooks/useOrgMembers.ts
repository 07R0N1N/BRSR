"use client";

import { useEffect, useState } from "react";
import type { OrgMember } from "@/components/CollaborationContext";

export function useOrgMembers() {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/org-members");
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "Failed to load members");
        if (!cancelled) {
          setMembers(Array.isArray(data.users) ? (data.users as OrgMember[]) : []);
        }
      } catch {
        if (!cancelled) setMembers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { members, loading };
}
