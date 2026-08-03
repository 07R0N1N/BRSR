import { COMPANY, Eyebrow, Wrap } from "./shared";

const VALUES = [
  {
    title: "Built around the framework",
    body: "The structure follows BRSR itself — sections, principles, essential and leadership indicators — so nothing has to be re-mapped at the end.",
    icon: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    ),
  },
  {
    title: "Made for the deadline",
    body: "Auto-save, running completion status and a clear view of what’s still missing, so the last week is review — not reconstruction.",
    icon: (
      <>
        <path d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
  },
  {
    title: "Answerable to an auditor",
    body: "Every figure keeps its source and its history, so when assurance asks “where did this come from”, the answer is one click away.",
    icon: (
      <>
        <path d="M9 12h6M9 16h6M9 8h2" />
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </>
    ),
  },
  {
    title: "Support from people who know BRSR",
    body: "You’re not filing a ticket into a queue. The people who built the tool are the people who answer.",
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-24">
      <Wrap className="grid items-start gap-11 lg:grid-cols-2 lg:gap-[72px]">
        <div>
          <Eyebrow>About us</Eyebrow>
          <h2 className="text-[clamp(28px,3.6vw,42px)] font-bold leading-[1.15] tracking-[-0.022em] text-[#0d1526]">
            We build the tools we wished existed while doing this work ourselves.
          </h2>
          <p className="mt-5 text-[19px] text-[#3d4761]">
            {COMPANY} is a small, focused team working at the intersection of sustainability reporting and
            practical software.
          </p>
          <div className="mt-[22px] space-y-4 text-[16.5px] text-[#3d4761]">
            <p>
              BRSR asked Indian listed companies for something genuinely hard: hundreds of data points,
              pulled from finance, HR, EHS, procurement and legal, all reconciled into one filing with a
              straight face. Most teams do it in a chain of emailed spreadsheets — and then spend the last
              three weeks before the deadline finding out which version was the real one.
            </p>
            <p>
              We started with that problem and nothing else. Our first product, the BRSR Data Collection
              workspace, is already live with clients. Benchmarking is next. The plan is a small, connected
              suite of tools that a reporting team can actually finish its year with — not a giant ESG
              platform you need a consultant to operate.
            </p>
            <p>
              We are independent, India-focused, and we build slowly and specifically. If something in the
              workflow doesn’t match how your team actually works, we would rather hear it than guess.
            </p>
          </div>
        </div>

        <div className="grid gap-3.5">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="flex gap-4 rounded-[14px] border border-[#e3e8f0] bg-white p-5 shadow-[0_1px_2px_rgba(13,21,38,.06),0_1px_3px_rgba(13,21,38,.05)]"
            >
              <span className="grid h-10 w-10 flex-none place-items-center rounded-[10px] bg-[#eef2ff] text-[#2f5bff]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[19px] w-[19px]">
                  {v.icon}
                </svg>
              </span>
              <div>
                <h4 className="text-base font-bold text-[#0d1526]">{v.title}</h4>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#6b7690]">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
