import { SectionHead, Wrap } from "./shared";

const FEATURES = [
  {
    title: "Enter it once",
    body: "Revenue, PPP factor, headcount by category — typed a single time, then reused across every principle and intensity calculation that needs them.",
    icon: (
      <>
        <path d="M21 12a9 9 0 1 1-6.2-8.6" />
        <path d="M22 4 12 14.01l-3-3" />
      </>
    ),
  },
  {
    title: "Nothing gets lost",
    body: "Every keystroke saves itself. No “did anyone send the latest version?”, no sheet with three people’s edits sitting in someone’s inbox.",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 2" />
      </>
    ),
  },
  {
    title: "Made for many hands",
    body: "Finance, HR, EHS and legal each work on their own part, at the same time, without stepping on each other or waiting for a file.",
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 11h-6" />
      </>
    ),
  },
  {
    title: "Checks as you type",
    body: "Totals that must tie, ratios that must reconcile and fields that can’t be blank are flagged the moment they slip — not the night before filing.",
    icon: (
      <>
        <path d="m9 11 3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
  },
  {
    title: "Export, don’t retype",
    body: "Pull out a clean, structured BRSR your annual report team and your assurance provider can both work from directly.",
    icon: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M7 10l5 5 5-5M12 15V3" />
      </>
    ),
  },
  {
    title: "Your data stays yours",
    body: "Access is per-user and per-company. Your disclosures are never pooled, resold or used to train anything.",
    icon: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  },
];

export default function WhySection() {
  return (
    <section id="why" className="py-16 lg:py-24">
      <Wrap>
        <SectionHead eyebrow="Why teams choose us" title="Everything that makes BRSR painful — handled.">
          Not a generic form builder with a BRSR label on it. The workflow is the framework.
        </SectionHead>
        <div className="grid overflow-hidden rounded-[20px] border border-[#e3e8f0] bg-[#e3e8f0] gap-px sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white p-[30px] px-[30px] py-[34px] transition hover:bg-[#fafbfd] motion-reduce:transition-none">
              <span className="mb-[18px] grid h-[42px] w-[42px] place-items-center rounded-[11px] bg-[#0d1526] text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  {f.icon}
                </svg>
              </span>
              <h3 className="text-[17.5px] font-bold text-[#0d1526]">{f.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[#3d4761]">{f.body}</p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
