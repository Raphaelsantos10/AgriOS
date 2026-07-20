import {
  ArrowLeft,
  Droplets,
  Download,
  Gauge,
  History,
  LoaderCircle,
  Play,
  Save,
  Waves,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEnvironmentProfile } from "../../environment/services/environmentService";
import type { FieldEnvironmentInput } from "../../environment/types/environment";
import { getFieldById } from "../../fields/services/fieldsService";
import type { Field } from "../../fields/types/field";
import {
  createIrrigationEvent,
  getIrrigationEvents,
  getIrrigationSystem,
  saveIrrigationSystem,
} from "../services/irrigationService";
import type {
  IrrigationEvent,
  IrrigationMethod,
  IrrigationSystem,
  IrrigationSystemInput,
  WaterSourceType,
} from "../types/irrigation";
import { calculateIrrigationRecommendation } from "../utils/irrigationCalculator";
import { downloadIrrigationPlan } from "../utils/irrigationPlanExport";

const methodLabels: Record<IrrigationMethod, string> = {
  drip: "Gota-a-gota",
  sprinkler: "Aspersão",
  micro_sprinkler: "Microaspersão",
  pivot: "Pivô",
  furrow: "Sulcos",
  manual: "Manual",
  other: "Outro",
};

const sourceLabels: Record<WaterSourceType, string> = {
  well: "Poço",
  spring: "Nascente",
  reservoir: "Depósito",
  pond: "Charca",
  network: "Rede",
  river: "Rio/ribeiro",
  other: "Outra",
};

function emptyEnvironment(fieldId: string, farmId: string): FieldEnvironmentInput {
  return {
    field_id: fieldId,
    farm_id: farmId,
    altitude_m: null,
    slope_percent: null,
    exposure: "unknown",
    soil_texture: "unknown",
    soil_ph: null,
    organic_matter_percent: null,
    drainage: "unknown",
    water_available: false,
    irrigation_type: "none",
    annual_rainfall_mm: null,
    average_humidity_percent: null,
    min_temperature_c: null,
    max_temperature_c: null,
    chill_hours: null,
    frost_risk: "unknown",
    fire_risk: "unknown",
    wind_exposure: "unknown",
    data_confidence: 0,
    notes: "",
  };
}

function emptySystem(fieldId: string, farmId: string): IrrigationSystemInput {
  return {
    field_id: fieldId,
    farm_id: farmId,
    name: "Sistema principal",
    method: "drip",
    water_source: "well",
    flow_l_min: null,
    pressure_bar: null,
    reservoir_capacity_m3: null,
    reservoir_level_percent: null,
    efficiency_percent: 90,
    active: true,
    notes: "",
  };
}

