import { Eyebrow, Wrap } from "./shared";

export default function QuoteSection() {
  return (
    <section className="border-y border-[#eef1f6] bg-[#f5f7fb] py-16 lg:py-24">
      <Wrap className="mx-auto max-w-[860px] text-center">
        <Eyebrow className="justify-center">Why this matters</Eyebrow>
        <blockquote className="text-[clamp(21px,2.6vw,28px)] font-semibold leading-[1.45] tracking-[-0.02em] text-[#0d1526]">
          “Sustainability is no longer about doing less harm. It&apos;s about doing more good.”
        </blockquote>
        <p className="mt-[22px] text-[14.5px] text-[#6b7690]">
          Jochen Zeitz, former CEO · PUMA
        </p>
      </Wrap>
    </section>
  );
}
