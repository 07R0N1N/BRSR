import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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

  return (
    <div className="min-h-screen bg-[#0a0f12]">
      <header className="border-b border-[#334155] bg-[#1a202c]">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-white">BRSR Data Collection</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{user.email}</span>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex min-h-[calc(100vh-3.5rem)] flex-col">
        {orgId ? (
          <QuestionnaireShell orgId={orgId} />
        ) : (
          <p className="px-6 py-6 text-gray-400">No organization assigned. Contact your administrator.</p>
        )}
      </main>
    </div>
  );
}
