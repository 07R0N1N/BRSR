import { createClient } from "@/lib/supabase/server";
import { VisibilityForm } from "./VisibilityForm";

export default async function VisibilityPage() {
  const supabase = await createClient();
  const [{ data: visibility }, { data: roles }] = await Promise.all([
    supabase
      .from("brsr_questions_visibility")
      .select("id, role_id, section, principle_no, question_code, roles(name)")
      .order("role_id")
      .order("section")
      .order("principle_no"),
    supabase.from("roles").select("id, name, slug").order("slug"),
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">Question visibility</h2>
      <p className="mt-1 text-gray-400">
        Define which roles can see which BRSR sections, principles, and questions. Real questions load in Phase 2.
      </p>
      <VisibilityForm roles={roles ?? []} />
      <div className="mt-8 overflow-hidden rounded-lg border border-[#334155] bg-[#1e293b] shadow">
        <table className="min-w-full divide-y divide-[#334155]">
          <thead>
            <tr className="bg-[#1a202c]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Section
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Principle
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Question code
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]">
            {(visibility ?? []).map((v) => (
              <tr key={v.id}>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-white">
                  {v.roles && typeof v.roles === "object" && "name" in v.roles
                    ? String((v.roles as { name: string }).name)
                    : "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                  {v.section}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                  {v.principle_no}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-300">
                  {v.question_code}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(visibility ?? []).length === 0 && (
          <p className="p-4 text-center text-sm text-gray-500">
            No visibility rules yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}
