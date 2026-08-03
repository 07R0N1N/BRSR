import Link from "next/link";
import { CONTACT_EMAIL, Wrap, btnGhostDark, btnPrimaryLg } from "./shared";

export default function CTA() {
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
          <a href={`mailto:${CONTACT_EMAIL}`} className={btnPrimaryLg()}>
            Request a demo
          </a>
          <Link href="/login" className={btnGhostDark()}>
            Sign in to your workspace
          </Link>
        </div>
        <p className="mt-[26px] text-[14.5px] text-[#7f8db0]">
          Or write to us directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#cdd7ee] hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </Wrap>
    </section>
  );
}
