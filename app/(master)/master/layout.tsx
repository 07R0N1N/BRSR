import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountDropdown } from "@/app/(dashboard)/dashboard/AccountDropdown";
import { MasterNav } from "./MasterNav";

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

  return (
    <div className="min-h-screen bg-[#0a0f12]">
      <header className="border-b border-[#334155] bg-[#1a202c]">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none" aria-hidden>⚙️</span>
            <h1 className="text-lg font-semibold text-white">BRSR Master</h1>
          </div>
          <AccountDropdown email={user.email} roleSlug={roleSlug} />
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="w-56 shrink-0 border-r border-[#334155] bg-[#1a202c] p-4">
          <MasterNav />
        </aside>
        <main className="brsr-dark min-w-0 flex-1 overflow-auto bg-[#0a0f12] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