export default function IrrigationPage() {
  const { farmId = "", fieldId = "" } = useParams();
  const [field, setField] = useState<Field | null>(null);
  const [environment, setEnvironment] = useState<FieldEnvironmentInput>(() => emptyEnvironment(fieldId, farmId));
  const [system, setSystem] = useState<IrrigationSystem | null>(null);
  const [form, setForm] = useState<IrrigationSystemInput>(() => emptySystem(fieldId, farmId));
  const [events, setEvents] = useState<IrrigationEvent[]>([]);
  const [soilMoisture, setSoilMoisture] = useState(28);
  const [forecastRain, setForecastRain] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [fieldData, environmentData, systemData, eventData] = await Promise.all([
          getFieldById(fieldId),
          getEnvironmentProfile(fieldId),
          getIrrigationSystem(fieldId),
          getIrrigationEvents(fieldId),
        ]);
        if (!active) return;
        setField(fieldData);
        setEnvironment(environmentData ? { ...environmentData } : emptyEnvironment(fieldId, farmId));
        setSystem(systemData);
        setForm(systemData ? { ...systemData } : emptySystem(fieldId, farmId));
        setEvents(eventData);
      } catch (error) {
        console.error("IRRIGATION LOAD ERROR", error);
        if (active) setMessage("Não foi possível carregar o módulo. Confirme se executou o SQL da irrigação.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [farmId, fieldId]);

  const recommendation = useMemo(
    () => field ? calculateIrrigationRecommendation(field, environment, system, soilMoisture, forecastRain) : null,
    [environment, field, forecastRain, soilMoisture, system],
  );

  async function handleSaveSystem() {
    setSaving(true);
    setMessage(null);
    try {
      const saved = await saveIrrigationSystem(form);
      setSystem(saved);
      setForm({ ...saved });
      setMessage("Sistema de rega guardado com sucesso.");
    } catch (error) {
      console.error("IRRIGATION SAVE ERROR", error);
      setMessage("Não foi possível guardar o sistema de rega.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRegisterIrrigation() {
    if (!system || !recommendation) {
      setMessage("Guarde primeiro o sistema de rega.");
      return;
    }
    setSaving(true);
    try {
      const event = await createIrrigationEvent({
        system_id: system.id,
        field_id: fieldId,
        farm_id: farmId,
        started_at: new Date().toISOString(),
        duration_minutes: recommendation.recommendedMinutes || 30,
        volume_m3: recommendation.estimatedVolumeM3,
        source: "recommendation",
        notes: "Registo criado a partir da recomendação FARPHA.",
      });
      setEvents((current) => [event, ...current]);
      setMessage("Rega registada no histórico.");
    } catch (error) {
      console.error("IRRIGATION EVENT ERROR", error);
      setMessage("Não foi possível registar a rega.");
    } finally {
      setSaving(false);
    }
  }

  function handleExportPlan() {
    if (!field || !recommendation) return;

    downloadIrrigationPlan({
      field,
      system,
      recommendation,
      soilMoisturePercent: soilMoisture,
      forecastRainMm: forecastRain,
      generatedAt: new Date().toISOString(),
    });
    setMessage("Plano de rega exportado em CSV.");
  }

  if (loading) {
    return <div className="flex min-h-[520px] items-center justify-center gap-3 bg-[#061014] text-[#9aa9a2]"><LoaderCircle className="animate-spin text-sky-400" /> A carregar irrigação…</div>;
  }

  return (
    <section className="-m-4 min-h-full bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.10),transparent_30%),#061014] p-4 text-white md:-m-6 md:p-6 xl:-m-7 xl:p-7">
      <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <Link to={`/exploracoes/${farmId}`} className="inline-flex items-center gap-2 text-sm font-bold text-sky-300 hover:underline"><ArrowLeft size={17} /> Voltar à exploração</Link>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-sky-300">Smart Irrigation Engine V1</p>
          <h1 className="mt-2 text-3xl font-black">Rega de {field?.name ?? "talhão"}</h1>
          <p className="mt-2 text-sm text-[#9aa9a2]">Configuração, recomendação e histórico de consumo de água por talhão.</p>
        </div>
        <button type="button" onClick={() => void handleSaveSystem()} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-5 py-3 font-black text-[#061014] disabled:opacity-50"><Save size={18} /> {saving ? "A guardar…" : "Guardar sistema"}</button>
      </header>

      {message && <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-sky-100">{message}</div>}

      <div className="mt-6 grid gap-5 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          <section className="rounded-3xl border border-white/10 bg-[#0b171a] p-5">
            <div className="flex items-center gap-3"><div className="rounded-xl bg-sky-400/15 p-2.5 text-sky-300"><Waves size={20} /></div><div><h2 className="font-black">Sistema e fonte de água</h2><p className="text-xs text-[#819188]">Dados técnicos usados no cálculo da duração.</p></div></div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Nome"><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="input" /></Field>
              <Field label="Método"><select value={form.method} onChange={(event) => setForm((current) => ({ ...current, method: event.target.value as IrrigationMethod }))} className="input">{Object.entries(methodLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
              <Field label="Fonte de água"><select value={form.water_source} onChange={(event) => setForm((current) => ({ ...current, water_source: event.target.value as WaterSourceType }))} className="input">{Object.entries(sourceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
              <NumberField label="Caudal (L/min)" value={form.flow_l_min} onChange={(value) => setForm((current) => ({ ...current, flow_l_min: value }))} />
              <NumberField label="Pressão (bar)" value={form.pressure_bar} onChange={(value) => setForm((current) => ({ ...current, pressure_bar: value }))} />
              <NumberField label="Eficiência (%)" value={form.efficiency_percent} onChange={(value) => setForm((current) => ({ ...current, efficiency_percent: value ?? 90 }))} />
              <NumberField label="Capacidade do depósito (m³)" value={form.reservoir_capacity_m3} onChange={(value) => setForm((current) => ({ ...current, reservoir_capacity_m3: value }))} />
              <NumberField label="Nível do depósito (%)" value={form.reservoir_level_percent} onChange={(value) => setForm((current) => ({ ...current, reservoir_level_percent: value }))} />
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#0b171a] p-5">
            <div className="flex items-center gap-3"><Gauge className="text-[#9cdf28]" /><div><h2 className="font-black">Condições atuais</h2><p className="text-xs text-[#819188]">Nesta versão, podes inserir valores observados ou estimados.</p></div></div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <NumberField label="Humidade do solo (%)" value={soilMoisture} onChange={(value) => setSoilMoisture(value ?? 0)} />
              <NumberField label="Chuva prevista 24 h (mm)" value={forecastRain} onChange={(value) => setForecastRain(value ?? 0)} />
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#0b171a] p-5">
            <div className="flex items-center gap-3"><History className="text-[#9cdf28]" /><h2 className="font-black">Histórico recente</h2></div>
            <div className="mt-4 space-y-3">
              {events.length ? events.map((event) => <div key={event.id} className="flex flex-col justify-between gap-2 rounded-2xl border border-white/10 bg-[#071215] p-4 sm:flex-row sm:items-center"><div><p className="font-bold">{new Date(event.started_at).toLocaleString("pt-PT")}</p><p className="text-xs text-[#819188]">{event.duration_minutes} min · {event.source}</p></div><p className="text-lg font-black text-sky-300">{Number(event.volume_m3).toFixed(1)} m³</p></div>) : <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-[#819188]">Ainda não existem regas registadas.</p>}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-sky-400/20 bg-gradient-to-b from-sky-400/10 to-[#0b171a] p-5 2xl:sticky 2xl:top-6">
          <div className="flex items-center gap-3"><div className="rounded-2xl bg-sky-400 p-3 text-[#061014]"><Droplets size={24} /></div><div><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Recomendação FARPHA</p><h2 className="text-xl font-black">Plano de rega</h2></div></div>
          {recommendation && <><div className="mt-6 grid grid-cols-2 gap-3"><Metric label="Necessidade" value={`${recommendation.estimatedWaterNeedMm} mm`} /><Metric label="Volume" value={`${recommendation.estimatedVolumeM3} m³`} /><Metric label="Duração" value={recommendation.recommendedMinutes ? `${recommendation.recommendedMinutes} min` : "Configurar"} /><Metric label="Confiança" value={`${recommendation.confidence}%`} /></div><div className="mt-5 rounded-2xl border border-white/10 bg-[#071215] p-4"><p className="text-xs font-black uppercase tracking-[0.15em] text-[#819188]">Melhor janela</p><p className="mt-2 text-2xl font-black text-[#9cdf28]">{recommendation.bestWindow}</p><p className="mt-2 text-sm text-[#aab8b1]">Prioridade: <strong className="uppercase text-white">{recommendation.priority}</strong></p></div><div className="mt-5 space-y-2 text-xs leading-5 text-[#aab8b1]">{recommendation.reasons.map((reason) => <p key={reason}>• {reason}</p>)}</div>{recommendation.warnings.length > 0 && <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-xs leading-5 text-amber-100">{recommendation.warnings.join(" ")}</div>}<button type="button" onClick={() => void handleRegisterIrrigation()} disabled={saving || !recommendation.needsIrrigation} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-[#9cdf28] px-5 py-3 font-black text-[#061014] disabled:cursor-not-allowed disabled:opacity-40"><Play size={18} /> Registar rega recomendada</button><button type="button" onClick={handleExportPlan} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sky-300/30 bg-sky-300/10 px-5 py-3 font-black text-sky-100 transition hover:bg-sky-300/15"><Download size={18} /> Exportar plano CSV</button>{!recommendation.needsIrrigation && <p className="mt-3 text-center text-xs text-[#819188]">Neste momento não foi identificada necessidade relevante de rega.</p>}</>}
        </aside>
      </div>
      <style>{`.input{width:100%;border:1px solid rgba(255,255,255,.10);background:#071215;border-radius:.75rem;padding:.75rem 1rem;color:#fff;outline:none}.input:focus{border-color:rgba(56,189,248,.65)}.input option{background:#071215}`}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold text-[#b8c5bf]"><span>{label}</span>{children}</label>;
}

function NumberField({ label, value, onChange }: { label: string; value: number | null; onChange: (value: number | null) => void }) {
  return <Field label={label}><input type="number" step="any" value={value ?? ""} onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))} className="input" /></Field>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-[#071215] p-4"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#819188]">{label}</p><p className="mt-2 text-xl font-black text-white">{value}</p></div>;
}
