"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AnswersState } from "@/lib/brsr/types";
import { flowGeneralDataToPrinciple6 } from "@/lib/brsr/flowGeneralDataToP6";
import { SAVE_DEBOUNCE_MS } from "@/lib/brsr/constants";

const GDATA_KEYS = ["gdata_turnover_cy", "gdata_turnover_py", "gdata_ppp_cy", "gdata_ppp_py"];

export function useAnswers({
  orgId,
  reportingYear,
  allowedSet,
}: {
  orgId: string;
  reportingYear: string;
  allowedSet: Set<string> | null;
}) {
  const [answers, setAnswers] = useState<AnswersState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const answersRef = useRef<AnswersState>(answers);
  answersRef.current = answers;
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    if (!orgId || !reportingYear) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/answers?org_id=${encodeURIComponent(orgId)}&reporting_year=${encodeURIComponent(reportingYear)}`
      );
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setAnswers(data.answers ?? {});
    } finally {
      setLoading(false);
    }
  }, [orgId, reportingYear]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async () => {
    const current = answersRef.current;
    if (!orgId || !reportingYear) return;
    setSaving(true);
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org_id: orgId, reporting_year: reportingYear, answers: current }),
      });
      if (!res.ok) throw new Error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [orgId, reportingYear]);

  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveTimeoutRef.current = null;
      save();
    }, SAVE_DEBOUNCE_MS);
  }, [save]);

  const onChange = useCallback(
    (questionCode: string, value: string) => {
      if (allowedSet && !allowedSet.has(questionCode)) return;
      setAnswers((prev) => {
        const next = { ...prev, [questionCode]: value };
        if (GDATA_KEYS.includes(questionCode)) {
          const p6Updates = flowGeneralDataToPrinciple6(next);
          if (allowedSet) {
            for (const [code, codeValue] of Object.entries(p6Updates)) {
              if (allowedSet.has(code)) next[code] = codeValue ?? "";
            }
          } else {
            Object.assign(next, p6Updates);
          }
        }
        return next;
      });
      scheduleSave();
    },
    [allowedSet, scheduleSave]
  );

  return { answers, loading, saving, onChange };
}
