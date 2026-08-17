import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationsWithStats } from "@/lib/master/orgStats";

function daysAgo(dateStr: string): number {
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

const LOW_COMPLETION_THRESHOLD = 20;
const ATTENTION_LIMIT = 6;
const RECENT_LIMIT = 6;

type ActivityItem = {
  key: string;
  title: string;
  meta: string;
  badge: string;
  createdAt: string;
};

export default async function MasterOverviewPage() {
  const supabase = await createClient();
  const [orgs, { data: recentProfiles }] = await Promise.all([
    getOrganizationsWithStats(supabase),
    supabase
      .from("profiles")
      .select("id, email, created_at, organizations(name), roles(name)")
      .not("org_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(RECENT_LIMIT),
  ]);

  const onboardedOrgs = orgs.filter((o) => o.onboarding_complete);
  const pendingOrgs = orgs.filter((o) => !o.onboarding_complete);
  const userCount = orgs.reduce((acc, o) => acc + o.user_count, 0);

  const orgsWithCompletion = onboardedOrgs.filter((o) => o.completion_pct !== null);
  const avgCompletion =
    orgsWithCompletion.length > 0
      ? Math.round(orgsWithCompletion.reduce((acc, o) => acc + (o.completion_pct ?? 0), 0) / orgsWithCompletion.length)
      : null;

  const stalledOnboarding = pendingOrgs
    .slice()
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const lowCompletion = onboardedOrgs
    .filter((o) => o.completion_pct !== null && o.completion_pct < LOW_COMPLETION_THRESHOLD)
    .sort((a, b) => (a.completion_pct ?? 0) - (b.completion_pct ?? 0));

  const needsAttention: { org: (typeof orgs)[number]; kind: "pending" | "low" }[] = [
    ...stalledOnboarding.map((org) => ({ org, kind: "pending" as const })),
    ...lowCompletion.map((org) => ({ org, kind: "low" as const })),
  ].slice(0, ATTENTION_LIMIT);

  const recentOrgs: ActivityItem[] = orgs.slice(0, RECENT_LIMIT).map((org) => ({
    key: `org-${org.id}`,
    title: `${org.name} — added ${daysAgo(org.created_at)} day${daysAgo(org.created_at) === 1 ? "" : "s"} ago`,
    meta: [org.plan_tier ? `Plan: ${org.plan_tier}` : null, org.industry ? `Industry: ${org.industry}` : null]
      .filter(Boolean)
      .join(" · ") || "—",
    badge: "New org",
    createdAt: org.created_at,
  }));

  const recentUsers: ActivityItem[] = (recentProfiles ?? []).map((p) => {
    const org = p.organizations as { name: string } | { name: string }[] | null;
    const orgName = Array.isArray(org) ? org[0]?.name : org?.name;
    const role = p.roles as { name: string } | { name: string }[] | null;
    const roleName = Array.isArray(role) ? role[0]?.name : role?.name;
    return {
      key: `user-${p.id}`,
      title: `${p.email} — added ${daysAgo(p.created_at)} day${daysAgo(p.created_at) === 1 ? "" : "s"} ago`,
      meta: [orgName ?? "—", roleName ? `Role: ${roleName}` : null].filter(Boolean).join(" · "),
      badge: "New user",
      createdAt: p.created_at,
    };
  });

  const recentActivity = [...recentOrgs, ...recentUsers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, RECENT_LIMIT);

  return (
    <div>
      <div className="grid gap-3.5 sm:grid-cols-3">
        <Link
          href="/master/organizations"
          className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--brand-100)]"
        >
          <span className="flex items-center gap-2 text-[12.5px] font-semibold text-[var(--text-muted)]">
            <span aria-hidden>🏢</span> Organizations
          </span>
          <p className="mt-1.5 text-[26px] font-bold text-[var(--ink)]">{orgs.length}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {onboardedOrgs.length} onboarded · {pendingOrgs.length} pending
          </p>
        </Link>
        <Link
          href="/master/users"
          className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--brand-100)]"
        >
          <span className="flex items-center gap-2 text-[12.5px] font-semibold text-[var(--text-muted)]">
            <span aria-hidden>👤</span> Users
          </span>
          <p className="mt-1.5 text-[26px] font-bold text-[var(--ink)]">{userCount}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Across all organizations</p>
        </Link>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          <span className="flex items-center gap-2 text-[12.5px] font-semibold text-[var(--text-muted)]">
            <span aria-hidden>📊</span> Avg. completion
          </span>
          <p className="mt-1.5 text-[26px] font-bold text-[var(--ink)]">
            {avgCompletion !== null ? `${avgCompletion}%` : "—"}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Across onboarded orgs</p>
        </div>
      </div>

      <div className="mb-3 mt-7 flex items-baseline justify-between">
        <h2 className="text-[15px] font-bold text-[var(--ink)]">Needs attention</h2>
        <p className="text-xs text-[var(--text-muted)]">Onboarding stalled or low completion close to filing</p>
      </div>
      <div className="flex flex-col gap-2">
        {needsAttention.length === 0 && (
          <p className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">
            Nothing needs attention right now.
          </p>
        )}
        {needsAttention.map(({ org, kind }) => (
          <Link
            key={org.id}
            href={`/master/organizations/${org.id}`}
            className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-sm)] hover:border-[var(--brand-100)]"
          >
            <div>
              <div className="text-[13.5px] font-bold text-[var(--ink)]">{org.name}</div>
              <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                {kind === "pending"
                  ? `Invited ${daysAgo(org.created_at)} day${daysAgo(org.created_at) === 1 ? "" : "s"} ago · admin has not launched onboarding`
                  : `${org.reporting_year ? `FY ${org.reporting_year}` : "No reporting year"} · ${org.completion_pct}% complete · ${org.user_count} users`}
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold ${
                kind === "pending"
                  ? "bg-[var(--amber-50)] text-[var(--amber)]"
                  : "bg-[var(--red-50)] text-[var(--red)]"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {kind === "pending" ? "Onboarding pending" : "Low completion"}
            </span>
          </Link>
        ))}
      </div>

      <div className="mb-3 mt-7 flex items-baseline justify-between">
        <h2 className="text-[15px] font-bold text-[var(--ink)]">Recent activity</h2>
        <p className="text-xs text-[var(--text-muted)]">Newest organizations and users</p>
      </div>
      <div className="flex flex-col gap-2">
        {recentActivity.length === 0 && (
          <p className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">
            No activity yet.
          </p>
        )}
        {recentActivity.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-sm)]"
          >
            <div>
              <div className="text-[13.5px] font-bold text-[var(--ink)]">{item.title}</div>
              <div className="mt-0.5 text-xs text-[var(--text-muted)]">{item.meta}</div>
            </div>
            <span className="inline-flex items-center rounded-full bg-[var(--brand-50)] px-2.5 py-1 text-[11.5px] font-bold text-[var(--brand)]">
              {item.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
