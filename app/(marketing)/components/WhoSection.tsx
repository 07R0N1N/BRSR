import { SectionHead, Wrap } from "./shared";

const AUDIENCES = [
  {
    title: "Listed companies",
    body: "Companies filing BRSR with SEBI who want the year to run on a system instead of on one very tired person’s spreadsheet.",
    icon: (
      <>
        <path d="M3 21h18M5 21V7l7-4 7 4v14" />
        <path d="M9 9h1M9 13h1M14 9h1M14 13h1" />
      </>
    ),
  },
  {
    title: "Sustainability & ESG teams",
    body: "The people who own the disclosure and chase the data. Chase less, review more.",
    icon: (
      <>
        <path d="M12 2 4 6v6c0 5 3.4 8.8 8 10 4.6-1.2 8-5 8-10V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Finance & secretarial",
    body: "Numbers that must tie to the financials, with a source and a history behind each one.",
    icon: (
      <>
        <path d="M9 11H5a2 2 0 0 0-2 2v7h6z" />
        <path d="M15 4h-6v16h6z" />
        <path d="M19 8h-4v12h6v-10a2 2 0 0 0-2-2z" />
      </>
    ),
  },
  {
    title: "Consultants & assurance providers",
    body: "Work inside the client’s data instead of around it, with a trail you can actually test.",
    icon: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />
      </>
    ),
  },
];

export default function WhoSection() {
  return (
    <section id="who" className="py-16 lg:py-24">
      <Wrap>
        <SectionHead eyebrow="Who we work with" title="Built for everyone who ends up in the BRSR chain." />
        <div className="grid gap-5 sm:grid-cols-2">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="flex gap-[18px] rounded-[14px] border border-[#e3e8f0] bg-white p-[26px]">
              <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-[11px] bg-[#e6f8f4] text-[#0a7d6e]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  {a.icon}
                </svg>
              </span>
              <div>
                <h3 className="text-[17px] font-bold text-[#0d1526]">{a.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[#3d4761]">{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
