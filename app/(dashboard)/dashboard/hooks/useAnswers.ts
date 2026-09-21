"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AnswersState } from "@/lib/brsr/types";
import {
  computeAllowedBlockPrefixes,
  isQuestionCodeAllowedForRestrictedUser,
} from "@/lib/brsr/blockAccessPrefixes";
import { flowGeneralDataToPrinciple6 } from "@/lib/brsr/flowGeneralDataToP6";
import { SAVE_DEBOUNCE_MS } from "@/lib/brsr/constants";
import { buildDirtyAnswersPayload } from "@/lib/brsr/dirtyAnswerSave";
import { createClient } from "@/lib/supabase/client";
import type { AnswerMeta } from "@/app/api/answers/route";

const GDATA_KEYS = ["gdata_turnover_cy", "gdata_turnover_py", "gdata_ppp_cy", "gdata_ppp_py"];

export type { AnswerMeta };

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
  const [answerMeta, setAnswerMeta] = useState<Record<string, AnswerMeta>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const answersRef = useRef<AnswersState>(answers);
  answersRef.current = answers;
  const dirtyRef = useRef<Set<string>>(new Set());
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentUserIdRef = useRef<string | null>(null);

  const allowedBlockPrefixes = useMemo(
    () => (allowedSet ? computeAllowedBlockPrefixes(allowedSet) : undefined),
    [allowedSet]
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!cancelled) currentUserIdRef.current = user?.id ?? null;
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
      setAnswerMeta(data.meta ?? {});
      dirtyRef.current.clear();
    } finally {
      setLoading(false);
    }
  }, [orgId, reportingYear]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async () => {
    if (!orgId || !reportingYear) return;
    const dirtyCodes = Array.from(dirtyRef.current);
    if (dirtyCodes.length === 0) return;

    const current = answersRef.current;
    const payload = buildDirtyAnswersPayload(dirtyRef.current, current);
    if (Object.keys(payload).length === 0) return;

    setSaving(true);
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org_id: orgId, reporting_year: reportingYear, answers: payload }),
      });
      if (!res.ok) throw new Error("Failed to save");

      // Clear only the codes we just saved (new edits during the request stay dirty).
      for (const code of dirtyCodes) {
        dirtyRef.current.delete(code);
      }

      const uid = currentUserIdRef.current;
      const now = new Date().toISOString();
      setAnswerMeta((prev) => {
        const next = { ...prev };
        for (const code of dirtyCodes) {
          next[code] = { updated_by: uid, updated_at: now };
        }
        return next;
      });
    } finally {
      setSaving(false);
    }
  }, [orgId, reportingYear]);

  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveTimeoutRef.current = null;
      void save();
    }, SAVE_DEBOUNCE_MS);
  }, [save]);

  const onChange = useCallback(
    (questionCode: string, value: string) => {
      if (
        allowedSet &&
        !isQuestionCodeAllowedForRestrictedUser(questionCode, allowedSet, allowedBlockPrefixes)
      ) {
        return;
      }
      setAnswers((prev) => {
        const next = { ...prev, [questionCode]: value };
        dirtyRef.current.add(questionCode);
        if (GDATA_KEYS.includes(questionCode)) {
          const p6Updates = flowGeneralDataToPrinciple6(next);
          if (allowedSet) {
            for (const [code, codeValue] of Object.entries(p6Updates)) {
              if (isQuestionCodeAllowedForRestrictedUser(code, allowedSet, allowedBlockPrefixes)) {
                next[code] = codeValue ?? "";
                dirtyRef.current.add(code);
              }
            }
          } else {
            for (const code of Object.keys(p6Updates)) {
              dirtyRef.current.add(code);
            }
            Object.assign(next, p6Updates);
          }
        }
        return next;
      });
      scheduleSave();
    },
    [allowedSet, allowedBlockPrefixes, scheduleSave]
  );

  return { answers, answerMeta, loading, saving, onChange };
}
