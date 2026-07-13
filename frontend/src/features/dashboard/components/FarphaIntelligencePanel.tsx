import { ArrowRight, BrainCircuit, Droplets, ShieldAlert, TrendingUp } from "lucide-react";

const recommendations = [
  {
    title: "3 oportunidades",
    text: "Melhorar a produtividade dos talhões Norte e Sul.",
    meta: "Economia potencial de €472 esta semana",
    icon: TrendingUp,
    tone: "text-[#9cdf28] bg-[#9cdf28]/10 border-[#9cdf28]/20",
  },
  {
    title: "1 risco detetado",
    text: "O Talhão Central exige acompanhamento.",
    meta: "Risco alto de ferrugem asiática",
    icon: ShieldAlert,
    tone: "text-[#ff6b48] bg-[#ff6b48]/10 border-[#ff6b48]/20",
  },
  {
    title: "Clima ideal hoje",
    text: "Janela ideal para pulverização.",
    meta: "Das 09:00 às 11:00",
    icon: Droplets,
    tone: "text-[#39a8ff] bg-[#39a8ff]/10 border-[#39a8ff]/20",
  },
];

export default function FarphaIntelligencePanel() {
  return (
    <aside className="flex h-full min-h-[520px] flex-col rounded-3xl border border-white/10 bg-[#091417]/95 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <header className="flex items-center gap-3 border-b border-white/10 p-5">
        <div className="rounded-2xl border border-[#9cdf28]/30 bg-[#9cdf28]/10 p-3 text-[#9cdf28]">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h2 className="font-bold text-white">FARPHA Intelligence</h2>
          <p className="text-xs text-[#84938d]">Assistente operacional</p>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-5">
        <div>
          <p className="font-semibold text-white">Bom dia, Raphael!</p>
          <p className="mt-2 text-sm leading-6 text-[#9aa9a2]">
            Enquanto esteve ausente, analisei os dados da sua operação e preparei um resumo.
          </p>
        </div>

        {recommendations.map(({ title, text, meta, icon: Icon, tone }) => (
          <button
            key={title}
            type="button"
            className={`group w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${tone}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 shrink-0" size={20} />
              <div className="min-w-0 flex-1">
                <p className="font-bold">{title}</p>
                <p className="mt-1 text-sm text-[#d5ddd9]">{text}</p>
                <p className="mt-2 text-xs font-semibold">{meta}</p>
              </div>
              <ArrowRight className="mt-1 transition group-hover:translate-x-1" size={18} />
            </div>
          </button>
        ))}
      </div>

      <div className="p-5 pt-0">
        <button
          type="button"
          className="w-full rounded-xl bg-gradient-to-r from-[#5f9912] to-[#9cdf28] px-4 py-3 font-bold text-[#071014] shadow-[0_14px_35px_rgba(156,223,40,0.22)] transition hover:brightness-110"
        >
          Ver todas as recomendações
        </button>
      </div>
    </aside>
  );
}
