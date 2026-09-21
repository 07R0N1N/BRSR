"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CollaborationProvider,
  type AnswerMeta,
} from "@/components/CollaborationContext";
import { ChatPanel } from "./chat/ChatPanel";
import { QuestionnaireShell } from "./QuestionnaireShell";
import { useOrgMembers } from "./hooks/useOrgMembers";
import { useThreads } from "./hooks/useThreads";

type Props = {
  orgId: string;
  reportingYear: string;
  canViewAll?: boolean;
  allowedQuestionCodes?: string[] | null;
  roleSlug?: string | null;
};

function DashboardClientInner({
  orgId,
  reportingYear,
  canViewAll,
  allowedQuestionCodes,
  roleSlug,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const threadParam = searchParams.get("thread");

  const [drawerOpen, setDrawerOpen] = useState(Boolean(threadParam));
  const [activeBlockId, setActiveBlockId] = useState<string | null>(threadParam);
  const [answerMeta, setAnswerMeta] = useState<Record<string, AnswerMeta>>({});

  const { summaries, refresh: refreshSummaries } = useThreads(orgId, reportingYear);
  const { members } = useOrgMembers();

  const membersById = useMemo(() => {
    const map: Record<string, (typeof members)[number]> = {};
    for (const m of members) map[m.id] = m;
    return map;
  }, [members]);

  const syncThreadParam = useCallback(
    (blockId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (blockId) params.set("thread", blockId);
      else params.delete("thread");
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    },
    [router, searchParams]
  );

  const handleActiveBlockIdChange = useCallback(
    (blockId: string | null) => {
      setActiveBlockId(blockId);
      if (blockId) {
        setDrawerOpen(true);
        syncThreadParam(blockId);
      } else {
        setDrawerOpen(false);
        syncThreadParam(null);
      }
    },
    [syncThreadParam]
  );

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setActiveBlockId(null);
    syncThreadParam(null);
  }, [syncThreadParam]);

  useEffect(() => {
    if (threadParam) {
      setDrawerOpen(true);
      setActiveBlockId(threadParam);
    }
  }, [threadParam]);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    if (drawerOpen) main.setAttribute("data-drawer-open", "");
    else main.removeAttribute("data-drawer-open");
  }, [drawerOpen]);

  return (
    <CollaborationProvider
      threadSummaries={summaries}
      answerMeta={answerMeta}
      members={members}
      activeBlockId={activeBlockId}
      onActiveBlockIdChange={handleActiveBlockIdChange}
      onRefreshSummaries={refreshSummaries}
      suggestionsEnabled={false}
    >
      <div className="flex w-full min-w-0 flex-1 gap-4">
        <div className="min-w-0 flex-1">
          <QuestionnaireShell
            orgId={orgId}
            reportingYear={reportingYear}
            canViewAll={canViewAll}
            allowedQuestionCodes={allowedQuestionCodes}
            onAnswerMetaChange={setAnswerMeta}
          />
        </div>
        <ChatPanel
          orgId={orgId}
          reportingYear={reportingYear}
          roleSlug={roleSlug}
          open={drawerOpen}
          onClose={handleCloseDrawer}
          activeBlockId={activeBlockId}
          membersById={membersById}
          onRefreshSummaries={refreshSummaries}
        />
      </div>
    </CollaborationProvider>
  );
}

export function DashboardClient(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <span className="text-[var(--text-muted)]">Loading…</span>
        </div>
      }
    >
      <DashboardClientInner {...props} />
    </Suspense>
  );
}
