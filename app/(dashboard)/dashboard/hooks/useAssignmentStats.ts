"use client";

import { useCallback, useEffect, useState } from "react";

type StatsRow = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  assigned_count: number;
  completed_count: number;
  completion_pct: number;
};

export type StatsResponse = {
  totals: {
    assigned_count: number;
    completed_count: number;
    completion_pct: number;
  };
  per_user: StatsRow[];
};

export function useAssignmentStats(reportingYear: string) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/assignment-stats?reporting_year=${encodeURIComponent(reportingYear)}`
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to load statistics");
      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load statistics");
    } finally {
      setLoading(false);
    }
  }, [reportingYear]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { stats, loading, error, reload: loadStats };
}
