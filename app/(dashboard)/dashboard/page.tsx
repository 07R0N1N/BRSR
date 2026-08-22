import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { canUseApp, isMaster, redirectForIncompleteApp } from "@/lib/auth/accessPolicy";
import { AccountDropdown } from "./AccountDropdown";
import { ExportButton } from "@/components/ExportButton";
import { QuestionnaireShell } from "./QuestionnaireShell";
import { AppThemeWrapper } from "@/components/theme/AppThemeWrapper";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";
import { ThemedBrandMark } from "@/components/theme/ThemedBrandMark";

function accountInitial(email: string | undefined): string {
  const ch = (email ?? "A").trim().charAt(0);
  return /[a-z]/i.test(ch) ? ch.toUpperCase() : "A";
}

export default async function DashboardPage() {
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

  let allowedQuestionCodes: string[] | null = null;
  if (orgId && roleSlug !== "admin" && roleSlug !== "master") {
    const { data: assignedRows } = await supabase
      .from("user_question_assignments")
      .select("question_code")
      .eq("org_id", orgId)
      .eq("user_id", user.id);
    allowedQuestionCodes = (assignedRows ?? []).map((row) => row.question_code);
  }

  return (
    <AppThemeWrapper>
      {/*
        Same floating-pill header pattern as Admin Workspace's page.tsx —
        see that file's comment for why it's a rounded, inset pill instead
        of an edge-to-edge bar.
      */}
      <header className="mx-auto max-w-[1400px] px-7 pt-7 max-[900px]:px-4 max-[900px]:pt-4">
        <div className="flex h-[68px] items-center justify-between rounded-full border border-[var(--border)] bg-[var(--surface)] px-7 max-[900px]:px-4">
          <div className="flex items-center gap-2.5">
            <ThemedBrandMark size={32} />
            <div className="flex flex-col">
              <h1 className="text-[17px] font-bold leading-tight text-[var(--ink)]">BRSR Data Collection</h1>
              <span className="text-[11px] leading-tight text-[var(--text-muted)]">{orgName ?? "—"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {orgId && (
              <ExportButton
                orgId={orgId}
                year={orgReportingYear}
                orgName={orgName ?? "BRSR"}
              />
            )}
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
      <main className="mx-auto flex min-h-[calc(100vh-100px)] max-w-[1400px] flex-col px-7 py-7 max-[900px]:px-4">
        {orgId ? (
          <QuestionnaireShell
            orgId={orgId}
            reportingYear={orgReportingYear}
            canViewAll={roleSlug === "admin" || roleSlug === "master"}
            allowedQuestionCodes={allowedQuestionCodes}
          />
        ) : (
          <p className="text-[var(--text-muted)]">No organization assigned. Contact your administrator.</p>
        )}
      </main>
    </AppThemeWrapper>
  );
}
