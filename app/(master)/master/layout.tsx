import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("roles(slug)")
    .eq("id", user.id)
    .single();
  const roleSlug = (profile as { roles?: { slug: string } } | null)?.roles?.slug;
  if (roleSlug !== "master") redirect("/dashboard");

  const nav = [
    { href: "/master", label: "Overview" },
    { href: "/master/organizations", label: "Organizations" },
    { href: "/master/users", label: "Users" },
    { href: "/master/roles", label: "Roles" },
    { href: "/master/visibility", label: "Question visibility" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-900">BRSR Master</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="w-56 shrink-0">
          <nav className="space-y-1">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
