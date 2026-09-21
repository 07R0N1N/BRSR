"use client";

import { createContext, useContext, type ReactNode } from "react";

type PanelRuntimeContextValue = {
  orgId: string;
  reportingYear: string;
};

const PanelRuntimeContext = createContext<PanelRuntimeContextValue | null>(null);

export function PanelRuntimeProvider({
  orgId,
  reportingYear,
  children,
}: PanelRuntimeContextValue & { children: ReactNode }) {
  return (
    <PanelRuntimeContext.Provider value={{ orgId, reportingYear }}>
      {children}
    </PanelRuntimeContext.Provider>
  );
}

export function usePanelRuntime(): PanelRuntimeContextValue | null {
  return useContext(PanelRuntimeContext);
}
