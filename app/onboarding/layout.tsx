import type { ReactNode } from "react";

export const metadata = {
  title: "Admin Setup — BRSR Data Collection",
};

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0f12]">
      {children}
    </div>
  );
}
