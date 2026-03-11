import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function MasterOverviewPage() {
  const supabase = await createClient();
  const [{ count: orgCount }, { count: userCount }, { count: roleCount }] =
    await Promise.all([
      supabase.from("organizations").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("roles").select("id", { count: "exact", head: true }),
    ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
      <p className="mt-1 text-gray-600">
        Manage organizations, users, roles, and question visibility.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/master/organizations"
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-indigo-300"
        >
          <span className="text-sm font-medium text-gray-500">Organizations</span>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{orgCount ?? 0}</p>
        </Link>
        <Link
          href="/master/users"
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-indigo-300"
        >
          <span className="text-sm font-medium text-gray-500">Users</span>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{userCount ?? 0}</p>
        </Link>
        <Link
          href="/master/roles"
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-indigo-300"
        >
          <span className="text-sm font-medium text-gray-500">Roles</span>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{roleCount ?? 0}</p>
        </Link>
      </div>
    </div>
  );
}
