import { SectionHead, Wrap } from "./shared";

const STEPS = [
  {
    title: "We set you up",
    body: "We create your company workspace, the reporting year, and a login for everyone who needs one. Nothing to install.",
  },
  {
    title: "Your team fills it in",
    body: "Each department works through its own sections. Progress is visible to whoever is running the report.",
  },
  {
    title: "Review what’s flagged",
    body: "Gaps, mismatched totals and unanswered indicators are listed in one place. Fix them, don’t hunt for them.",
  },
  {
    title: "Export and file",
    body: "Take out the finished BRSR for your annual report and hand your assurance provider a clean, traceable trail.",
  },
];

export default function HowSection() {
  return (
    <section id="how" className="border-y border-[#eef1f6] bg-[#f5f7fb] py-16 lg:py-24">
      <Wrap>
        <SectionHead eyebrow="How it works" title="From kickoff to filing, in four steps." />
        <div className="grid gap-[34px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[26px]">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative pt-[26px]">
              <span className="absolute left-0 top-0 text-[13px] font-bold tracking-[0.08em] text-[#2f5bff]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {i < STEPS.length - 1 ? (
                <span className="absolute left-[34px] right-[-26px] top-2 hidden h-px bg-[#e3e8f0] lg:block" aria-hidden />
              ) : null}
              <h3 className="mt-1.5 text-[17px] font-bold text-[#0d1526]">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#3d4761]">{step.body}</p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
