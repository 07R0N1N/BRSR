import { Eyebrow, Wrap } from "./shared";

export default function QuoteSection() {
  return (
    <section className="border-y border-[#eef1f6] bg-[#f5f7fb] py-16 lg:py-24">
      <Wrap className="mx-auto max-w-[860px] text-center">
        <Eyebrow className="justify-center">In their words</Eyebrow>
        <blockquote className="text-[clamp(21px,2.6vw,28px)] font-semibold leading-[1.45] tracking-[-0.02em] text-[#0d1526]">
          “[A short line from a real client about what the tool changed for their reporting cycle.]”
        </blockquote>
        <p className="mt-[22px] text-[14.5px] text-[#6b7690]">[Name], [Title] · [Company]</p>
        <p className="mt-3.5 text-[12.5px] italic text-[#9aa4bb]">
          Placeholder — only publish this with the client’s written permission.
        </p>
      </Wrap>
    </section>
  );
}
