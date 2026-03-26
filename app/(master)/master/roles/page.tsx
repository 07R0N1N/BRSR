import { createClient } from "@/lib/supabase/server";
import { RolesForm } from "./RolesForm";
import { RoleDeleteButton } from "./RoleDeleteButton";

export default async function RolesPage() {
  const supabase = await createClient();
  const { data: roles } = await supabase
    .from("roles")
    .select("id, name, slug, is_system, created_at")
    .order("slug");

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">Roles</h2>
      <p className="mt-1 text-gray-400">
        System roles (Master, Admin, User) and custom roles for access control.
      </p>
      <RolesForm />
      <div className="mt-8 overflow-hidden rounded-lg border border-[#334155] bg-[#1e293b] shadow">
        <table className="min-w-full divide-y divide-[#334155]">
          <thead>
            <tr className="bg-[#1a202c]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]">
            {(roles ?? []).map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
                  {r.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                  {r.slug}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                  {r.is_system ? "System" : "Custom"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <RoleDeleteButton roleId={r.id} slug={r.slug} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
