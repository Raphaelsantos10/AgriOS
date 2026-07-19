import { AlertTriangle, CheckCircle2, Droplets, Flame, Mountain, Snowflake, TestTube2 } from "lucide-react";
import type { FieldEnvironmentInput } from "../types/environment";
import { calculateEnvironmentConfidence, getEnvironmentReadiness } from "../utils/environmentScore";

const riskLabels = { low: "Baixo", moderate: "Moderado", high: "Elevado", very_high: "Muito elevado", unknown: "Por avaliar" };
const soilLabels = { sandy: "Arenoso", loamy_sand: "Franco-arenoso", loam: "Franco", silt_loam: "Franco-limoso", clay_loam: "Franco-argiloso", clay: "Argiloso", unknown: "Por avaliar" };

export default function EnvironmentProfilePanel({ profile }: { profile: FieldEnvironmentInput }) {
  const confidence = calculateEnvironmentConfidence(profile);
  const cards = [
    { label: "Altitude", value: profile.altitude_m === null ? "—" : `${profile.altitude_m} m`, icon: Mountain },
    { label: "Solo", value: soilLabels[profile.soil_texture], icon: TestTube2 },
    { label: "pH", value: profile.soil_ph === null ? "—" : profile.soil_ph.toFixed(1), icon: TestTube2 },
    { label: "Água", value: profile.water_available ? "Disponível" : "Não registada", icon: Droplets },
    { label: "Geada", value: riskLabels[profile.frost_risk], icon: Snowflake },
    { label: "Incêndio", value: riskLabels[profile.fire_risk], icon: Flame },
  ];

  return (
    <aside className="space-y-4">
      <section className="rounded-3xl border border-white/10 bg-[#0b171a] p-5">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9cdf28]">Qualidade dos dados</p><h2 className="mt-1 text-2xl font-black text-white">{confidence}%</h2></div>
          {confidence >= 55 ? <CheckCircle2 className="text-[#9cdf28]" size={30} /> : <AlertTriangle className="text-amber-400" size={30} />}
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#5f9912] to-[#9cdf28]" style={{ width: `${confidence}%` }} /></div>
        <p className="mt-3 text-sm leading-6 text-[#9aa9a2]">{getEnvironmentReadiness(profile)}</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-[#0b171a] p-4">
            <Icon size={18} className="text-[#9cdf28]" />
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#75867e]">{label}</p>
            <p className="mt-1 font-black text-white">{value}</p>
          </div>
        ))}
      </section>
    </aside>
  );
}
