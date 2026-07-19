import { BrainCircuit, Droplets, RefreshCw, ShieldAlert, Sparkles, TrendingUp, Wheat } from "lucide-react";
import IntelligenceAssistant from "../components/IntelligenceAssistant";
import RecommendationCard from "../components/RecommendationCard";
import { useIntelligence } from "../hooks/useIntelligence";

export default function IntelligencePage() {
  const intelligence = useIntelligence();
  const snapshot = intelligence.snapshot;
  const kpis = [
    { label: "Decisões hoje", value: snapshot?.decisionsToday ?? "—", detail: "Geradas pelos motores", icon: BrainCircuit },
    { label: "Confiança geral", value: snapshot ? `${snapshot.confidence}%` : "—", detail: "Qualidade da análise", icon: Sparkles },
    { label: "Economia prevista", value: snapshot ? `€${snapshot.predictedSavings.toLocaleString("pt-PT")}` : "—", detail: "Água, operação e prevenção", icon: TrendingUp },
    { label: "Produção prevista", value: snapshot ? `${snapshot.yieldForecastTonnes} t` : "—", detail: `${snapshot?.yieldConfidence ?? 0}% de confiança`, icon: Wheat },
  ];

  return (
    <section className="-m-4 min-h-full space-y-5 bg-[radial-gradient(circle_at_top_right,rgba(156,223,40,0.10),transparent_28%),#061014] p-4 text-white md:-m-6 md:p-6 xl:-m-7 xl:p-7">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#9cdf28]">Sprint 24 · Motor de decisão</p><h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-white md:text-4xl">FARPHA Intelligence</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#9daaa4]">Recomendações explicáveis para rega, doenças, vigor vegetativo, colheita e planeamento operacional.</p></div>
        <button type="button" onClick={()=>void intelligence.refresh()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9cdf28]/20 bg-[#9cdf28]/10 px-4 py-2.5 text-sm font-black text-[#c9ed9b]"><RefreshCw className={intelligence.loading ? "animate-spin" : ""} size={17}/>Atualizar motores</button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(({label,value,detail,icon:Icon})=><article key={label} className="rounded-2xl border border-white/10 bg-[#0b171a] p-4"><div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl border border-[#9cdf28]/20 bg-[#9cdf28]/10 text-[#9cdf28]"><Icon size={19}/></span><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7f8d86]">{label}</p><p className="mt-1 text-xl font-black text-white">{value}</p><p className="mt-1 text-xs text-[#84928b]">{detail}</p></div></div></article>)}</div>

      {intelligence.error && <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">{intelligence.error}</div>}

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#788780]">Plano recomendado</p><h2 className="mt-1 text-xl font-black text-white">O que a exploração deve fazer agora</h2></div><span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-[#9aa9a2]">Opportunity score {intelligence.opportunityScore}/100</span></div>
          {intelligence.loading && !snapshot ? <div className="rounded-2xl border border-white/10 bg-[#0b171a] p-12 text-center text-sm text-[#8f9e97]">A cruzar satélite, ambiente e operações…</div> : intelligence.recommendations.length ? intelligence.recommendations.map((recommendation)=><RecommendationCard key={recommendation.id} recommendation={recommendation} onDismiss={intelligence.dismiss}/>) : <div className="rounded-2xl border border-dashed border-white/15 bg-[#0b171a] p-10 text-center"><Sparkles className="mx-auto text-[#9cdf28]"/><p className="mt-3 font-black text-white">Todas as recomendações foram analisadas</p></div>}
        </div>

        <div className="space-y-5">
          <IntelligenceAssistant />
          <article className="rounded-2xl border border-white/10 bg-[#0b171a] p-5"><div className="flex items-center gap-2"><ShieldAlert className="text-[#ffae4a]" size={19}/><h2 className="font-black text-white">Risco de doenças</h2></div><div className="mt-4 space-y-4">{snapshot?.diseaseRisks.map((risk)=><div key={risk.name}><div className="flex items-center justify-between text-xs"><span className="font-bold text-[#d7dfdb]">{risk.name} · {risk.fieldName}</span><span className="font-black text-white">{risk.probability}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-gradient-to-r from-[#9cdf28] via-[#ffae4a] to-[#ff6846]" style={{width:`${risk.probability}%`}}/></div></div>)}</div></article>
          <article className="rounded-2xl border border-white/10 bg-[#0b171a] p-5"><div className="flex items-center gap-2"><Droplets className="text-[#55b7ff]" size={19}/><h2 className="font-black text-white">Plano de rega inteligente</h2></div><div className="mt-4 space-y-3">{snapshot?.irrigationPlan.map((plan)=><div key={plan.fieldName} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.025] p-3"><div><p className="text-sm font-bold text-white">{plan.fieldName}</p><p className="mt-1 text-xs text-[#819087]">{plan.start} · {plan.durationMinutes ? `${plan.durationMinutes} min` : "aguardar chuva"}</p></div><span className="text-sm font-black text-[#83cfff]">{plan.volumeM3 ? `${plan.volumeM3} m³` : "Pausa"}</span></div>)}</div></article>
        </div>
      </div>
    </section>
  );
}
