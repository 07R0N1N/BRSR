import { CheckIcon, Pill, SectionHead, Wrap, btnOutline, btnPrimary } from "./shared";

const TOOLS = [
  {
    title: "BRSR Data Collection",
    pill: { tone: "live" as const, label: "Live now" },
    live: true,
    body: "The complete reporting workspace. Enter your disclosures section by section, let the calculated fields take care of themselves, and export a filing-ready BRSR.",
    items: [
      "Sections A, B and C with all 9 principles",
      "Enter turnover and headcount once — reused everywhere",
      "Intensity ratios calculated automatically",
      "Multi-year: carry last year forward, don’t retype it",
      "One-click export for your annual report",
    ],
    cta: { href: "#contact", label: "Request a demo", primary: true },
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M9 15h6M9 11h3" />
      </>
    ),
  },
  {
    title: "BRSR Benchmarking",
    pill: { tone: "soon" as const, label: "Coming soon" },
    live: false,
    body: "Filing is the floor. Benchmarking tells you where you actually stand — against your sector, your peer set, and your own last three years.",
    items: [
      "Compare against listed peers, indicator by indicator",
      "Sector medians and quartiles on the metrics that matter",
      "Spot the gaps before your board and investors do",
      "Board-ready charts, straight out of your own data",
    ],
    cta: { href: "#contact", label: "Join the early access list", primary: false },
    previewTag: "Preview available",
    previewCta: { href: "/benchmarking-preview.html", label: "See a preview" },
    icon: (
      <>
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 3 3 5-6" />
      </>
    ),
  },
  {
    title: "What should we build next?",
    pill: { tone: "idea" as const, label: "On the roadmap" },
    live: false,
    future: true,
    body: "This slot is deliberately empty. Assurance readiness, supplier data collection, a board dashboard — the roadmap is shaped by what our clients keep running into.",
    items: ["Tell us what your reporting cycle actually breaks on"],
    cta: { href: "#contact", label: "Suggest a tool", primary: false },
    icon: <path d="M12 5v14M5 12h14" />,
  },
];

export default function ToolsSection() {
  return (
    <section id="tools" className="border-y border-[#eef1f6] bg-[#f5f7fb] py-16 lg:py-24">
      <Wrap>
        <SectionHead eyebrow="Our tools" title="One suite, built one honest tool at a time.">
          Each tool stands on its own and shares the same data, so what you enter once is available everywhere
          it’s needed.
        </SectionHead>

        <div className="grid gap-[22px] lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <article
              key={tool.title}
              className={`flex flex-col rounded-[20px] border p-[30px] transition motion-reduce:transition-none ${
                tool.future
                  ? "border-dashed border-[#e3e8f0] bg-[#fafbfd] shadow-none"
                  : tool.live
                    ? "border-[#c9d6ff] bg-white shadow-[0_2px_6px_rgba(47,91,255,.08),0_14px_34px_rgba(47,91,255,.09)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(13,21,38,.07),0_12px_32px_rgba(13,21,38,.06)]"
                    : "border-[#e3e8f0] bg-white shadow-[0_1px_2px_rgba(13,21,38,.06),0_1px_3px_rgba(13,21,38,.05)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(13,21,38,.07),0_12px_32px_rgba(13,21,38,.06)]"
              }`}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <span
                  className={`grid h-[46px] w-[46px] place-items-center rounded-xl ${
                    tool.future ? "bg-[#eef1f6] text-[#6b7690]" : "bg-[#eef2ff] text-[#2f5bff]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
                    {tool.icon}
                  </svg>
                </span>
                <div className="flex items-center gap-1.5">
                  <Pill tone={tool.pill.tone}>{tool.pill.label}</Pill>
                  {tool.previewTag ? (
                    <span className="inline-block whitespace-nowrap rounded-full border border-[#c9d6ff] bg-white px-2 py-0.5 text-[10.5px] font-semibold text-[#2f5bff]">
                      {tool.previewTag}
                    </span>
                  ) : null}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#0d1526]">{tool.title}</h3>
              <p className="mt-2.5 text-[15.5px] leading-relaxed text-[#3d4761]">{tool.body}</p>
              <ul className="mb-[26px] mt-5 grid gap-2.5">
                {tool.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14.5px] text-[#3d4761]">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-2.5 border-t border-[#eef1f6] pt-[22px]">
                <a href={tool.cta.href} className={tool.cta.primary ? `${btnPrimary()} w-full` : `${btnOutline()} w-full`}>
                  {tool.cta.label}
                </a>
                {tool.previewCta ? (
                  <a
                    href={tool.previewCta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 text-[14.5px] font-semibold text-[#2f5bff] hover:underline"
                  >
                    {tool.previewCta.label}
                    <span aria-hidden>↗</span>
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
