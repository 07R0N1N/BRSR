"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThreadSummary = {
  commentCount: number;
  unreadCount: number;
  hasNote: boolean;
  attachmentCount: number;
  resolved: boolean;
};

export type OrgMember = {
  id: string;
  email: string | null;
  display_name: string | null;
  role_slug: string | null;
};

export type AnswerMeta = {
  updated_by: string | null;
  updated_at: string | null;
};

type CollaborationContextValue = {
  /** blockId → thread summary (from GET /api/threads) */
  threadSummaries: Record<string, ThreadSummary>;
  /** question_code → authorship meta */
  answerMeta: Record<string, AnswerMeta>;
  /** org members keyed by id (includes admins) */
  membersById: Record<string, OrgMember>;
  /** Currently open block in the activity drawer */
  activeBlockId: string | null;
  openThread: (blockId: string) => void;
  closeThread: () => void;
  /** Suggestions tab reserved for future benchmarking (point 4) */
  suggestionsEnabled: boolean;
  /** Refetch thread summaries after note/comment mutations */
  refreshSummaries?: () => void;
};

const CollaborationContext = createContext<CollaborationContextValue | null>(null);

export function CollaborationProvider({
  children,
  threadSummaries = {},
  answerMeta = {},
  members = [],
  suggestionsEnabled = false,
  activeBlockId: controlledActive,
  onActiveBlockIdChange,
  onRefreshSummaries,
}: {
  children: ReactNode;
  threadSummaries?: Record<string, ThreadSummary>;
  answerMeta?: Record<string, AnswerMeta>;
  members?: OrgMember[];
  suggestionsEnabled?: boolean;
  activeBlockId?: string | null;
  onActiveBlockIdChange?: (blockId: string | null) => void;
  onRefreshSummaries?: () => void;
}) {
  const [uncontrolledActive, setUncontrolledActive] = useState<string | null>(null);
  const activeBlockId = controlledActive !== undefined ? controlledActive : uncontrolledActive;

  const setActive = useCallback(
    (blockId: string | null) => {
      if (onActiveBlockIdChange) onActiveBlockIdChange(blockId);
      else setUncontrolledActive(blockId);
    },
    [onActiveBlockIdChange]
  );

  const membersById = useMemo(() => {
    const map: Record<string, OrgMember> = {};
    for (const m of members) map[m.id] = m;
    return map;
  }, [members]);

  const value = useMemo<CollaborationContextValue>(
    () => ({
      threadSummaries,
      answerMeta,
      membersById,
      activeBlockId,
      openThread: (blockId: string) => setActive(blockId),
      closeThread: () => setActive(null),
      suggestionsEnabled,
      refreshSummaries: onRefreshSummaries,
    }),
    [
      threadSummaries,
      answerMeta,
      membersById,
      activeBlockId,
      setActive,
      suggestionsEnabled,
      onRefreshSummaries,
    ]
  );

  return <CollaborationContext.Provider value={value}>{children}</CollaborationContext.Provider>;
}

export function useCollaboration(): CollaborationContextValue {
  const ctx = useContext(CollaborationContext);
  if (!ctx) {
    return {
      threadSummaries: {},
      answerMeta: {},
      membersById: {},
      activeBlockId: null,
      openThread: () => {},
      closeThread: () => {},
      suggestionsEnabled: false,
    };
  }
  return ctx;
}
