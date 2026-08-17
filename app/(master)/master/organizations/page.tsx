import { createClient } from "@/lib/supabase/server";
import { getOrganizationsWithStats } from "@/lib/master/orgStats";
import { OrganizationsForm } from "./OrganizationsForm";
import { OrganizationsTable } from "./OrganizationsTable";

export default async function OrganizationsPage() {
  const supabase = await createClient();
  const organizations = await getOrganizationsWithStats(supabase);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-bold text-[var(--ink)]">Organizations</h2>
          <p className="mt-0.5 text-[12.5px] text-[var(--text-muted)]">
            {organizations.length} organization{organizations.length === 1 ? "" : "s"} · click a row to open its detail
          </p>
        </div>
        <OrganizationsForm />
      </div>
      <OrganizationsTable organizations={organizations} />
    </div>
  );
}
