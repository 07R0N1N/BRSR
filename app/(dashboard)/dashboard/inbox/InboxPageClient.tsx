"use client";

import { Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CollaborationProvider } from "@/components/CollaborationContext";
import { useOrgMembers } from "../hooks/useOrgMembers";
import { useThreads } from "../hooks/useThreads";
import { InboxClient } from "./InboxClient";

function InboxPageInner({ orgId, reportingYear }: { orgId: string; reportingYear: string }) {
  const router = useRouter();
  const { summaries, refresh } = useThreads(orgId, reportingYear);
  const { members } = useOrgMembers();

  const provider = useMemo(
    () => ({
      onOpen: (blockId: string) => {
        router.push(`/dashboard?thread=${encodeURIComponent(blockId)}`);
      },
    }),
    [router]
  );

  return (
    <CollaborationProvider
      threadSummaries={summaries}
      members={members}
      onActiveBlockIdChange={(blockId) => {
        if (blockId) provider.onOpen(blockId);
      }}
      onRefreshSummaries={refresh}
    >
      <InboxClient orgId={orgId} reportingYear={reportingYear} />
    </CollaborationProvider>
  );
}

export function InboxPageClient(props: { orgId: string; reportingYear: string }) {
  return (
    <Suspense fallback={<p className="text-[var(--text-muted)]">Loading…</p>}>
      <InboxPageInner {...props} />
    </Suspense>
  );
}
