import { Wrap } from "./shared";

const STATS = [
  { value: "9", label: "NGRBC principles covered" },
  { value: "3", label: "Sections — A, B and C" },
  { value: "1", label: "Place your whole team works in" },
  { value: "0", label: "Version-mismatched spreadsheets" },
];

export default function Stats() {
  return (
    <section className="border-t border-white/[0.07] bg-[#070d1a]">
      <Wrap>
        <div className="grid grid-cols-2 gap-px bg-white/[0.07] lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#070d1a] px-6 py-[30px] text-center">
              <b className="block text-[30px] font-bold tracking-[-0.03em] text-white">{s.value}</b>
              <span className="mt-1.5 block text-[13px] text-[#7f8db0]">{s.label}</span>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
