"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CONTACT_EMAIL, Wrap, btnGhostDark, btnPrimaryLg } from "./shared";

export default function CTA({ onOpenDemo }: { onOpenDemo: () => void }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail in non-secure contexts; leave the mailto as the fallback.
    }
  }

  return (
    <section
      id="contact"
      // Inline style, not a Tailwind bg-[...] arbitrary class: a trailing bare
      // hex colour after a top-level comma (radial-gradient(...), #0c1526) was
      // not being picked up as a valid arbitrary value, so the section rendered
      // with no background at all (white), making the white heading invisible.
      style={{ background: "radial-gradient(700px 320px at 50% 0%, rgba(47,91,255,.35), transparent 65%), #0c1526" }}
      className="px-0 py-[82px] text-center text-white"
    >
      <Wrap>
        <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.15] tracking-[-0.022em]">
          See it with your own reporting year.
        </h2>
        <p className="mx-auto mt-[18px] max-w-[580px] text-lg text-[#a9b6d0]">
          A 30-minute walkthrough, no slides. Tell us where your BRSR process hurts and we’ll show you exactly
          how the tool handles it.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => onOpenDemo()} className={btnPrimaryLg()}>
            Request a demo
          </button>
          <Link href="/login" className={btnGhostDark()}>
            Sign in to your workspace
          </Link>
        </div>
        <p className="mt-[26px] inline-flex items-center justify-center gap-1.5 text-[14.5px] text-[#7f8db0]">
          Or write to us directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#cdd7ee] hover:underline">
            {CONTACT_EMAIL}
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Email address copied" : "Copy email address"}
            title={copied ? "Copied!" : "Copy email address"}
            className="inline-flex h-6 w-6 items-center justify-center rounded text-[#7f8db0] transition hover:bg-white/10 hover:text-[#cdd7ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f5bff]/50"
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-[#5eead4]" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </p>
      </Wrap>
    </section>
  );
}
