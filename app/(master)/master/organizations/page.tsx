import { createClient } from "@/lib/supabase/server";
import { OrganizationsForm } from "./OrganizationsForm";
import { OrganizationDeleteButton } from "./OrganizationDeleteButton";

export default async function OrganizationsPage() {
  const supabase = await createClient();
  const { data: organizations } = await supabase
    .from("organizations")
    .select("id, name, plan_tier, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">Organizations</h2>
      <p className="mt-1 text-gray-400">
        Create and manage client organizations.
      </p>
      <OrganizationsForm />
      <div className="mt-8 overflow-hidden rounded-lg border border-[#334155] bg-[#1e293b] shadow">
        <table className="min-w-full divide-y divide-[#334155]">
          <thead>
            <tr className="bg-[#1a202c]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Plan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Created
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]">
            {(organizations ?? []).map((org) => (
              <tr key={org.id}>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
                  {org.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                  {org.plan_tier ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                  {new Date(org.created_at).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <OrganizationDeleteButton orgId={org.id} name={org.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(organizations ?? []).length === 0 && (
          <p className="p-4 text-center text-sm text-gray-500">
            No organizations yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}
