import type { CSSProperties } from "react";
import { Activity, Droplets, ShieldCheck, Sprout, TrendingUp, Wrench } from "lucide-react";
import type { FarmHealthScore } from "../../../core/alerts";

export default function FarmHealthCard({ health }: { health: FarmHealthScore }) {
  const metrics = [
    { label: "Vegetação", value: health.vegetation, icon: Sprout },
    { label: "Água", value: health.water, icon: Droplets },
    { label: "Operações", value: health.operations, icon: Wrench },
    { label: "Risco", value: health.risk, icon: ShieldCheck },
  ];
  return <section className="rounded-3xl border border-white/10 bg-[#0b171a] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]"><div className="flex items-start justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9cdf28]">Living Farm Score</p><h2 className="mt-1 text-lg font-extrabold text-white">Saúde da exploração</h2></div><span className="flex items-center gap-1 rounded-full bg-[#9cdf28]/10 px-3 py-1.5 text-xs font-bold text-[#9cdf28]"><TrendingUp size={14}/>+{health.trend}%</span></div><div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center"><div className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full bg-[conic-gradient(#9cdf28_var(--score),rgba(255,255,255,0.08)_0)] p-3" style={{ "--score": `${health.total}%` } as CSSProperties}><div className="grid h-full w-full place-items-center rounded-full bg-[#0b171a]"><div className="text-center"><p className="text-3xl font-black text-white">{health.total}</p><p className="text-[10px] font-bold uppercase tracking-wide text-[#83918a]">de 100</p></div></div></div><div className="grid flex-1 gap-3 sm:grid-cols-2">{metrics.map(({label,value,icon:Icon})=><div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-semibold text-[#9aa7a1]"><Icon size={15} className="text-[#9cdf28]"/>{label}</span><strong className="text-sm text-white">{value}</strong></div><div className="mt-2 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#5f9912] to-[#9cdf28]" style={{width:`${value}%`}}/></div></div>)}</div></div><div className="mt-4 flex items-start gap-2 rounded-xl border border-[#9cdf28]/15 bg-[#9cdf28]/7 p-3 text-xs leading-5 text-[#bad19f]"><Activity size={16} className="mt-0.5 shrink-0 text-[#9cdf28]"/>O score combina vigor vegetativo, água, execução de ordens e exposição a riscos operacionais.</div></section>;
}
