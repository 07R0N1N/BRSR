"use client";

import { useCallback, useEffect, useState } from "react";

/** Org-wide assigned codes (any user). Independent of the Assign tab's selected user. */
export function useAssignmentCoverage(reportingYear: string) {
  const [assignedCodes, setAssignedCodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCoverage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/assignment-coverage?reporting_year=${encodeURIComponent(reportingYear)}`
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to load assignment coverage");
      setAssignedCodes(
        new Set<string>(Array.isArray(data.assigned_question_codes) ? data.assigned_question_codes : [])
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load assignment coverage");
    } finally {
      setLoading(false);
    }
  }, [reportingYear]);

  useEffect(() => {
    loadCoverage();
  }, [loadCoverage]);

  return { assignedCodes, loading, error, reload: loadCoverage };
}
