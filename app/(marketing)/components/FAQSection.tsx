import { SectionHead, Wrap } from "./shared";

const FAQS = [
  {
    q: "What exactly is BRSR?",
    a: "Business Responsibility and Sustainability Reporting — SEBI’s disclosure framework for listed companies. It’s organised into Section A (general disclosures), Section B (management and process) and Section C, which covers the nine principles of the National Guidelines on Responsible Business Conduct.",
    open: true,
  },
  {
    q: "Do we need to change how our team works?",
    a: "No. The tool follows the framework’s own structure, so the sections your team already divides work by are the sections in the software. Most teams are entering real data on day one.",
  },
  {
    q: "Can several people work on the report at the same time?",
    a: "Yes. Each person gets their own login and works on their own sections simultaneously. Everything saves as you go, so there is only ever one live version of the report.",
  },
  {
    q: "What happens to last year’s data?",
    a: "It stays in the workspace. Previous-year figures carry forward for comparison, which is also what makes the benchmarking tool useful once it launches.",
  },
  {
    q: "Is our data secure?",
    a: "Data is hosted on Supabase (managed PostgreSQL) with the app running on Vercel. Every organization's data is isolated at the database level — access is scoped per user and per company, so no organization can see another's data. Production access is limited to our core team only. Have specific security or compliance questions? Reach out and we'll walk you through it.",
  },
  {
    q: "How do we get started?",
    a: "Request a demo below. We’ll walk you through the workspace with your own reporting year in mind, and set up your team’s logins if it’s a fit.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 lg:py-24">
      <Wrap>
        <SectionHead eyebrow="FAQ" title="Questions we get asked" center />
        <div className="mx-auto max-w-[840px] border-t border-[#e3e8f0]">
          {FAQS.map((item) => (
            <details key={item.q} open={item.open} className="group border-b border-[#e3e8f0]">
              <summary className="relative cursor-pointer list-none py-[22px] pr-11 text-[17px] font-semibold tracking-[-0.015em] text-[#0d1526] marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="absolute right-2 top-[29px] h-2.5 w-2.5 rotate-45 border-b-2 border-r-2 border-[#6b7690] transition group-open:-rotate-[135deg] motion-reduce:transition-none"
                />
              </summary>
              <p className="pb-6 pr-11 text-base text-[#3d4761]">{item.a}</p>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
