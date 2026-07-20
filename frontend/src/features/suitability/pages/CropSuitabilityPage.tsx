import { ArrowLeft, Download, Droplets, Leaf, LoaderCircle, ShieldAlert, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCrops } from "../../crops/services/cropService";
import type { Crop } from "../../crops/types/crop";
import { getEnvironmentProfile } from "../../environment/services/environmentService";
import type { FieldEnvironmentInput } from "../../environment/types/environment";
import { getFieldById } from "../../fields/services/fieldsService";
import type { Field } from "../../fields/types/field";
import type { CropSuitabilityResult } from "../types/suitability";
import { calculateCropSuitability } from "../utils/calculateSuitability";
import { downloadSuitabilityReport } from "../utils/suitabilityReportExport";

function scoreLabel(score: number) {
  if (score >= 85) return "Muito alta";
  if (score >= 70) return "Alta";
  if (score >= 55) return "Moderada";
  return "Baixa";
}

function emptyEnvironment(fieldId: string, farmId: string): FieldEnvironmentInput {
  return { field_id: fieldId, farm_id: farmId, altitude_m: null, slope_percent: null, exposure: "unknown", soil_texture: "unknown", soil_ph: null, organic_matter_percent: null, drainage: "unknown", water_available: false, irrigation_type: "none", annual_rainfall_mm: null, average_humidity_percent: null, min_temperature_c: null, max_temperature_c: null, chill_hours: null, frost_risk: "unknown", fire_risk: "unknown", wind_exposure: "unknown", data_confidence: 0, notes: "" };
}

export default function CropSuitabilityPage() {
  const { farmId = "", fieldId = "" } = useParams();
  const [field, setField] = useState<Field | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [environment, setEnvironment] = useState<FieldEnvironmentInput>(() => emptyEnvironment(fieldId, farmId));
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [withIrrigation, setWithIrrigation] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [fieldData, cropData, environmentData] = await Promise.all([getFieldById(fieldId), getCrops(), getEnvironmentProfile(fieldId)]);
        if (!active) return;
        setField(fieldData);
        setCrops(cropData);
        setEnvironment(environmentData ? { ...environmentData } : emptyEnvironment(fieldId, farmId));
      } catch (error) {
        console.error("SUITABILITY LOAD ERROR", error);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [farmId, fieldId]);

  const results = useMemo(() => crops
    .filter((crop) => !query.trim() || [crop.commonName, crop.scientificName ?? "", ...crop.aliases].some((value) => value.toLocaleLowerCase("pt").includes(query.toLocaleLowerCase("pt"))))
    .map((crop) => calculateCropSuitability(crop, environment))
    .sort((a, b) => (withIrrigation ? b.scoreWithIrrigation - a.scoreWithIrrigation : b.score - a.score)), [crops, environment, query, withIrrigation]);

  function handleExportReport() {
    if (!field || !results.length) return;

    downloadSuitabilityReport({
      field,
      results,
      withIrrigation,
      generatedAt: new Date().toISOString(),
    });
    setMessage(`Relatório exportado com ${results.length} culturas.`);
  }

  if (loading) return <div className="flex min-h-[520px] items-center justify-center gap-3 bg-[#061014] text-[#9aa9a2]"><LoaderCircle className="animate-spin text-[#9cdf28]" /> A calcular aptidão agrícola…</div>;

  return (
    <section className="-m-4 min-h-full bg-[radial-gradient(circle_at_top_right,rgba(156,223,40,0.08),transparent_28%),#061014] p-4 text-white md:-m-6 md:p-6 xl:-m-7 xl:p-7">
      <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <Link to={`/exploracoes/${farmId}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#9cdf28] hover:underline"><ArrowLeft size={17} /> Voltar à exploração</Link>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-[#9cdf28]">Crop Suitability Engine V1</p>
          <h1 className="mt-2 text-3xl font-black">O que plantar em {field?.name ?? "este talhão"}?</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#9aa9a2]">Comparação preliminar entre o perfil ambiental do talhão e os requisitos do catálogo de culturas. Não substitui análise agronómica ou laboratorial.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold"><Droplets className="text-sky-400" size={18} /><span>Simular rega</span><input type="checkbox" checked={withIrrigation} onChange={(event) => setWithIrrigation(event.target.checked)} className="h-4 w-4 accent-[#9cdf28]" /></label>
          <button type="button" onClick={handleExportReport} disabled={!results.length} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#9cdf28] px-4 py-3 text-sm font-black text-[#061014] disabled:opacity-40"><Download size={18} /> Exportar relatório CSV</button>
        </div>
      </header>

      {message ? <div className="mt-5 rounded-2xl border border-[#9cdf28]/20 bg-[#9cdf28]/8 p-4 text-sm text-[#dfffb0]">{message}</div> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Metric icon={Sparkles} label="Culturas analisadas" value={String(results.length)} />
        <Metric icon={Leaf} label="Melhor compatibilidade" value={results[0] ? `${withIrrigation ? results[0].scoreWithIrrigation : results[0].score}%` : "—"} />
        <Metric icon={ShieldAlert} label="Confiança dos dados" value={results[0] ? `${results[0].confidence}%` : "0%"} />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b171a] p-4"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar cultura ou variedade…" className="w-full rounded-xl border border-white/10 bg-[#071215] px-4 py-3 text-sm text-white outline-none placeholder:text-[#617169] focus:border-[#9cdf28]/60" /></div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {results.map((result, index) => <ResultCard key={result.crop.id} result={result} rank={index + 1} withIrrigation={withIrrigation} />)}
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Leaf; label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-[#0b171a] p-4"><div className="flex items-center gap-2 text-[#9cdf28]"><Icon size={18} /><span className="text-xs font-black uppercase tracking-[0.16em]">{label}</span></div><p className="mt-3 text-2xl font-black">{value}</p></div>;
}

function ResultCard({ result, rank, withIrrigation }: { result: CropSuitabilityResult; rank: number; withIrrigation: boolean }) {
  const score = withIrrigation ? result.scoreWithIrrigation : result.score;
  return <article className="rounded-3xl border border-white/10 bg-[#0b171a] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#71837a]">#{rank} recomendação</p><h2 className="mt-2 text-xl font-black">{result.crop.commonName}</h2><p className="mt-1 text-xs italic text-[#7f9188]">{result.crop.scientificName}</p></div><div className="text-right"><p className="text-3xl font-black text-[#9cdf28]">{score}%</p><p className="text-xs font-bold text-[#9aa9a2]">{scoreLabel(score)}</p></div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#5f9912] to-[#9cdf28]" style={{ width: `${score}%` }} /></div><div className="mt-5 grid gap-2">{result.factors.map((factor) => <div key={factor.id} className="flex items-center justify-between gap-3 text-xs"><span className="text-[#9aa9a2]">{factor.label}</span><span className={factor.known ? "font-black text-white" : "text-[#617169]"}>{factor.known ? `${factor.score}%` : "Sem dados"}</span></div>)}</div>{result.warnings.length > 0 && <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/8 p-3 text-xs leading-5 text-amber-100">{result.warnings.join(" ")}</div>}{withIrrigation && result.scoreWithIrrigation > result.score && <p className="mt-4 text-xs font-bold text-sky-300">A rega aumenta a compatibilidade em {result.scoreWithIrrigation - result.score} pontos.</p>}<p className="mt-5 text-[11px] leading-5 text-[#71837a]">Confiança da análise: {result.confidence}%. Complete o perfil ambiental para melhorar o resultado.</p></article>;
}
