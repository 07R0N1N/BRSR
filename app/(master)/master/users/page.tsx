import { createClient } from "@/lib/supabase/server";
import { UsersForm } from "./UsersForm";
import { UsersTable, type UserRow } from "./UsersTable";

export default async function UsersPage() {
  const supabase = await createClient();
  const [{ data: profiles }, { data: organizations }, { data: roles }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, display_name, org_id, role_id, organizations(name), roles(name, slug)")
      .order("email"),
    supabase.from("organizations").select("id, name").order("name"),
    supabase.from("roles").select("id, name, slug").order("slug"),
  ]);

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const users: UserRow[] = (profiles ?? []).map((p) => {
    const r = p.roles as { name: string; slug: string } | { name: string; slug: string }[] | null;
    const roleObj = Array.isArray(r) ? r[0] : r;
    const org = p.organizations as { name: string } | { name: string }[] | null;
    const orgName = Array.isArray(org) ? org[0]?.name : org?.name;
    return {
      id: p.id,
      email: p.email,
      org_name: orgName ?? null,
      role_name: roleObj?.name ?? "—",
      role_slug: roleObj?.slug ?? "",
    };
  });

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-bold text-[var(--ink)]">Users</h2>
          <p className="mt-0.5 text-[12.5px] text-[var(--text-muted)]">
            Search across all organizations. For an org&apos;s full roster, open it from Organizations.
          </p>
        </div>
        <UsersForm organizations={organizations ?? []} roles={roles ?? []} />
      </div>
      <UsersTable users={users} currentUserId={currentUser?.id ?? ""} />
    </div>
  );
}
