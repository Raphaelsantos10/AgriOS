import { ArrowRight, CheckCircle2, Droplets, Leaf, Satellite, ShieldAlert, Tractor } from "lucide-react";
import type { IntelligenceRecommendation } from "../types/intelligence";

const tone = {
  critical: "border-[#ff6846]/30 bg-[#ff6846]/10 text-[#ff8a70]",
  high: "border-[#ffae4a]/30 bg-[#ffae4a]/10 text-[#ffc174]",
  moderate: "border-[#49a8ff]/30 bg-[#49a8ff]/10 text-[#75bdff]",
  low: "border-[#9cdf28]/25 bg-[#9cdf28]/10 text-[#b9ec68]",
} as const;

function RecommendationIcon({ category }: Pick<IntelligenceRecommendation, "category">) {
  if (category === "irrigation") return <Droplets size={20} />;
  if (category === "disease") return <ShieldAlert size={20} />;
  if (category === "satellite") return <Satellite size={20} />;
  if (category === "harvest" || category === "operations") return <Tractor size={20} />;
  return <Leaf size={20} />;
}

type Props = { recommendation: IntelligenceRecommendation; onDismiss: (id: string) => void };

export default function RecommendationCard({ recommendation, onDismiss }: Props) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#0b171a] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${tone[recommendation.priority]}`}>
          <RecommendationIcon category={recommendation.category} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-white">{recommendation.title}</h3>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${tone[recommendation.priority]}`}>{recommendation.priority}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-[#a9b6b0]">{recommendation.confidence}% confiança</span>
          </div>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#7f9088]">{recommendation.fieldName} · {recommendation.dueLabel}</p>
          <p className="mt-3 text-sm leading-6 text-[#d5ddd9]">{recommendation.summary}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#74847c]">Porque foi gerado</p><p className="mt-1 text-xs leading-5 text-[#aab6b0]">{recommendation.reason}</p></div>
            <div className="rounded-xl border border-[#9cdf28]/15 bg-[#9cdf28]/[0.04] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#8cac60]">Impacto previsto</p><p className="mt-1 text-xs font-bold text-[#cceba2]">{recommendation.estimatedImpact}</p></div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#9cdf28] px-4 py-2.5 text-xs font-black text-[#071014] transition hover:brightness-110"><ArrowRight size={15}/>{recommendation.action}</button>
            <button type="button" onClick={() => onDismiss(recommendation.id)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-bold text-[#9aa9a2] transition hover:border-white/20 hover:text-white"><CheckCircle2 size={15}/>Marcar como analisada</button>
          </div>
        </div>
      </div>
    </article>
  );
}
