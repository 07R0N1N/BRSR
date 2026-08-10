"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandMark, COMPANY, Pill, Wrap, btnPrimary } from "./shared";

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[15px] font-medium text-[#3d4761] transition hover:bg-[#f5f7fb] hover:text-[#0d1526] motion-reduce:transition-none"
    >
      {children}
    </a>
  );
}

export default function Header({ onOpenDemo }: { onOpenDemo: () => void }) {
  const [stuck, setStuck] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      setStuck(window.scrollY > 6);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!dropRef.current?.contains(e.target as Node)) setToolsOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setToolsOpen(false);
        setNavOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function closeNav() {
    setNavOpen(false);
    setToolsOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/85 backdrop-blur-[14px] backdrop-saturate-150 transition motion-reduce:transition-none ${
        stuck ? "border-[#e3e8f0] shadow-[0_1px_14px_rgba(13,21,38,.05)]" : "border-transparent"
      }`}
    >
      <Wrap className="relative flex h-[70px] items-center gap-3.5">
        <a href="#top" className="mr-3 flex items-center gap-2.5 no-underline">
          <BrandMark />
          <span className="whitespace-nowrap text-[17px] font-bold tracking-[-0.02em] text-[#0d1526]">
            {COMPANY}
          </span>
        </a>

        <nav
          className={`${
            navOpen
              ? "absolute left-0 right-0 top-[70px] z-40 flex flex-col items-stretch gap-0.5 border-b border-[#e3e8f0] bg-white px-[18px] py-3 pb-5 shadow-[0_4px_12px_rgba(13,21,38,.07),0_12px_32px_rgba(13,21,38,.06)]"
              : "ml-auto hidden items-center gap-0.5 lg:flex"
          }`}
        >
          <NavLink href="#about" onClick={closeNav}>
            About us
          </NavLink>

          <div className="relative" ref={dropRef}>
            <button
              type="button"
              aria-expanded={toolsOpen}
              aria-controls="toolsPanel"
              onClick={(e) => {
                e.stopPropagation();
                setToolsOpen((v) => !v);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[15px] font-medium text-[#3d4761] transition hover:bg-[#f5f7fb] hover:text-[#0d1526] motion-reduce:transition-none"
            >
              Our tools
              <svg
                className={`h-2.5 w-2.5 transition motion-reduce:transition-none ${toolsOpen ? "rotate-180" : ""}`}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M2 4.5 6 8.5 10 4.5" />
              </svg>
            </button>
            {toolsOpen ? (
              <div
                id="toolsPanel"
                className="static mt-1 w-auto rounded-[14px] border border-[#eef1f6] bg-white p-2 lg:absolute lg:left-1/2 lg:top-[calc(100%+10px)] lg:mt-0 lg:w-[340px] lg:-translate-x-1/2 lg:border-[#e3e8f0] lg:shadow-[0_4px_12px_rgba(13,21,38,.07),0_12px_32px_rgba(13,21,38,.06)]"
              >
                <a
                  href="#tools"
                  onClick={closeNav}
                  className="flex gap-3 rounded-[10px] p-3 no-underline transition hover:bg-[#f5f7fb]"
                >
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-[9px] bg-[#eef2ff] text-[#2f5bff]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6M9 15h6M9 11h3" />
                    </svg>
                  </span>
                  <span>
                    <h4 className="flex items-center gap-2 text-[14.5px] font-bold text-[#0d1526]">
                      BRSR Data Collection <Pill tone="live">Live</Pill>
                    </h4>
                    <p className="mt-0.5 text-[13px] leading-snug text-[#6b7690]">
                      Collect, validate and export your full BRSR filing.
                    </p>
                  </span>
                </a>
                <a
                  href="#tools"
                  onClick={closeNav}
                  className="flex gap-3 rounded-[10px] p-3 no-underline transition hover:bg-[#f5f7fb]"
                >
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-[9px] bg-[#eef2ff] text-[#2f5bff]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
                      <path d="M3 3v18h18" />
                      <path d="m7 14 4-4 3 3 5-6" />
                    </svg>
                  </span>
                  <span>
                    <h4 className="flex items-center gap-2 text-[14.5px] font-bold text-[#0d1526]">
                      BRSR Benchmarking <Pill tone="soon">Coming soon</Pill>
                    </h4>
                    <p className="mt-0.5 text-[13px] leading-snug text-[#6b7690]">
                      Compare your disclosures against listed peers.
                    </p>
                  </span>
                </a>
              </div>
            ) : null}
          </div>

          <NavLink href="#why" onClick={closeNav}>
            Why us
          </NavLink>
          <NavLink href="#how" onClick={closeNav}>
            How it works
          </NavLink>
          <NavLink href="#faq" onClick={closeNav}>
            FAQ
          </NavLink>
          <NavLink href="#contact" onClick={closeNav}>
            Contact
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2 border-0 pl-0 lg:ml-3.5 lg:border-l lg:border-[#e3e8f0] lg:pl-[18px]">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[15px] font-semibold text-[#3d4761] no-underline transition hover:bg-[#f0f4ff] hover:text-[#2f5bff]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <path d="m10 17 5-5-5-5M15 12H3" />
            </svg>
            Sign in
          </Link>
          <button
            type="button"
            onClick={() => onOpenDemo()}
            className={`${btnPrimary()} hidden lg:inline-flex`}
          >
            Request a demo
          </button>
        </div>

        <button
          type="button"
          className="ml-1.5 grid h-[42px] w-[42px] place-items-center rounded-[10px] border border-[#e3e8f0] bg-white lg:hidden"
          aria-label="Menu"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-[19px] w-[19px]">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </Wrap>
    </header>
  );
}
