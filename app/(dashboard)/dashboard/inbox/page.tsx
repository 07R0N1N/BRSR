import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { canUseApp, isMaster, redirectForIncompleteApp } from "@/lib/auth/accessPolicy";
import { AccountDropdown } from "../AccountDropdown";
import { AppThemeWrapper } from "@/components/theme/AppThemeWrapper";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";
import { ThemedBrandMark } from "@/components/theme/ThemedBrandMark";
import { InboxPageClient } from "./InboxPageClient";

function accountInitial(email: string | undefined): string {
  const ch = (email ?? "A").trim().charAt(0);
  return /[a-z]/i.test(ch) ? ch.toUpperCase() : "A";
}

export default async function InboxPage() {
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
  const orgId = profileData?.org_id ?? null;
  const roleSlug = Array.isArray(profileData?.roles)
    ? profileData?.roles[0]?.slug
    : profileData?.roles?.slug;

  let onboardingComplete: boolean | null = null;
  if (orgId) {
    const { data: orgRow } = await supabase
      .from("organizations")
      .select("onboarding_complete")
      .eq("id", orgId)
      .single();
    onboardingComplete = (orgRow as { onboarding_complete?: boolean } | null)?.onboarding_complete ?? null;
  }

  const ctx = {
    roleSlug: roleSlug ?? null,
    orgId,
    onboardingComplete: orgId ? onboardingComplete : null,
  };

  if (!isMaster(roleSlug ?? null) && !canUseApp(ctx)) {
    redirect(redirectForIncompleteApp(ctx));
  }

  let orgName: string | null = null;
  let orgReportingYear = "2024-25";
  if (orgId) {
    const { data: org } = await supabase
      .from("organizations")
      .select("name, reporting_year")
      .eq("id", orgId)
      .single();
    const orgData = org as { name?: string; reporting_year?: string | null } | null;
    orgName = orgData?.name ?? null;
    orgReportingYear = orgData?.reporting_year ?? "2024-25";
  }

  return (
    <AppThemeWrapper>
      <header className="sticky top-0 z-30 mx-auto w-full max-w-[1400px] bg-[var(--bg)]/95 px-7 pt-7 backdrop-blur-md max-[900px]:px-4 max-[900px]:pt-4">
        <div className="flex h-[68px] items-center justify-between rounded-full border border-[var(--border)] bg-[var(--surface)] px-7 max-[900px]:px-4">
          <div className="flex items-center gap-2.5">
            <ThemedBrandMark size={32} />
            <div className="flex flex-col">
              <h1 className="text-[17px] font-bold leading-tight text-[var(--ink)]">BRSR Data Collection</h1>
              <span className="text-[11px] leading-tight text-[var(--text-muted)]">{orgName ?? "—"} · Inbox</span>
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
      <main className="mx-auto w-full max-w-[1400px] px-7 py-7 max-[900px]:px-4">
        {orgId ? (
          <InboxPageClient orgId={orgId} reportingYear={orgReportingYear} />
        ) : (
          <p className="text-[var(--text-muted)]">No organization assigned.</p>
        )}
      </main>
    </AppThemeWrapper>
  );
}
