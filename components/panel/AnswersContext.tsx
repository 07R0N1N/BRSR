"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AnswersState } from "@/lib/brsr/types";

type AnswersContextValue = {
  answers: AnswersState;
  onChange: (code: string, value: string) => void;
};

const AnswersContext = createContext<AnswersContextValue | null>(null);

export function AnswersProvider({
  answers,
  onChange,
  children,
}: AnswersContextValue & { children: ReactNode }) {
  return (
    <AnswersContext.Provider value={{ answers, onChange }}>
      {children}
    </AnswersContext.Provider>
  );
}

export function usePanelAnswers(): AnswersContextValue {
  const ctx = useContext(AnswersContext);
  if (!ctx) {
    throw new Error("usePanelAnswers must be used within AnswersProvider");
  }
  return ctx;
}

/** Returns null when outside AnswersProvider (e.g. tests). */
export function usePanelAnswersOptional(): AnswersContextValue | null {
  return useContext(AnswersContext);
}

/** A question is "answered" when it has a non-empty trimmed value. */
export function isQuestionAnswered(value: string | undefined): boolean {
  return (value ?? "").trim().length > 0;
}
