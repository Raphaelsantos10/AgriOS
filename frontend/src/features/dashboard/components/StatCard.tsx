import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  meta: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  progress?: number;
};

export default function StatCard({ label, value, meta, icon: Icon, trend = "neutral", progress = 72 }: StatCardProps) {
  const trendClass = trend === "up" ? "text-emerald-300" : trend === "down" ? "text-amber-300" : "text-[#9cdf28]";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b171a]/95 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:border-[#9cdf28]/25 hover:bg-[#0e1c20]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9cdf28]/45 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7f8e87]">{label}</p>
          <p className="mt-2 truncate text-2xl font-black tracking-[-0.03em] text-white">{value}</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#9cdf28]/20 bg-[#9cdf28]/10 text-[#9cdf28] shadow-[0_0_24px_rgba(156,223,40,0.08)]">
          <Icon size={19} />
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className={`truncate text-xs font-bold ${trendClass}`}>{meta}</p>
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full rounded-full bg-gradient-to-r from-[#5f9912] to-[#9cdf28]" style={{ width: `${Math.max(12, Math.min(progress, 100))}%` }} />
        </div>
      </div>
    </article>
  );
}
