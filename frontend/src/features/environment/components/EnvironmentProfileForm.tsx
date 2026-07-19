import type { FieldEnvironmentInput } from "../types/environment";

function numberValue(value: string) { return value === "" ? null : Number(value); }

export default function EnvironmentProfileForm({ value, onChange, disabled }: { value: FieldEnvironmentInput; onChange: (value: FieldEnvironmentInput) => void; disabled?: boolean }) {
  function patch(next: Partial<FieldEnvironmentInput>) { onChange({ ...value, ...next }); }
  const inputClass = "w-full rounded-xl border border-white/10 bg-[#071215] px-3 py-2.5 text-sm text-white outline-none focus:border-[#9cdf28]/60 disabled:opacity-60";
  return (
    <div className="grid gap-5">
      <FormSection title="Terreno e exposição">
        <NumberField label="Altitude (m)" value={value.altitude_m} onChange={(v) => patch({ altitude_m: v })} />
        <NumberField label="Declive (%)" value={value.slope_percent} onChange={(v) => patch({ slope_percent: v })} />
        <SelectField label="Orientação" value={value.exposure} onChange={(v) => patch({ exposure: v as FieldEnvironmentInput["exposure"] })} options={[['unknown','Por avaliar'],['flat','Plano'],['N','Norte'],['NE','Nordeste'],['E','Este'],['SE','Sudeste'],['S','Sul'],['SW','Sudoeste'],['W','Oeste'],['NW','Noroeste']]} />
      </FormSection>

      <FormSection title="Solo">
        <SelectField label="Textura" value={value.soil_texture} onChange={(v) => patch({ soil_texture: v as FieldEnvironmentInput["soil_texture"] })} options={[['unknown','Por avaliar'],['sandy','Arenoso'],['loamy_sand','Franco-arenoso'],['loam','Franco'],['silt_loam','Franco-limoso'],['clay_loam','Franco-argiloso'],['clay','Argiloso']]} />
        <NumberField label="pH" value={value.soil_ph} step="0.1" onChange={(v) => patch({ soil_ph: v })} />
        <NumberField label="Matéria orgânica (%)" value={value.organic_matter_percent} step="0.1" onChange={(v) => patch({ organic_matter_percent: v })} />
        <SelectField label="Drenagem" value={value.drainage} onChange={(v) => patch({ drainage: v as FieldEnvironmentInput["drainage"] })} options={[['unknown','Por avaliar'],['poor','Fraca'],['moderate','Moderada'],['good','Boa'],['excellent','Excelente']]} />
      </FormSection>

      <FormSection title="Água e rega">
        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#071215] p-3 text-sm font-semibold text-white"><input type="checkbox" checked={value.water_available} onChange={(e) => patch({ water_available: e.target.checked })} disabled={disabled} /> Água disponível na parcela</label>
        <SelectField label="Sistema de rega" value={value.irrigation_type} onChange={(v) => patch({ irrigation_type: v as FieldEnvironmentInput["irrigation_type"] })} options={[['none','Sem rega'],['drip','Gota-a-gota'],['sprinkler','Aspersão'],['pivot','Pivô'],['furrow','Sulcos'],['manual','Manual'],['other','Outro']]} />
        <NumberField label="Precipitação anual (mm)" value={value.annual_rainfall_mm} onChange={(v) => patch({ annual_rainfall_mm: v })} />
        <NumberField label="Humidade média (%)" value={value.average_humidity_percent} onChange={(v) => patch({ average_humidity_percent: v })} />
      </FormSection>

      <FormSection title="Clima e riscos">
        <NumberField label="Temperatura mínima (°C)" value={value.min_temperature_c} step="0.1" onChange={(v) => patch({ min_temperature_c: v })} />
        <NumberField label="Temperatura máxima (°C)" value={value.max_temperature_c} step="0.1" onChange={(v) => patch({ max_temperature_c: v })} />
        <NumberField label="Horas de frio" value={value.chill_hours} onChange={(v) => patch({ chill_hours: v })} />
        <RiskField label="Risco de geada" value={value.frost_risk} onChange={(v) => patch({ frost_risk: v })} />
        <RiskField label="Risco de incêndio" value={value.fire_risk} onChange={(v) => patch({ fire_risk: v })} />
        <RiskField label="Exposição ao vento" value={value.wind_exposure} onChange={(v) => patch({ wind_exposure: v })} />
      </FormSection>

      <label className="grid gap-2 text-sm font-semibold text-[#b8c5bf]">Notas de campo<textarea rows={5} value={value.notes} onChange={(e) => patch({ notes: e.target.value })} className={`${inputClass} resize-none`} disabled={disabled} placeholder="Ex.: neve ocasional no inverno, zona abrigada do vento, solo profundo..." /></label>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) { return <section><h3 className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-[#9cdf28]">{title}</h3><div className="grid gap-3 md:grid-cols-2">{children}</div></section>; }
function NumberField({ label, value, onChange, step = "1" }: { label: string; value: number | null; onChange: (value: number | null) => void; step?: string }) { return <label className="grid gap-2 text-sm font-semibold text-[#b8c5bf]"><span>{label}</span><input type="number" step={step} value={value ?? ""} onChange={(e) => onChange(numberValue(e.target.value))} className="rounded-xl border border-white/10 bg-[#071215] px-3 py-2.5 text-white outline-none focus:border-[#9cdf28]/60" /></label>; }
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string,string][] }) { return <label className="grid gap-2 text-sm font-semibold text-[#b8c5bf]"><span>{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-white/10 bg-[#071215] px-3 py-2.5 text-white outline-none focus:border-[#9cdf28]/60">{options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label>; }
function RiskField({ label, value, onChange }: { label: string; value: FieldEnvironmentInput["frost_risk"]; onChange: (value: FieldEnvironmentInput["frost_risk"]) => void }) { return <SelectField label={label} value={value} onChange={(v) => onChange(v as FieldEnvironmentInput["frost_risk"])} options={[['unknown','Por avaliar'],['low','Baixo'],['moderate','Moderado'],['high','Elevado'],['very_high','Muito elevado']]} />; }
