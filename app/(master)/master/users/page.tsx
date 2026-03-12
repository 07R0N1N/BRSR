import { createClient } from "@/lib/supabase/server";
import { UsersForm } from "./UsersForm";
import { UserDeleteButton } from "./UserDeleteButton";

export default async function UsersPage() {
  const supabase = await createClient();
  const [
    { data: profiles },
    { data: organizations },
    { data: roles },
  ] = await Promise.all([
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

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">Users</h2>
      <p className="mt-1 text-gray-400">
        Create users and assign organization and role.
      </p>
      <UsersForm organizations={organizations ?? []} roles={roles ?? []} />
      <div className="mt-8 overflow-hidden rounded-lg border border-[#334155] bg-[#1e293b] shadow">
        <table className="min-w-full divide-y divide-[#334155]">
          <thead>
            <tr className="bg-[#1a202c]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Organization
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]">
            {(profiles ?? []).map((p) => {
              const r = p.roles;
              const rolesObj = Array.isArray(r) ? r[0] : r && typeof r === "object" && "slug" in r ? (r as { name: string; slug: string }) : null;
              const roleSlug = rolesObj?.slug ?? "";
              const roleName = rolesObj?.name ?? "—";
              return (
                <tr key={p.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
                    {p.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                    {p.organizations && typeof p.organizations === "object" && "name" in p.organizations
                      ? String((p.organizations as { name: string }).name)
                      : "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                    {roleName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <UserDeleteButton
                      userId={p.id}
                      email={p.email}
                      roleSlug={roleSlug}
                      currentUserId={currentUser?.id ?? ""}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(profiles ?? []).length === 0 && (
          <p className="p-4 text-center text-sm text-gray-500">
            No users yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}
