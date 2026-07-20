import { ArrowLeft, Download, LoaderCircle, Save, Sprout } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFieldById } from "../../fields/services/fieldsService";
import type { Field } from "../../fields/types/field";
import EnvironmentProfileForm from "../components/EnvironmentProfileForm";
import EnvironmentProfilePanel from "../components/EnvironmentProfilePanel";
import { getEnvironmentProfile, saveEnvironmentProfile } from "../services/environmentService";
import type { FieldEnvironmentInput } from "../types/environment";
import { calculateEnvironmentConfidence } from "../utils/environmentScore";
import { downloadEnvironmentReport } from "../utils/environmentReportExport";

function emptyProfile(fieldId: string, farmId: string): FieldEnvironmentInput { return { field_id: fieldId, farm_id: farmId, altitude_m: null, slope_percent: null, exposure: "unknown", soil_texture: "unknown", soil_ph: null, organic_matter_percent: null, drainage: "unknown", water_available: false, irrigation_type: "none", annual_rainfall_mm: null, average_humidity_percent: null, min_temperature_c: null, max_temperature_c: null, chill_hours: null, frost_risk: "unknown", fire_risk: "unknown", wind_exposure: "unknown", data_confidence: 5, notes: "" }; }

export default function FieldEnvironmentPage() {
  const { farmId = "", fieldId = "" } = useParams();
  const [field, setField] = useState<Field | null>(null);
  const [profile, setProfile] = useState<FieldEnvironmentInput>(() => emptyProfile(fieldId, farmId));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [fieldData, profileData] = await Promise.all([getFieldById(fieldId), getEnvironmentProfile(fieldId)]);
        if (!active) return;
        setField(fieldData);
        setProfile(profileData ? { ...profileData } : emptyProfile(fieldId, farmId));
      } catch (error) { console.error("ENVIRONMENT PROFILE LOAD ERROR", error); if (active) setMessage("Não foi possível carregar o perfil ambiental."); }
      finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [farmId, fieldId]);

  const calculatedProfile = useMemo(() => ({ ...profile, data_confidence: calculateEnvironmentConfidence(profile) }), [profile]);

  async function handleSave() {
    try { setSaving(true); setMessage(null); const saved = await saveEnvironmentProfile(calculatedProfile); setProfile({ ...saved }); setMessage("Perfil ambiental guardado com sucesso."); }
    catch (error) { console.error("ENVIRONMENT PROFILE SAVE ERROR", error); setMessage("Não foi possível guardar. Confirme se executou o SQL no Supabase."); }
    finally { setSaving(false); }
  }

  function handleExportReport() {
    if (!field) return;

    downloadEnvironmentReport({
      field,
      profile: calculatedProfile,
      generatedAt: new Date().toISOString(),
    });
    setMessage("Perfil ambiental exportado em CSV.");
  }

  if (loading) return <div className="flex min-h-[520px] items-center justify-center gap-3 bg-[#061014] text-[#9aa9a2]"><LoaderCircle className="animate-spin text-[#9cdf28]" /> A carregar perfil ambiental…</div>;

  return (
    <section className="-m-4 min-h-full bg-[radial-gradient(circle_at_top_right,rgba(156,223,40,0.08),transparent_28%),#061014] p-4 text-white md:-m-6 md:p-6 xl:-m-7 xl:p-7">
      <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <Link to={`/exploracoes/${farmId}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#9cdf28] hover:underline"><ArrowLeft size={17} /> Voltar à exploração</Link>
          <div className="mt-4 flex items-center gap-3"><div className="rounded-2xl bg-[#9cdf28]/10 p-3 text-[#9cdf28]"><Sprout size={25} /></div><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#9cdf28]">Environment Engine V1</p><h1 className="mt-1 text-3xl font-black">Perfil ambiental · {field?.name ?? "Talhão"}</h1></div></div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#9aa9a2]">Registe solo, relevo, água, clima e riscos. Estes dados alimentarão a aptidão de culturas, rega inteligente, Fire Intelligence e FARPHA DNA.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={handleExportReport} disabled={!field} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9cdf28]/30 bg-[#9cdf28]/10 px-5 py-3 font-black text-[#dfffb0] disabled:opacity-40"><Download size={18} /> Exportar perfil CSV</button>
          <button type="button" onClick={() => void handleSave()} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5f9912] to-[#9cdf28] px-5 py-3 font-black text-[#061014] disabled:opacity-60"><Save size={18} /> {saving ? "A guardar…" : "Guardar perfil"}</button>
        </div>
      </header>

      {message && <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[#d8e1dd]">{message}</div>}
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-3xl border border-white/10 bg-[#0b171a] p-5 md:p-6"><EnvironmentProfileForm value={calculatedProfile} onChange={setProfile} disabled={saving} /></div>
        <EnvironmentProfilePanel profile={calculatedProfile} />
      </div>
    </section>
  );
}
