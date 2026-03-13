import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountDropdown } from "../AccountDropdown";
import { AdminWorkspaceClient } from "./AdminWorkspaceClient";

function getRoleSlug(roles: { slug: string } | { slug: string }[] | null | undefined) {
  return Array.isArray(roles) ? roles[0]?.slug : roles?.slug;
}

export default async function AdminWorkspacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id, roles(slug)")
    .eq("id", user.id)
    .single();

  const profileData = profile as { org_id: string | null; roles?: { slug: string } | { slug: string }[] } | null;
  const roleSlug = getRoleSlug(profileData?.roles ?? null);
  const orgId = profileData?.org_id ?? null;
  if (roleSlug !== "admin" || !orgId) {
    redirect("/dashboard");
  }

  const [{ data: users }, { data: org }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, display_name")
      .eq("org_id", orgId)
      .order("email"),
    supabase
      .from("organizations")
      .select("name")
      .eq("id", orgId)
      .single(),
  ]);

  const orgName = (org as { name?: string } | null)?.name ?? "Organization";

  return (
    <div className="min-h-screen bg-[#0a0f12]">
      <header className="border-b border-[#334155] bg-[#1a202c]">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="rounded border border-[#334155] px-2 py-1 text-xs text-gray-300 hover:bg-white/10">
              Back
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-white">Admin Workspace</h1>
              <p className="text-xs text-gray-400">{orgName}</p>
            </div>
          </div>
          <AccountDropdown email={user.email} roleSlug={roleSlug} />
        </div>
      </header>

      <main className="brsr-dark p-6">
        <AdminWorkspaceClient users={users ?? []} />
      </main>
    </div>
  );
}
