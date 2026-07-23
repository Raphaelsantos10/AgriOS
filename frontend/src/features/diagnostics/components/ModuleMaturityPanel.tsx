import { AlertTriangle, CheckCircle2, Download, FlaskConical, Search, TimerReset } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { moduleMaturityRegistry, MODULE_MATURITY_VERSION } from "../data/moduleMaturity";
import type { ModuleMaturityStatus } from "../types/moduleMaturity";
import { countMaturity, filterMaturity, maturityCsv, maturityDescriptions, maturityLabels } from "../utils/moduleMaturity";

const statusStyle: Record<ModuleMaturityStatus, string> = {
  real: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  partial: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  demonstrative: "border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-100",
  planned: "border-slate-300/20 bg-slate-300/10 text-slate-200",
};

const statusIcon = {
  real: CheckCircle2,
  partial: AlertTriangle,
  demonstrative: FlaskConical,
  planned: TimerReset,
} satisfies Record<ModuleMaturityStatus, typeof CheckCircle2>;

function downloadCsv() {
  const blob = new Blob([`\uFEFF${maturityCsv(moduleMaturityRegistry)}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `farpha-maturidade-${MODULE_MATURITY_VERSION}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ModuleMaturityPanel() {
  const [status, setStatus] = useState<ModuleMaturityStatus | "all">("all");
  const [query, setQuery] = useState("");
  const counts = useMemo(() => countMaturity(moduleMaturityRegistry), []);
  const visible = useMemo(
    () => filterMaturity(moduleMaturityRegistry, status, query),
    [query, status],
  );
  const filters: Array<ModuleMaturityStatus | "all"> = ["all", "real", "partial", "demonstrative", "planned"];

  return (
    <section className="space-y-5 rounded-3xl border border-white/10 bg-[#0b171a] p-4 md:p-6" aria-labelledby="module-maturity-title">
      <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9cdf28]">
            Matriz verificável · {MODULE_MATURITY_VERSION}
          </p>
          <h2 id="module-maturity-title" className="mt-2 text-2xl font-black text-white">
            Profundidade operacional dos módulos
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#a9b7b0]">
            Estado técnico honesto. “Real” confirma a fonte declarada, mas não substitui configuração,
            testes de campo ou validação agrícola.
          </p>
        </div>
        <button type="button" onClick={downloadCsv} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#9cdf28]/30 px-4 text-sm font-black text-[#dfff8b] hover:bg-[#9cdf28]/10">
          <Download size={17} /> Exportar matriz CSV
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(["real", "partial", "demonstrative", "planned"] as ModuleMaturityStatus[]).map((itemStatus) => {
          const Icon = statusIcon[itemStatus];
          return (
            <button key={itemStatus} type="button" onClick={() => setStatus(itemStatus)} className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${statusStyle[itemStatus]}`}>
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-black">{maturityLabels[itemStatus]}</span>
                <Icon size={19} />
              </span>
              <strong className="mt-3 block text-3xl">{counts[itemStatus]}</strong>
              <span className="mt-2 block text-xs leading-5 opacity-75">{maturityDescriptions[itemStatus]}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Pesquisar módulo</span>
          <Search className="pointer-events-none absolute left-3 top-3.5 text-[#6f8178]" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar módulo, fonte, limitação…" className="min-h-12 w-full rounded-xl border border-white/10 bg-[#061014] pl-10 pr-3 text-sm text-white outline-none placeholder:text-[#6f8178] focus:border-[#9cdf28]/50" />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar estado">
          {filters.map((filter) => (
            <button key={filter} type="button" aria-pressed={status === filter} onClick={() => setStatus(filter)} className={`min-h-11 whitespace-nowrap rounded-xl px-4 text-xs font-black transition ${status === filter ? "bg-[#9cdf28] text-[#061014]" : "border border-white/10 text-[#a9b7b0] hover:bg-white/5"}`}>
              {filter === "all" ? `Todos · ${moduleMaturityRegistry.length}` : `${maturityLabels[filter]} · ${counts[filter]}`}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#82938b]" aria-live="polite">{visible.length} módulo(s) apresentado(s).</p>

      <div className="grid gap-3 xl:grid-cols-2">
        {visible.map((item) => {
          const Icon = statusIcon[item.status];
          const canOpen = item.route && !item.route.includes(":");
          return (
            <article key={item.id} className="rounded-2xl border border-white/10 bg-[#061014] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-white">{item.label}</h3>
                  <p className="mt-1 text-xs text-[#7f9288]">{item.route ?? "Sem rota · roadmap"}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black ${statusStyle[item.status]}`}>
                  <Icon size={13} /> {maturityLabels[item.status]}
                </span>
              </div>
              <dl className="mt-4 grid gap-3 text-xs leading-5 sm:grid-cols-2">
                <div><dt className="font-black uppercase tracking-wide text-[#7f9288]">Fonte e persistência</dt><dd className="mt-1 text-[#d2ddd7]">{item.source} · {item.persistence}</dd></div>
                <div><dt className="font-black uppercase tracking-wide text-[#7f9288]">Evidência</dt><dd className="mt-1 text-[#d2ddd7]">{item.evidence}</dd></div>
                <div><dt className="font-black uppercase tracking-wide text-amber-200/70">Limitação</dt><dd className="mt-1 text-amber-50/90">{item.limitation}</dd></div>
                <div><dt className="font-black uppercase tracking-wide text-[#9cdf28]/75">Próximo passo</dt><dd className="mt-1 text-[#d9f6a0]">{item.nextStep}</dd></div>
              </dl>
              {canOpen ? <Link to={item.route!} className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-white/10 px-3 text-xs font-black text-white hover:border-[#9cdf28]/35 hover:bg-[#9cdf28]/10">Abrir módulo →</Link> : null}
            </article>
          );
        })}
      </div>

      {!visible.length ? <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-[#8fa098]">Nenhum módulo corresponde aos filtros.</div> : null}
    </section>
  );
}
