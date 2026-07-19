import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Droplets,
  Flame,
  Leaf,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import type { EngineRecommendation } from "../../../engines";

const priorityTone = {
  critical: "text-[#ff6b48] bg-[#ff6b48]/10 border-[#ff6b48]/25",
  high: "text-[#ff9f43] bg-[#ff9f43]/10 border-[#ff9f43]/25",
  moderate: "text-[#39a8ff] bg-[#39a8ff]/10 border-[#39a8ff]/25",
  low: "text-[#9cdf28] bg-[#9cdf28]/10 border-[#9cdf28]/20",
} as const;

function iconFor(recommendation: EngineRecommendation) {
  if (recommendation.category === "irrigation") return Droplets;
  if (recommendation.category === "crop") return Leaf;
  if (recommendation.category === "risk" && /incêndio/i.test(recommendation.title)) return Flame;
  if (recommendation.category === "risk") return ShieldAlert;
  return AlertTriangle;
}

type Props = {
  recommendations: EngineRecommendation[];
  confidence: number;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
};

export default function FarphaIntelligencePanel({
  recommendations,
  confidence,
  loading,
  error,
  onRefresh,
}: Props) {
  return (
    <aside className="flex h-full min-h-[520px] flex-col rounded-3xl border border-white/10 bg-[#091417]/95 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <header className="flex items-center gap-3 border-b border-white/10 p-5">
        <div className="rounded-2xl border border-[#9cdf28]/30 bg-[#9cdf28]/10 p-3 text-[#9cdf28]">
          <BrainCircuit size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-white">FARPHA Intelligence</h2>
          <p className="text-xs text-[#84938d]">
            {loading ? "A analisar dados reais…" : `Confiança geral: ${confidence}%`}
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-xl border border-white/10 p-2 text-[#84938d] transition hover:text-white"
          aria-label="Atualizar recomendações"
        >
          <RefreshCw className={loading ? "animate-spin" : ""} size={17} />
        </button>
      </header>

      <div className="flex-1 space-y-4 p-5">
        <div>
          <p className="font-semibold text-white">Bom dia, Raphael!</p>
          <p className="mt-2 text-sm leading-6 text-[#9aa9a2]">
            Os primeiros motores da FARPHA cruzaram perfis ambientais, culturas e sistemas de rega.
          </p>
        </div>

        {loading && !recommendations.length ? (
          <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-[#9aa9a2]">
            <LoaderCircle className="animate-spin text-[#9cdf28]" size={20} />
            A preparar recomendações…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : recommendations.length ? (
          recommendations.map((recommendation) => {
            const Icon = iconFor(recommendation);
            return (
              <button
                key={recommendation.id}
                type="button"
                className={`group w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${priorityTone[recommendation.priority]}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 shrink-0" size={20} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{recommendation.title}</p>
                      <span className="rounded-full border border-current/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        {recommendation.confidence}%
                      </span>
                    </div>
                    {recommendation.fieldName && (
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider opacity-75">
                        {recommendation.fieldName}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-[#d5ddd9]">{recommendation.description}</p>
                    <p className="mt-2 text-xs leading-5 opacity-85">{recommendation.reason}</p>
                  </div>
                  <ArrowRight className="mt-1 shrink-0 transition group-hover:translate-x-1" size={18} />
                </div>
              </button>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-center">
            <BrainCircuit className="mx-auto text-[#9cdf28]" size={30} />
            <p className="mt-3 font-bold text-white">Sem recomendações disponíveis</p>
            <p className="mt-2 text-sm leading-6 text-[#9aa9a2]">
              Crie talhões e preencha os respetivos perfis ambientais para ativar os motores.
            </p>
          </div>
        )}
      </div>

      <div className="p-5 pt-0">
        <button
          type="button"
          onClick={onRefresh}
          className="w-full rounded-xl bg-gradient-to-r from-[#5f9912] to-[#9cdf28] px-4 py-3 font-bold text-[#071014] shadow-[0_14px_35px_rgba(156,223,40,0.22)] transition hover:brightness-110"
        >
          Atualizar análise dos motores
        </button>
      </div>
    </aside>
  );
}
