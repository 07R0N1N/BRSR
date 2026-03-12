import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountDropdown } from "./AccountDropdown";
import { QuestionnaireShell } from "./QuestionnaireShell";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  const orgId = (profile as { org_id: string | null } | null)?.org_id ?? null;

  let orgName: string | null = null;
  if (orgId) {
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", orgId)
      .single();
    orgName = (org as { name?: string } | null)?.name ?? null;
  }

  return (
    <div className="min-h-screen bg-[#0a0f12]">
      <header className="border-b border-[#334155] bg-[#1a202c]">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none" aria-hidden>📊</span>
              <h1 className="text-lg font-semibold text-white">BRSR Data Collection</h1>
            </div>
            <span className="text-xs text-gray-300/70">{orgName ?? "—"}</span>
          </div>
          <AccountDropdown email={user.email} />
        </div>
      </header>
      <main className="flex min-h-[calc(100vh-4rem)] flex-col">
        {orgId ? (
          <QuestionnaireShell orgId={orgId} />
        ) : (
          <p className="px-6 py-6 text-gray-400">No organization assigned. Contact your administrator.</p>
        )}
      </main>
    </div>
  );
}
