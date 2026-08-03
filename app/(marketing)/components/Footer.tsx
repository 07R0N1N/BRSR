import Link from "next/link";
import { BrandMark, COMPANY, CONTACT_EMAIL, Pill, Wrap } from "./shared";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#070d1a] px-0 pb-7 pt-16 text-[14.5px] text-[#a9b6d0]">
      <Wrap>
        <div className="grid gap-[34px] sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <a href="#top" className="flex items-center gap-2.5 no-underline">
              <BrandMark onDark />
              <span className="text-[17px] font-bold tracking-[-0.02em] text-white">{COMPANY}</span>
            </a>
            <p className="mt-4 max-w-[320px] leading-relaxed text-[#7f8db0]">
              Practical software for Business Responsibility and Sustainability Reporting. Built in India, for
              the teams who actually have to file.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[12.5px] font-bold uppercase tracking-[0.11em] text-[#5c6b8c]">Tools</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#tools" className="text-[#a9b6d0] no-underline transition hover:text-white">
                  BRSR Data Collection
                </a>
              </li>
              <li>
                <a href="#tools" className="inline-flex items-center gap-1 text-[#a9b6d0] no-underline transition hover:text-white">
                  BRSR Benchmarking <Pill tone="soon">Soon</Pill>
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#a9b6d0] no-underline transition hover:text-white">
                  Suggest a tool
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[12.5px] font-bold uppercase tracking-[0.11em] text-[#5c6b8c]">Company</h4>
            <ul className="space-y-2.5">
              {[
                ["#about", "About us"],
                ["#why", "Why us"],
                ["#how", "How it works"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-[#a9b6d0] no-underline transition hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[12.5px] font-bold uppercase tracking-[0.11em] text-[#5c6b8c]">Get in touch</h4>
            <ul className="space-y-2.5">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#a9b6d0] no-underline transition hover:text-white">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#a9b6d0] no-underline transition hover:text-white">
                  Request a demo
                </a>
              </li>
              <li>
                <Link href="/login" className="text-[#a9b6d0] no-underline transition hover:text-white">
                  Client sign in
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-[52px] flex flex-wrap justify-between gap-4 border-t border-white/[0.09] pt-6 text-[13.5px] text-[#5c6b8c]">
          <span>
            © {year} {COMPANY}. All rights reserved.
          </span>
          <span>
            <a href="#" className="hover:text-white">
              Privacy policy
            </a>
            {" · "}
            <a href="#" className="hover:text-white">
              Terms of use
            </a>
          </span>
        </div>
      </Wrap>
    </footer>
  );
}
