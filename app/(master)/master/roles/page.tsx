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
      <h2 className="text-2xl font-semibold text-gray-900">Roles</h2>
      <p className="mt-1 text-gray-600">
        System roles (Master, Admin, Normal) and custom roles for access control.
      </p>
      <RolesForm />
      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {(roles ?? []).map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                  {r.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                  {r.slug}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
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
