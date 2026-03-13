"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

export function AccountDropdown({
  email,
  roleSlug,
}: {
  email: string | undefined;
  roleSlug?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-gray-300 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span aria-hidden>👤</span>
        <span>{email ?? "Account"}</span>
        <span className="text-[10px] opacity-70" aria-hidden>▾</span>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-md border border-[#334155] bg-[#1a202c] py-1 shadow-lg"
          role="menu"
        >
          {roleSlug === "admin" && (
            <Link
              href="/dashboard/admin-workspace"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block w-full px-3 py-2 text-left text-xs text-gray-300 transition-colors hover:bg-white/10"
            >
              Admin Workspace
            </Link>
          )}
          <form action="/api/auth/signout" method="post" className="block">
            <button
              type="submit"
              role="menuitem"
              className="w-full px-3 py-2 text-left text-xs text-gray-300 transition-colors hover:bg-white/10"
            >
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
