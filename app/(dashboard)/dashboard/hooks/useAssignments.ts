"use client";

import { useCallback, useEffect, useState } from "react";

export function useAssignments(selectedUserId: string) {
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadAssignments = useCallback(async () => {
    if (!selectedUserId) {
      setSelectedCodes(new Set());
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/assignments?user_id=${encodeURIComponent(selectedUserId)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to load assignments");
      setSelectedCodes(
        new Set<string>(Array.isArray(data.assigned_question_codes) ? data.assigned_question_codes : [])
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  }, [selectedUserId]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const toggleBlock = useCallback((questionCodes: string[]) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      const allSelected = questionCodes.every((code) => next.has(code));
      if (allSelected) {
        questionCodes.forEach((code) => next.delete(code));
      } else {
        questionCodes.forEach((code) => next.add(code));
      }
      return next;
    });
  }, []);

  const confirmAssignments = useCallback(
    async (onSuccess?: () => void) => {
      if (!selectedUserId) return;
      setSaving(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await fetch("/api/assignments", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: selectedUserId,
            question_codes: Array.from(selectedCodes),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "Failed to save assignments");
        setSuccess("Assignments updated.");
        onSuccess?.();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save assignments");
      } finally {
        setSaving(false);
      }
    },
    [selectedCodes, selectedUserId]
  );

  return { selectedCodes, loading, saving, error, success, toggleBlock, confirmAssignments };
}
