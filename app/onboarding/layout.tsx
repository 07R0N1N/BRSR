import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountDropdown } from "../(dashboard)/dashboard/AccountDropdown";

export const metadata = {
  title: "Admin Setup — BRSR Data Collection",
};

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#0a0f12]">
      <header className="border-b border-[#334155] bg-[#1a202c]">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none" aria-hidden>
              📊
            </span>
            <h1 className="text-lg font-semibold text-[#f1f5f9]">BRSR Data Collection</h1>
          </div>
          <AccountDropdown email={user.email ?? undefined} />
        </div>
      </header>
      {children}
    </div>
  );
}
