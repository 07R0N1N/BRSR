import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountDropdown } from "@/app/(dashboard)/dashboard/AccountDropdown";
import { AppThemeWrapper } from "@/components/theme/AppThemeWrapper";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";
import { MasterNav } from "./MasterNav";

function accountInitial(email: string | undefined): string {
  const ch = (email ?? "A").trim().charAt(0);
  return /[a-z]/i.test(ch) ? ch.toUpperCase() : "A";
}

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
    <AppThemeWrapper>
      {/*
        Same floating-pill header + top pill-tab nav as Dashboard/Admin
        Workspace — see admin-workspace/page.tsx's header comment. Master
        used to be a sidebar layout on its own always-dark `.brsr-dark`
        palette; moved onto `.app-theme` so all four surfaces (Login,
        Dashboard, Admin Workspace, Master) share one token set and get
        light/dark for free. See Archive 1/workflow-mockup/master-dashboard-mock.html.
      */}
      <header className="mx-auto max-w-[1180px] px-7 pt-7 max-[900px]:px-4 max-[900px]:pt-4">
        <div className="flex h-[68px] items-center justify-between rounded-full border border-[var(--border)] bg-[var(--surface)] px-7 max-[900px]:px-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl leading-none" aria-hidden>⚙️</span>
            <h1 className="text-[17px] font-bold text-[var(--ink)]">BRSR Master</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggleButton />
            <div
              className="app-account"
              style={{ "--account-initial": `"${accountInitial(user.email)}"` } as CSSProperties}
            >
              <AccountDropdown email={user.email} roleSlug={roleSlug} />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1180px] px-7 py-7 max-[900px]:px-4">
        <MasterNav />
        <div className="mt-5">{children}</div>
      </main>
    </AppThemeWrapper>
  );
}
