"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Top pill-tab nav for Master (mirrors AdminWorkspaceClient's PillTab row).
 * Roles and Question visibility were dropped from here — Roles management
 * is rarely needed after initial setup and Question visibility is
 * superseded by per-user assignments in Admin Workspace (see
 * Archive 1/workflow-mockup/master-dashboard-mock.html). Their pages still
 * exist at /master/roles and /master/visibility for now; only the nav entry
 * is gone.
 */
const nav = [
  { href: "/master", label: "Overview" },
  { href: "/master/organizations", label: "Organizations" },
  { href: "/master/users", label: "Users" },
];

export function MasterNav() {
  const pathname = usePathname();

  return (
    <nav
      className="inline-flex gap-0.5 rounded-full bg-[var(--surface-3)] p-1"
      role="tablist"
      aria-label="Master sections"
      data-testid="master-nav"
    >
      {nav.map(({ href, label }) => {
        const isActive = href === "/master" ? pathname === "/master" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            role="tab"
            aria-selected={isActive}
            data-testid={`master-nav-${label.toLowerCase()}`}
            className={`rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors ${
              isActive
                ? "bg-[var(--surface)] text-[var(--brand)] shadow-[var(--shadow-sm)]"
                : "text-[var(--text-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
