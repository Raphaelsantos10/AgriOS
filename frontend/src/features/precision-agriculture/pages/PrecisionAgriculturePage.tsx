import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, Cloud, Download, Layers3, Satellite, ScanLine, Sprout, TrendingDown, TrendingUp } from "lucide-react";
import PrecisionMap from "../components/PrecisionMap";
import NdviLegend from "../components/NdviLegend";
import ObservationTrend from "../components/ObservationTrend";
import { precisionRecommendations, satelliteObservations } from "../data/precisionMockData";
import { defaultPrecisionLayers, loadPrecisionLayers, savePrecisionLayers } from "../services/precisionStorage";
import type { PrecisionLayer, VegetationIndex } from "../types/precision";
import { average, downloadObservationsCsv, filterObservations, latestByField, percentageDelta } from "../utils/precisionAnalytics";

const fields = [
  { id: "all", name: "Todos os talhões" },
  { id: "north", name: "Talhão Norte" },
  { id: "south", name: "Talhão Sul" },
  { id: "orchard", name: "Pomar Este" },
];

export default function PrecisionAgriculturePage() {
  const [layers, setLayers] = useState<PrecisionLayer[]>(loadPrecisionLayers);
  const [index, setIndex] = useState<VegetationIndex>("ndvi");
  const [fieldId, setFieldId] = useState("all");

  useEffect(() => savePrecisionLayers(layers), [layers]);
  const filtered = useMemo(() => filterObservations(satelliteObservations, index, fieldId), [index, fieldId]);
  const latest = useMemo(() => latestByField(filterObservations(satelliteObservations, index, "all")), [index]);
  const activeLayers = layers.filter((layer) => layer.enabled).length;
  const averageValue = average(latest.map((item) => item.averageValue));
  const trend = filtered.length > 1 ? percentageDelta(filtered[0].averageValue, filtered[filtered.length - 1].averageValue) : 0;
  const attentionCount = latest.filter((item) => item.status !== "healthy").length;
  const recommendations = precisionRecommendations.filter((item) => fieldId === "all" || item.fieldId === fieldId);

  function updateLayer(id: PrecisionLayer["id"], patch: Partial<PrecisionLayer>) {
    setLayers((current) => current.map((layer) => layer.id === id ? { ...layer, ...patch } : layer));
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">Sprint 22 · Satellite Intelligence</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Agricultura de Precisão</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Histórico de observações, tendências por talhão e recomendações operacionais prontas para integração com Sentinel/Copernicus.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={fieldId} onChange={(event) => setFieldId(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
            {fields.map((field) => <option key={field.id} value={field.id}>{field.name}</option>)}
          </select>
          <button onClick={() => downloadObservationsCsv(filtered)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><Download size={16}/>Exportar CSV</button>
          {(["ndvi", "ndre", "ndmi"] as VegetationIndex[]).map((item) => (
            <button key={item} onClick={() => setIndex(item)} className={`rounded-xl px-4 py-2 text-sm font-bold uppercase transition ${index === item ? "bg-green-700 text-white shadow" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{item}</button>
          ))}
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [Sprout, `${index.toUpperCase()} médio`, averageValue.toFixed(2), `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}% no período`],
          [ScanLine, "Área analisada", "42,6 ha", `${latest.length} talhões`],
          [Cloud, "Cobertura de nuvens", "8%", "Última imagem utilizável"],
          [AlertTriangle, "Zonas em atenção", String(attentionCount), "Revisão recomendada"],
        ].map(([Icon, label, value, detail]) => {
          const KpiIcon = Icon as typeof Sprout;
          return <article key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="rounded-xl bg-green-50 p-2 text-green-700"><KpiIcon size={20}/></span>{trend >= 0 ? <TrendingUp size={17} className="text-green-600"/> : <TrendingDown size={17} className="text-amber-600"/>}</div><p className="mt-4 text-sm font-semibold text-slate-500">{String(label)}</p><p className="mt-1 text-2xl font-black text-slate-950">{String(value)}</p><p className="mt-1 text-xs font-semibold text-slate-500">{String(detail)}</p></article>;
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-3"><div><p className="font-black text-slate-900">Mapa de vigor vegetativo</p><p className="text-xs text-slate-500">Camadas demonstrativas preparadas para raster real</p></div><div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600"><Satellite size={16}/>{index.toUpperCase()} · 12 Jul 2026</div></div>
          <PrecisionMap layers={layers}/>
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between"><p className="font-black text-slate-900">Camadas do mapa</p><span className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-700">{activeLayers} ativas</span></div>
            <div className="mt-4 space-y-3">{layers.map((layer) => <div key={layer.id} className="rounded-xl border border-slate-200 p-3"><label className="flex cursor-pointer items-start justify-between gap-3"><span><span className="block text-sm font-bold text-slate-800">{layer.label}</span><span className="text-xs text-slate-500">{layer.description}</span></span><input type="checkbox" checked={layer.enabled} onChange={(e) => updateLayer(layer.id,{enabled:e.target.checked})} className="mt-1 h-4 w-4 accent-green-700"/></label>{layer.enabled && <input aria-label={`Opacidade ${layer.label}`} type="range" min="0.1" max="1" step="0.05" value={layer.opacity} onChange={(e)=>updateLayer(layer.id,{opacity:Number(e.target.value)})} className="mt-3 w-full accent-green-700"/>}</div>)}</div>
            <button onClick={()=>setLayers(defaultPrecisionLayers)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"><Layers3 size={16}/>Restaurar camadas</button>
          </div>
          <NdviLegend/>
        </aside>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><div><h2 className="text-lg font-black text-slate-950">Evolução temporal</h2><p className="text-sm text-slate-500">Leituras do filtro selecionado.</p></div><CalendarDays className="text-slate-400"/></div>
          <div className="mt-5"><ObservationTrend observations={filtered}/></div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Recomendações FARPHA</h2><p className="text-sm text-slate-500">Prioridades geradas a partir da tendência observada.</p>
          <div className="mt-4 space-y-3">{recommendations.map((item) => <div key={item.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-slate-900">{item.title}</p><p className="mt-1 text-sm text-slate-600">{item.description}</p></div><span className={`rounded-full px-2 py-1 text-xs font-bold ${item.priority === "high" ? "bg-red-50 text-red-700" : item.priority === "medium" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>{item.priority === "high" ? "Alta" : item.priority === "medium" ? "Média" : "Baixa"}</span></div><button className="mt-3 text-sm font-bold text-green-700 hover:text-green-800">{item.action} →</button></div>)}</div>
        </article>
      </section>
    </div>
  );
}
