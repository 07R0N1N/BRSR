"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type PanelSectionContextValue = {
  registerBlock: (blockId: string) => () => void;
  blockIds: string[];
};

export const PanelSectionContext = createContext<PanelSectionContextValue | null>(null);

export function PanelSectionProvider({ children }: { children: ReactNode }) {
  const [blockIds, setBlockIds] = useState<string[]>([]);

  const registerBlock = useCallback((blockId: string) => {
    setBlockIds((prev) => (prev.includes(blockId) ? prev : [...prev, blockId]));
    return () => {
      setBlockIds((prev) => prev.filter((id) => id !== blockId));
    };
  }, []);

  const value = useMemo(() => ({ registerBlock, blockIds }), [registerBlock, blockIds]);

  return (
    <PanelSectionContext.Provider value={value}>{children}</PanelSectionContext.Provider>
  );
}

export function usePanelSectionBlocks(): string[] {
  return useContext(PanelSectionContext)?.blockIds ?? [];
}

export function usePanelSectionRegister(): PanelSectionContextValue["registerBlock"] | null {
  return useContext(PanelSectionContext)?.registerBlock ?? null;
}
