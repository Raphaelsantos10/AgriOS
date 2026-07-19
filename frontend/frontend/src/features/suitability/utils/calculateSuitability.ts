import type { Crop, CropProfile } from "../../crops/types/crop";
import type { FieldEnvironmentInput } from "../../environment/types/environment";
import type { CropSuitabilityResult, SuitabilityFactor } from "../types/suitability";

function asProfile(value: unknown): CropProfile | null {
  return value && typeof value === "object" ? (value as CropProfile) : null;
}

function rangeScore(value: number | null, profile: CropProfile | null) {
  if (value == null || !profile || profile.min == null || profile.max == null) return null;
  if (value >= profile.min && value <= profile.max) return 100;
  const range = Math.max(profile.max - profile.min, 1);
  const distance = value < profile.min ? profile.min - value : value - profile.max;
  return Math.max(0, Math.round(100 - (distance / range) * 100));
}

function toleranceScore(level: Crop["frostTolerance"] | Crop["heatTolerance"], risk: FieldEnvironmentInput["frost_risk"] | FieldEnvironmentInput["fire_risk"]) {
  if (!level || risk === "unknown") return null;
  const tolerance = { low: 35, medium: 70, high: 100 }[level];
  const pressure = { low: 20, moderate: 45, high: 75, very_high: 100 }[risk];
  return Math.max(0, Math.min(100, Math.round(100 - Math.max(0, pressure - tolerance))));
}

function waterNeed(crop: Crop) {
  const need = String(crop.waterProfile.need ?? "");
  if (need === "high") return 100;
  if (need === "medium_high") return 82;
  if (need === "medium") return 62;
  if (need === "low_medium") return 42;
  if (need === "low") return 25;
  return 55;
}

function waterScore(crop: Crop, env: FieldEnvironmentInput, assumeIrrigation: boolean) {
  const supply = assumeIrrigation || env.water_available || env.irrigation_type !== "none" ? 100 : 35;
  return Math.max(0, Math.round(100 - Math.max(0, waterNeed(crop) - supply)));
}

function drainageScore(crop: Crop, env: FieldEnvironmentInput) {
  if (env.drainage === "unknown") return null;
  const required = String(crop.soilProfile.drainage ?? "");
  const actual = { poor: 20, moderate: 50, good: 80, excellent: 100 }[env.drainage];
  const target = required === "excellent" ? 100 : required === "good" ? 80 : 60;
  return Math.max(0, 100 - Math.abs(target - actual));
}

function createFactor(id: string, label: string, score: number | null, weight: number, detail: string): SuitabilityFactor {
  return { id, label, score: score ?? 50, weight, known: score != null, detail };
}

function weightedScore(factors: SuitabilityFactor[]) {
  const known = factors.filter((factor) => factor.known);
  if (!known.length) return 50;
  const totalWeight = known.reduce((sum, factor) => sum + factor.weight, 0);
  return Math.round(known.reduce((sum, factor) => sum + factor.score * factor.weight, 0) / totalWeight);
}

export function calculateCropSuitability(crop: Crop, env: FieldEnvironmentInput): CropSuitabilityResult {
  const ph = rangeScore(env.soil_ph, asProfile(crop.soilProfile.ph));
  const chill = rangeScore(env.chill_hours, asProfile(crop.climateProfile.winter_chill));
  const frost = toleranceScore(crop.frostTolerance, env.frost_risk);
  const heat = toleranceScore(crop.heatTolerance, env.fire_risk);
  const drainage = drainageScore(crop, env);
  const water = waterScore(crop, env, false);
  const waterWithIrrigation = waterScore(crop, env, true);

  const factors = [
    createFactor("soil_ph", "pH do solo", ph, 24, ph == null ? "Adicione o pH para aumentar a confiança." : `pH registado: ${env.soil_ph}`),
    createFactor("chill", "Horas de frio", chill, 20, chill == null ? "Horas de frio ainda não registadas." : `${env.chill_hours} horas registadas.`),
    createFactor("water", "Disponibilidade de água", water, 22, env.water_available ? "Água disponível no talhão." : "Sem disponibilidade de água confirmada."),
    createFactor("frost", "Compatibilidade com geada", frost, 14, `Risco de geada: ${env.frost_risk}.`),
    createFactor("heat", "Tolerância ao calor", heat, 10, `Risco térmico/incêndio: ${env.fire_risk}.`),
    createFactor("drainage", "Drenagem", drainage, 10, `Drenagem registada: ${env.drainage}.`),
  ];

  const irrigationFactors = factors.map((factor) => factor.id === "water" ? { ...factor, score: waterWithIrrigation, known: true, detail: "Cenário com rega disponível." } : factor);
  const score = weightedScore(factors);
  const scoreWithIrrigation = weightedScore(irrigationFactors);
  const knownWeight = factors.filter((factor) => factor.known).reduce((sum, factor) => sum + factor.weight, 0);
  const confidence = Math.round((knownWeight / factors.reduce((sum, factor) => sum + factor.weight, 0)) * 100);

  const strengths = factors.filter((factor) => factor.known && factor.score >= 78).map((factor) => `${factor.label}: condição favorável.`).slice(0, 3);
  const warnings = factors.filter((factor) => factor.known && factor.score < 55).map((factor) => `${factor.label}: requer atenção.`).slice(0, 3);

  return { crop, score, scoreWithIrrigation, confidence, factors, strengths, warnings };
}
