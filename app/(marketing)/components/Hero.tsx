import Link from "next/link";
import { COMPANY, Eyebrow, Wrap, btnGhostDark, btnPrimaryLg } from "./shared";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[radial-gradient(900px_420px_at_78%_-8%,rgba(47,91,255,.34),transparent_62%),radial-gradient(700px_400px_at_8%_105%,rgba(15,181,160,.16),transparent_60%),linear-gradient(180deg,#0c1526,#070d1a)] text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent_78%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />
      <Wrap className="relative z-[2] grid items-center gap-12 py-[70px] lg:grid-cols-[minmax(0,1.02fr)_minmax(0,.98fr)] lg:gap-14 lg:py-[92px] lg:pb-[100px]">
        <div>
          <Eyebrow className="text-[#5eead4] before:bg-[#5eead4]">Sustainability reporting, built for India</Eyebrow>
          <h1 className="text-[clamp(36px,4.8vw,57px)] font-bold leading-[1.15] tracking-[-0.032em]">
            BRSR reporting
            <br />
            without the <em className="not-italic text-[#7f9cff]">spreadsheet chaos</em>.
          </h1>
          <p className="mt-[22px] max-w-[540px] text-[19px] leading-[1.65] text-[#a9b6d0]">
            {COMPANY} gives listed companies one clean workspace to gather, check and export every BRSR
            disclosure — Sections A, B and C, all nine NGRBC principles, in the format your filing needs.
          </p>
          <div className="mt-[34px] flex flex-wrap gap-3">
            <a href="#contact" className={`${btnPrimaryLg()} flex-1 justify-center sm:flex-none`}>
              Request a demo
            </a>
            <a href="#tools" className={`${btnGhostDark()} flex-1 justify-center sm:flex-none`}>
              See what we build
            </a>
          </div>
          <p className="mt-[26px] flex items-center gap-2 text-sm text-[#7f8db0]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px] flex-none text-[#0fb5a0]">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Already a client?{" "}
            <Link href="/login" className="text-[#cdd7ee] underline-offset-2 hover:underline">
              Sign in to your workspace
            </Link>
          </p>
        </div>

        <div
          aria-hidden
          className="overflow-hidden rounded-[20px] border border-white/10 bg-[#0e1729] shadow-[0_18px_50px_rgba(7,13,26,.16)] lg:origin-left lg:[transform:perspective(1500px)_rotateY(-7deg)_rotateX(2deg)]"
        >
          <div className="flex items-center gap-1.5 border-b border-white/[0.07] bg-[#0a1120] px-3.5 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2.5 flex-1 rounded-md bg-white/5 px-2.5 py-1 font-mono text-[11px] text-[#7f8db0]">
              yourdomain.in/dashboard
            </span>
          </div>
          <div className="grid min-h-[310px] grid-cols-[130px_minmax(0,1fr)]">
            <div className="border-r border-white/[0.07] bg-[#0a1120] px-2.5 py-3.5">
              <div className="mb-1.5 text-[8.5px] uppercase tracking-[0.13em] text-[#5c6b8c]">Reporting year</div>
              <div className="mb-0.5 rounded-md bg-white/5 px-2 py-1.5 text-[11.5px] text-white">2024–25</div>
              <div className="mb-1.5 mt-3 text-[8.5px] uppercase tracking-[0.13em] text-[#5c6b8c]">General data</div>
              <div className="mb-0.5 rounded-md bg-[#2f5bff] px-2 py-1.5 text-[11.5px] font-semibold text-white">
                General Data Gathering
              </div>
              <div className="mb-1.5 mt-3 text-[8.5px] uppercase tracking-[0.13em] text-[#5c6b8c]">Section A</div>
              <div className="mb-0.5 rounded-md px-2 py-1.5 text-[11.5px] text-[#9fb0d0]">General Disclosures</div>
              <div className="mb-1.5 mt-3 text-[8.5px] uppercase tracking-[0.13em] text-[#5c6b8c]">Section B</div>
              <div className="mb-0.5 rounded-md px-2 py-1.5 text-[11.5px] text-[#9fb0d0]">Management &amp; Process</div>
              <div className="mb-1.5 mt-3 text-[8.5px] uppercase tracking-[0.13em] text-[#5c6b8c]">Section C</div>
              <div className="mb-0.5 rounded-md px-2 py-1.5 text-[11.5px] text-[#9fb0d0]">Principle 1</div>
              <div className="mb-0.5 rounded-md px-2 py-1.5 text-[11.5px] text-[#9fb0d0]">Principle 2</div>
              <div className="mb-0.5 rounded-md px-2 py-1.5 text-[11.5px] text-[#9fb0d0]">Principle 3</div>
            </div>
            <div className="p-[18px]">
              <div className="text-[15px] font-bold text-white">General Data Gathering</div>
              <div className="mt-1 text-[10.5px] text-[#7f8db0]">
                Enter once; values flow to intensity calculations and Principle 6.
              </div>
              <div className="mb-2 mt-4 text-[10.5px] font-bold text-[#0fb5a0]">Turnover &amp; PPP</div>
              <MockRow label="Revenue from operations" filled={[true, true]} />
              <MockRow label="PPP factor" filled={[true, false]} />
              <div className="mb-2 mt-4 text-[10.5px] font-bold text-[#0fb5a0]">Employee &amp; worker counts</div>
              <MockRow label="Employees — permanent" filled={[true, true]} />
              <MockRow label="Workers — permanent" filled={[false, false]} />
              <div className="mt-[18px] h-1.5 overflow-hidden rounded-md bg-white/[0.08]">
                <i className="block h-full w-[68%] rounded-md bg-gradient-to-r from-[#2f5bff] to-[#0fb5a0]" />
              </div>
              <div className="mt-2 text-[9.5px] text-[#5c6b8c]">68% complete · saved automatically</div>
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

function MockRow({ label, filled }: { label: string; filled: [boolean, boolean] }) {
  return (
    <div className="mb-1.5 grid grid-cols-[1.5fr_1fr_1fr] items-center gap-2">
      <span className="text-[10px] text-[#9fb0d0]">{label}</span>
      {filled.map((isFilled, i) => (
        <span
          key={i}
          className={`h-[22px] rounded-[5px] border ${
            isFilled
              ? "border-[rgba(47,91,255,.45)] bg-[rgba(47,91,255,.16)]"
              : "border-white/[0.09] bg-white/[0.055]"
          }`}
        />
      ))}
    </div>
  );
}
