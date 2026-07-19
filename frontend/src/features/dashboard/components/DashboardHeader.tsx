import { Plus, RefreshCw, Sparkles } from "lucide-react";

type DashboardHeaderProps = {
  loading: boolean;
  onRefresh: () => void;
  onCreateFarm: () => void;
};

export default function DashboardHeader({ loading, onRefresh, onCreateFarm }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9cdf28]">
          <Sparkles size={14} /> Centro de Operações
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">Bom dia, Raphael!</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9eaca5]">Acompanhe saúde, risco e produtividade de toda a operação num único painel.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3.5 py-2.5 text-xs font-semibold text-emerald-200">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Dados sincronizados
        </div>
        <button onClick={onRefresh} type="button" className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-[#9aa9a2] transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white" aria-label="Atualizar dados">
          <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
        </button>
        <button onClick={onCreateFarm} type="button" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6aa616] to-[#9cdf28] px-4 py-2.5 text-sm font-black text-[#061014] shadow-[0_12px_30px_rgba(156,223,40,0.16)] transition hover:brightness-110">
          <Plus size={18} /> Nova exploração
        </button>
      </div>
    </header>
  );
}
