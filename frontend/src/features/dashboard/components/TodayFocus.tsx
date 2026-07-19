import { ArrowRight, CheckCircle2, Clock3, Droplets, ShieldAlert } from "lucide-react";

const actions = [
  { icon: ShieldAlert, title: "Inspecionar Talhão Sul", meta: "Risco elevado · até às 11:00", tone: "text-rose-300 bg-rose-500/10" },
  { icon: Droplets, title: "Confirmar plano de rega", meta: "3 talhões · 18 mm recomendados", tone: "text-sky-300 bg-sky-500/10" },
  { icon: CheckCircle2, title: "Validar ordem concluída", meta: "Pulverização · Equipa Norte", tone: "text-emerald-300 bg-emerald-500/10" },
];

export default function TodayFocus() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#0b171a] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]" aria-labelledby="today-focus-title">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9cdf28]">Próximos passos</p><h2 id="today-focus-title" className="mt-1 text-lg font-extrabold text-white">O que precisa da sua atenção</h2></div>
        <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-[#aab7b1]"><Clock3 size={14} /> Hoje</span>
      </div>
      <div className="space-y-2">
        {actions.map(({ icon: Icon, title, meta, tone }) => (
          <button key={title} type="button" className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3 text-left transition hover:border-[#9cdf28]/30 hover:bg-white/[0.065]">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}><Icon size={19} /></span>
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-white">{title}</span><span className="block truncate text-xs text-[#889790]">{meta}</span></span>
            <ArrowRight size={17} className="text-[#65736d] transition group-hover:translate-x-0.5 group-hover:text-[#9cdf28]" />
          </button>
        ))}
      </div>
    </section>
  );
}
