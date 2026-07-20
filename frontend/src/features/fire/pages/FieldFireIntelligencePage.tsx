import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  Flame,
  LoaderCircle,
  RefreshCw,
  Save,
  ShieldCheck,
  Wind,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { calculateFireRisk } from "../../../engines/fire/fireRiskCalculator";
import type { FireRiskInput } from "../../../engines/fire/types";
import { getEnvironmentProfile } from "../../environment/services/environmentService";
import { getFieldById } from "../../fields/services/fieldsService";
import type { Field } from "../../fields/types/field";
import {
  getFireAssessmentHistory,
  getLatestFireAssessment,
  saveFireAssessment,
} from "../services/fireService";
import type { FireRiskAssessment } from "../types/fire";
import { downloadFireRiskReport } from "../utils/fireRiskReportExport";

const levelLabels = {
  low: "Baixo",
  moderate: "Moderado",
  high: "Elevado",
  very_high: "Muito elevado",
  extreme: "Extremo",
} as const;

const levelTone = {
  low: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  moderate: "border-yellow-400/25 bg-yellow-400/10 text-yellow-200",
  high: "border-orange-400/25 bg-orange-400/10 text-orange-200",
  very_high: "border-red-400/25 bg-red-400/10 text-red-200",
  extreme: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200",
} as const;

function numberOrNull(value: string) {
  return value.trim() === "" ? null : Number(value);
}

