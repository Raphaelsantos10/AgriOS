import { Activity, GitCommit, LoaderCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import DiagnosticItem from "../components/DiagnosticItem";
import DiagnosticSummary from "../components/DiagnosticSummary";
import { runDiagnostics } from "../services/diagnosticsService";
import type { DiagnosticCategory, DiagnosticReport } from "../types/diagnostics";

const categoryLabels: Record<DiagnosticCategory, string> = {
  core: "Núcleo",
  data: "Módulos e dados",
  integration: "Integrações futuras",
};

type BuildInfo = {
  application: string;
  version: string;
  commit: string;
  runId: string | null;
  node: string;
  environment: "ci" | "local";
};

export default function DiagnosticsPage() {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReport(await runDiagnostics());
    } catch (diagnosticError) {
      console.error("DIAGNOSTICS ERROR:", diagnosticError);
      setError("Não foi possível concluir o diagnóstico da plataforma.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void execute();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [execute]);

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/build-info.json", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((info: BuildInfo | null) => setBuildInfo(info))
      .catch((buildInfoError: unknown) => {
        if (!(buildInfoError instanceof DOMException && buildInfoError.name === "AbortError")) {
          console.debug("BUILD INFO UNAVAILABLE:", buildInfoError);
        }
      });

    return () => controller.abort();
  }, []);

  const groups = useMemo(() => {
    if (!report) return [];
    return (["core", "data", "integration"] as DiagnosticCategory[]).map((category) => ({
      category,
      items: report.items.filter((item) => item.category === category),
    }));
  }, [report]);

  return (
    <section className="-m-4 min-h-full space-y-6 bg-[radial-gradient(circle_at_top_right,rgba(156,223,40,0.08),transparent_28%),#061014] p-4 text-white md:-m-6 md:p-6 xl:-m-7 xl:p-7">
      <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9cdf28]">
            FARPHA Diagnostics
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Diagnóstico da plataforma</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#9aa9a2]">
            Verifica a ligação ao Supabase e a disponibilidade das tabelas utilizadas pelos módulos principais.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void execute()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5f9912] to-[#9cdf28] px-4 py-2.5 font-black text-[#061014] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? <LoaderCircle className="animate-spin" size={18} /> : <RefreshCw size={18} />}
          Executar diagnóstico
        </button>
      </header>

      {buildInfo ? (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-[#9cdf28]/20 bg-[#9cdf28]/5 px-4 py-3 text-xs text-[#b9c7c0]">
          <span className="inline-flex items-center gap-2 font-black text-white">
            <GitCommit size={16} className="text-[#9cdf28]" />
            Build FARPHA {buildInfo.version}
          </span>
          <span>Commit: {buildInfo.commit.slice(0, 7)}</span>
          <span>Node: {buildInfo.node}</span>
          <span>Ambiente: {buildInfo.environment}</span>
        </div>
      ) : null}

      {loading && !report ? (
        <div className="flex min-h-[420px] items-center justify-center gap-3 rounded-3xl border border-white/10 bg-[#0b171a] text-[#9aa9a2]">
          <Activity className="animate-pulse text-[#9cdf28]" /> A testar os módulos da FARPHA…
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      {report ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0b171a] px-4 py-3 text-sm text-[#9aa9a2]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-[#9cdf28]" size={19} />
              Diagnóstico concluído em <strong className="text-white">{report.durationMs} ms</strong>
            </div>
            <span>Última execução: {new Date(report.finishedAt).toLocaleString("pt-PT")}</span>
          </div>

          <DiagnosticSummary report={report} />

          {groups.map(({ category, items }) => (
            <section key={category}>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#c9d5cf]">
                  {categoryLabels[category]}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
                {items.map((item) => (
                  <DiagnosticItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </>
      ) : null}
    </section>
  );
}
