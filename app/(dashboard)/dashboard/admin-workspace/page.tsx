import type { CSSProperties } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountDropdown } from "../AccountDropdown";
import { AdminWorkspaceClient } from "./AdminWorkspaceClient";
import { AppThemeWrapper } from "@/components/theme/AppThemeWrapper";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";

function accountInitial(email: string | undefined): string {
  const ch = (email ?? "A").trim().charAt(0);
  return /[a-z]/i.test(ch) ? ch.toUpperCase() : "A";
}

function getRoleSlug(roles: { slug: string } | { slug: string }[] | null | undefined) {
  return Array.isArray(roles) ? roles[0]?.slug : roles?.slug;
}

export default async function AdminWorkspacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id, roles(slug)")
    .eq("id", user.id)
    .single();

  const profileData = profile as { org_id: string | null; roles?: { slug: string } | { slug: string }[] } | null;
  const roleSlug = getRoleSlug(profileData?.roles ?? null);
  const orgId = profileData?.org_id ?? null;
  if (roleSlug !== "admin" || !orgId) {
    redirect("/dashboard");
  }

  const [{ data: usersData }, { data: org }] = await Promise.all([
    // `roles!inner(slug)` turns the roles join into an inner join so the `neq` filter on
    // `roles.slug` excludes admin profiles at the query level (not just in the UI) — admins
    // already see everything, so they should never appear as an assignable user.
    supabase
      .from("profiles")
      .select("id, email, display_name, roles!inner(slug)")
      .eq("org_id", orgId)
      .neq("roles.slug", "admin")
      .order("email"),
    supabase
      .from("organizations")
      .select("name, reporting_year")
      .eq("id", orgId)
      .single(),
  ]);

  const users = (usersData ?? []).map((u) => ({
    id: u.id,
    email: u.email,
    display_name: u.display_name,
  }));

  const orgData = org as { name?: string; reporting_year?: string | null } | null;
  const orgName = orgData?.name ?? "Organization";
  const reportingYear = orgData?.reporting_year ?? "2024-25";

  return (
    <AppThemeWrapper>
      {/*
        Header styling ported from Archive 1/workflow-mockup/admin-assign-tier1.html's
        .header / .header__inner / .iconbtn / .header__title / .orgchip rules, using
        var(--...) so it themes with the .app-theme scope instead of the
        old hardcoded dark-only hex values.

        Detached from the mock: rendered as a floating pill (rounded-full, margin on
        all sides) rather than an edge-to-edge bar, to visually pair with the rounded
        segmented tab control directly below it (AdminWorkspaceClient's PillTab row).
        Outer wrapper only supplies the same mx-auto/max-w/px-7 margin `main` already
        uses, plus pt-7 so the pill is inset from the viewport top by the same amount;
        it stays in normal document flow (no sticky/fixed positioning).
      */}
      <header className="mx-auto max-w-[1180px] px-7 pt-7 max-[900px]:px-4 max-[900px]:pt-4">
        <div className="flex h-[68px] items-center justify-between rounded-full border border-[var(--border)] bg-[var(--surface)] px-7 max-[900px]:px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              aria-label="Back"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[17px] font-bold text-[var(--ink)]">Admin Workspace</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-2)] py-0.5 pl-2 pr-2.5 text-xs font-semibold text-[var(--text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)]" />
                {orgName}
              </span>
            </div>
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

      {/*
        `.brsr-dark` (globals.css) hardcodes always-dark colors with `!important` on
        inputs/tables — it predates this toggle and would fight the var(--...) classes
        below in light mode. Dropped here since every element it used to force-style
        is now explicitly themed via CSS variables instead.
      */}
      <main className="mx-auto max-w-[1180px] px-7 py-7 max-[900px]:px-4">
        <AdminWorkspaceClient users={users} reportingYear={reportingYear} />
      </main>
    </AppThemeWrapper>
  );
}