export default function FieldFireIntelligencePage() {
  const { farmId = "", fieldId = "" } = useParams();
  const [field, setField] = useState<Field | null>(null);
  const [history, setHistory] = useState<FireRiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [input, setInput] = useState<FireRiskInput>({
    temperatureC: null,
    humidityPercent: null,
    windSpeedKmh: null,
    slopePercent: null,
    vegetationDrynessPercent: 55,
    fuelLoad: "moderate",
    nearbyFireDistanceKm: null,
    windTowardProperty: false,
  });

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [fieldData, environment, latest, assessments] = await Promise.all([
          getFieldById(fieldId),
          getEnvironmentProfile(fieldId),
          getLatestFireAssessment(fieldId).catch(() => null),
          getFireAssessmentHistory(fieldId).catch(() => []),
        ]);
        if (!active) return;
        setField(fieldData);
        setHistory(assessments);
        setNotes(latest?.notes ?? "");
        setInput({
          temperatureC: latest?.temperature_c ?? environment?.max_temperature_c ?? null,
          humidityPercent: latest?.humidity_percent ?? environment?.average_humidity_percent ?? null,
          windSpeedKmh: latest?.wind_speed_kmh ?? null,
          slopePercent: environment?.slope_percent ?? null,
          vegetationDrynessPercent: latest?.vegetation_dryness_percent ?? 55,
          fuelLoad: latest?.fuel_load ?? "moderate",
          nearbyFireDistanceKm: latest?.nearby_fire_distance_km ?? null,
          windTowardProperty: latest?.wind_toward_property ?? false,
        });
      } catch (error) {
        console.error("FIRE INTELLIGENCE LOAD ERROR", error);
        if (active) setMessage("Não foi possível carregar os dados do Fire Intelligence.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [fieldId]);

  const assessment = useMemo(() => calculateFireRisk(input), [input]);

  async function handleSave() {
    try {
      setSaving(true);
      setMessage(null);
      const saved = await saveFireAssessment({
        field_id: fieldId,
        farm_id: farmId,
        temperature_c: input.temperatureC,
        humidity_percent: input.humidityPercent,
        wind_speed_kmh: input.windSpeedKmh,
        vegetation_dryness_percent: input.vegetationDrynessPercent,
        fuel_load: input.fuelLoad,
        nearby_fire_distance_km: input.nearbyFireDistanceKm,
        wind_toward_property: input.windTowardProperty,
        risk_score: assessment.score,
        risk_level: assessment.level,
        confidence: assessment.confidence,
        notes,
      });
      setHistory((current) => [saved, ...current].slice(0, 20));
      setMessage("Avaliação de risco guardada com sucesso.");
    } catch (error) {
      console.error("FIRE ASSESSMENT SAVE ERROR", error);
      setMessage("Não foi possível guardar. Confirme se executou o SQL no Supabase.");
    } finally {
      setSaving(false);
    }
  }

  function handleExportReport() {
    if (!field) return;

    downloadFireRiskReport({
      field,
      input,
      assessment,
      notes,
      generatedAt: new Date().toISOString(),
    });
    setMessage("Relatório de risco de incêndio exportado em CSV.");
  }

  if (loading) {
    return <div className="flex min-h-[520px] items-center justify-center gap-3 bg-[#061014] text-[#9aa9a2]"><LoaderCircle className="animate-spin text-orange-400" /> A carregar Fire Intelligence…</div>;
  }

  return (
    <section className="-m-4 min-h-full bg-[radial-gradient(circle_at_top_right,rgba(255,105,48,0.10),transparent_30%),#061014] p-4 text-white md:-m-6 md:p-6 xl:-m-7 xl:p-7">
      <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <Link to={`/exploracoes/${farmId}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#9cdf28] hover:underline"><ArrowLeft size={17} /> Voltar à exploração</Link>
          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-2xl border border-orange-400/25 bg-orange-400/10 p-3 text-orange-300"><Flame size={26} /></div>
            <div><p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">Fire Intelligence V1</p><h1 className="mt-1 text-3xl font-black">Risco de incêndio · {field?.name ?? "Talhão"}</h1></div>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#9aa9a2]">Avaliação preliminar baseada em condições locais informadas. Ocorrências e instruções oficiais devem ser confirmadas junto da Proteção Civil.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={handleExportReport} disabled={!field} className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-300/30 bg-orange-300/10 px-5 py-3 font-black text-orange-100 disabled:opacity-40"><Download size={18} /> Exportar relatório CSV</button>
          <button type="button" onClick={() => void handleSave()} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-300 px-5 py-3 font-black text-[#201006] disabled:opacity-60"><Save size={18} /> {saving ? "A guardar…" : "Guardar avaliação"}</button>
        </div>
      </header>

      {message && <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[#d8e1dd]">{message}</div>}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">
        <div className="space-y-6">
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-[#0b171a] p-5 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField label="Temperatura (°C)" value={input.temperatureC} onChange={(value) => setInput((current) => ({ ...current, temperatureC: value }))} />
            <NumberField label="Humidade relativa (%)" value={input.humidityPercent} onChange={(value) => setInput((current) => ({ ...current, humidityPercent: value }))} />
            <NumberField label="Vento (km/h)" value={input.windSpeedKmh} onChange={(value) => setInput((current) => ({ ...current, windSpeedKmh: value }))} />
            <NumberField label="Declive (%)" value={input.slopePercent} onChange={(value) => setInput((current) => ({ ...current, slopePercent: value }))} />
            <NumberField label="Secura da vegetação (%)" value={input.vegetationDrynessPercent} onChange={(value) => setInput((current) => ({ ...current, vegetationDrynessPercent: value }))} />
            <NumberField label="Incêndio próximo (km)" value={input.nearbyFireDistanceKm} onChange={(value) => setInput((current) => ({ ...current, nearbyFireDistanceKm: value }))} />
            <label className="grid gap-2 text-sm font-semibold text-[#b8c5bf]"><span>Carga combustível</span><select value={input.fuelLoad} onChange={(event) => setInput((current) => ({ ...current, fuelLoad: event.target.value as FireRiskInput["fuelLoad"] }))} className="rounded-xl border border-white/10 bg-[#071215] px-4 py-3 text-white outline-none focus:border-orange-400/60"><option value="low">Baixa</option><option value="moderate">Moderada</option><option value="high">Elevada</option><option value="very_high">Muito elevada</option></select></label>
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#071215] px-4 py-3 text-sm font-semibold text-[#d7dfdb]"><input type="checkbox" checked={input.windTowardProperty} onChange={(event) => setInput((current) => ({ ...current, windTowardProperty: event.target.checked }))} className="h-4 w-4 accent-orange-500" /><Wind size={17} className="text-orange-300" /> Vento em direção à propriedade</label>
            <label className="grid gap-2 text-sm font-semibold text-[#b8c5bf] sm:col-span-2 lg:col-span-3"><span>Notas</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="rounded-xl border border-white/10 bg-[#071215] px-4 py-3 text-white outline-none focus:border-orange-400/60" placeholder="Vegetação seca, acessos, reservatórios, observações…" /></label>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b171a] p-5">
            <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-black">Fatores da avaliação</h2><p className="mt-1 text-sm text-[#9aa9a2]">Pontuação transparente usada pelo motor.</p></div><RefreshCw size={19} className="text-orange-300" /></div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">{assessment.factors.map((factor) => <div key={factor.label} className="rounded-2xl border border-white/10 bg-[#071215] p-4"><div className="flex items-center justify-between"><p className="font-bold">{factor.label}</p><span className="text-sm font-black text-orange-300">{factor.score}/100</span></div><p className="mt-2 text-sm text-[#9aa9a2]">{factor.explanation}</p></div>)}</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b171a] p-5">
            <h2 className="text-xl font-black">Histórico recente</h2>
            <div className="mt-4 space-y-3">{history.length ? history.map((item) => <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#071215] p-4"><div><p className="font-bold">{levelLabels[item.risk_level]} · {item.risk_score}/100</p><p className="mt-1 text-xs text-[#84938d]">{item.created_at ? new Date(item.created_at).toLocaleString("pt-PT") : "Sem data"}</p></div><span className={`rounded-full border px-3 py-1 text-xs font-black ${levelTone[item.risk_level]}`}>{item.confidence}% confiança</span></div>) : <p className="text-sm text-[#9aa9a2]">Ainda não existem avaliações guardadas.</p>}</div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className={`rounded-3xl border p-6 ${levelTone[assessment.level]}`}>
            <div className="flex items-center justify-between"><Flame size={34} /><span className="rounded-full border border-current/20 px-3 py-1 text-xs font-black">{assessment.confidence}% confiança</span></div>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em]">Risco calculado</p><p className="mt-2 text-4xl font-black">{assessment.score}/100</p><p className="mt-2 text-xl font-black">{levelLabels[assessment.level]}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b171a] p-5"><div className="flex items-center gap-3"><ShieldCheck className="text-[#9cdf28]" /><h2 className="text-lg font-black">Prevenção recomendada</h2></div><div className="mt-4 space-y-3">{assessment.recommendations.map((recommendation) => <div key={recommendation} className="flex gap-3 rounded-xl bg-white/[0.04] p-3 text-sm leading-5 text-[#d7dfdb]"><CheckCircle2 className="mt-0.5 shrink-0 text-[#9cdf28]" size={17} />{recommendation}</div>)}</div></div>

          <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-5 text-red-100"><div className="flex gap-3"><AlertTriangle className="mt-0.5 shrink-0" /><div><p className="font-black">Aviso de segurança</p><p className="mt-2 text-sm leading-6 text-red-100/80">Este cálculo é apoio preventivo. Em emergência, siga exclusivamente as autoridades e ligue 112.</p></div></div></div>
        </aside>
      </div>
    </section>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number | null; onChange: (value: number | null) => void }) {
  return <label className="grid gap-2 text-sm font-semibold text-[#b8c5bf]"><span>{label}</span><input type="number" step="any" value={value ?? ""} onChange={(event) => onChange(numberOrNull(event.target.value))} className="rounded-xl border border-white/10 bg-[#071215] px-4 py-3 text-white outline-none focus:border-orange-400/60" /></label>;
}
