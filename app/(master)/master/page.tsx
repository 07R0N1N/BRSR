import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function MasterOverviewPage() {
  const supabase = await createClient();
  const [
    { count: orgCount },
    { count: userCount },
    { count: roleCount },
    { count: visibilityCount },
  ] = await Promise.all([
    supabase.from("organizations").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("roles").select("id", { count: "exact", head: true }),
    supabase.from("brsr_questions_visibility").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    { href: "/master/organizations", label: "Organizations", count: orgCount ?? 0, icon: "🏢" },
    { href: "/master/users", label: "Users", count: userCount ?? 0, icon: "👤" },
    { href: "/master/roles", label: "Roles", count: roleCount ?? 0, icon: "🔐" },
    { href: "/master/visibility", label: "Question visibility", count: visibilityCount ?? 0, icon: "👁" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">Overview</h2>
      <p className="mt-1 text-gray-400">
        Manage organizations, users, roles, and question visibility.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ href, label, count, icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-lg border border-[#334155] bg-[#1e293b] p-4 shadow-sm transition-colors hover:border-blue-500/50 hover:bg-[#1e293b]/90"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-gray-400">
              <span className="text-lg leading-none" aria-hidden>{icon}</span>
              {label}
            </span>
            <p className="mt-1 text-2xl font-semibold text-white">{count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
