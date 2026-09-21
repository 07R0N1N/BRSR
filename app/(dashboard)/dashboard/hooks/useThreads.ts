"use client";

import { useCallback, useEffect, useState } from "react";
import type { ThreadSummary } from "@/components/CollaborationContext";

export function useThreads(orgId: string | null, reportingYear: string | null) {
  const [summaries, setSummaries] = useState<Record<string, ThreadSummary>>({});
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!orgId || !reportingYear) {
      setSummaries({});
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        org_id: orgId,
        reporting_year: reportingYear,
      });
      const res = await fetch(`/api/threads?${params.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to load threads");
      setSummaries((data.threads ?? {}) as Record<string, ThreadSummary>);
    } catch {
      setSummaries({});
    } finally {
      setLoading(false);
    }
  }, [orgId, reportingYear]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { summaries, loading, refresh };
}
