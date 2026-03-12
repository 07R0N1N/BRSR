"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/master", label: "Overview", icon: "📋" },
  { href: "/master/organizations", label: "Organizations", icon: "🏢" },
  { href: "/master/users", label: "Users", icon: "👤" },
  { href: "/master/roles", label: "Roles", icon: "🔐" },
  { href: "/master/visibility", label: "Question visibility", icon: "👁" },
];

export function MasterNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {nav.map(({ href, label, icon }) => {
        const isActive = href === "/master" ? pathname === "/master" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-[#2d3748] hover:text-white"
            }`}
          >
            <span className="text-base leading-none opacity-80" aria-hidden>{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
