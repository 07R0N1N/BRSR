import type { ReactNode } from "react";

export const COMPANY = "BRSR Central";
export const CONTACT_EMAIL = "hello@yourdomain.in";

export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1180px] px-6 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`mb-[18px] inline-flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-[0.13em] text-[#0fb5a0] before:h-0.5 before:w-[22px] before:rounded-sm before:bg-[#0fb5a0] before:content-[''] ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  children,
  center,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`mb-[52px] max-w-[720px] ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow className={center ? "justify-center" : ""}>{eyebrow}</Eyebrow>
      <h2 className="text-[clamp(28px,3.6vw,42px)] font-bold leading-[1.15] tracking-[-0.022em] text-[#0d1526]">
        {title}
      </h2>
      {children ? <p className="mt-4 text-lg text-[#3d4761]">{children}</p> : null}
    </div>
  );
}

const btnBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-transparent text-[15px] font-semibold tracking-[-0.01em] transition motion-reduce:transition-none active:translate-y-px";

export function btnPrimary(extra = "") {
  return `${btnBase} bg-[#2f5bff] px-[22px] py-3 text-white shadow-[0_2px_10px_rgba(47,91,255,.28)] hover:bg-[#1e42d6] hover:shadow-[0_6px_18px_rgba(47,91,255,.32)] ${extra}`;
}

export function btnPrimaryLg(extra = "") {
  return btnPrimary(`px-7 py-[15px] text-base ${extra}`);
}

export function btnGhostDark(extra = "") {
  return `${btnBase} border-white/20 bg-white/[0.06] px-7 py-[15px] text-base text-white hover:border-white/[0.38] hover:bg-white/10 ${extra}`;
}

export function btnOutline(extra = "") {
  return `${btnBase} border-[#e3e8f0] bg-white px-[22px] py-3 text-[#0d1526] hover:border-[#c3ccdd] hover:bg-[#fafbfd] ${extra}`;
}

/**
 * BRSR Central mark from collaborator icon pack (public/brand/).
 * Light surfaces: mark.svg. Dark surfaces (footer): mark-reversed.svg.
 */
export function BrandMark({
  size = 36,
  onDark = false,
}: {
  size?: number;
  /** Use light-on-dark mark for navy footer / dark bands. */
  onDark?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG brand mark; no optimization needed
    <img
      src={onDark ? "/brand/mark-reversed.svg" : "/brand/mark.svg"}
      alt=""
      width={size}
      height={size}
      className="flex-none"
      aria-hidden
    />
  );
}

export function Pill({
  tone,
  children,
}: {
  tone: "live" | "soon" | "idea";
  children: ReactNode;
}) {
  const tones = {
    live: "bg-[#e6f8f4] text-[#0a7d6e]",
    soon: "bg-[#fff2e0] text-[#a35c00]",
    idea: "bg-[#f5f7fb] text-[#6b7690]",
  };
  return (
    <em
      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-bold not-italic uppercase tracking-[0.07em] ${tones[tone]}`}
    >
      {children}
    </em>
  );
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="mt-1 h-4 w-4 flex-none text-[#0fb5a0]">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
