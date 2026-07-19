import type { FieldEnvironmentInput } from "../../environment/types/environment";
import type { Field } from "../../fields/types/field";
import type {
  IrrigationRecommendation,
  IrrigationSystem,
} from "../types/irrigation";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function cropFactor(crop: string) {
  const value = crop.toLocaleLowerCase("pt");
  if (/laranja|kiwi|milho|tomate|pesseg|pera|maçã|maca/.test(value)) return 1.15;
  if (/vinha|uva|figueira|amendo/.test(value)) return 0.85;
  if (/oliveira|castanheiro|nogueira/.test(value)) return 0.75;
  return 1;
}

export function calculateIrrigationRecommendation(
  field: Field,
  environment: FieldEnvironmentInput,
  system: IrrigationSystem | null,
  soilMoisturePercent: number,
  forecastRainMm: number,
): IrrigationRecommendation {
  const maxTemp = environment.max_temperature_c ?? 28;
  const humidity = environment.average_humidity_percent ?? 55;
  const areaHa = Math.max(Number(field.area) || 0, 0.01);
  const textureFactor =
    environment.soil_texture === "sandy" || environment.soil_texture === "loamy_sand"
      ? 1.2
      : environment.soil_texture === "clay"
        ? 0.78
        : 1;

  const heatNeed = clamp((maxTemp - 18) * 0.32, 0, 7);
  const humidityAdjustment = clamp((65 - humidity) * 0.035, -1, 2.2);
  const moistureDeficit = clamp((38 - soilMoisturePercent) * 0.16, 0, 5.5);
  const rainReduction = clamp(forecastRainMm * 0.75, 0, 8);
  const estimatedWaterNeedMm = clamp(
    (heatNeed + humidityAdjustment + moistureDeficit) * textureFactor * cropFactor(field.crop) - rainReduction,
    0,
    12,
  );

  const estimatedVolumeM3 = estimatedWaterNeedMm * areaHa * 10;
  const effectiveFlowM3Hour = system?.flow_l_min
    ? (system.flow_l_min * 60 * (system.efficiency_percent / 100)) / 1000
    : 0;
  const recommendedMinutes = effectiveFlowM3Hour > 0
    ? Math.round((estimatedVolumeM3 / effectiveFlowM3Hour) * 60)
    : 0;

  const needsIrrigation = estimatedWaterNeedMm >= 1.5 && forecastRainMm < 5;
  const priority = !needsIrrigation
    ? "low"
    : soilMoisturePercent < 18 || estimatedWaterNeedMm >= 8
      ? "critical"
      : soilMoisturePercent < 26 || estimatedWaterNeedMm >= 5
        ? "high"
        : "moderate";

  const knownValues = [
    environment.max_temperature_c,
    environment.average_humidity_percent,
    environment.soil_texture !== "unknown" ? 1 : null,
    system?.flow_l_min,
  ].filter((value) => value !== null && value !== undefined).length;

  const reasons = [
    `Humidade do solo considerada: ${soilMoisturePercent}%.`,
    `Temperatura máxima considerada: ${maxTemp} °C.`,
    `Precipitação prevista considerada: ${forecastRainMm} mm.`,
  ];

  const warnings: string[] = [];
  if (!system) warnings.push("Configure um sistema de rega para calcular a duração.");
  if (!environment.max_temperature_c) warnings.push("Temperatura máxima não preenchida no perfil ambiental.");
  if (environment.soil_texture === "unknown") warnings.push("Textura do solo desconhecida.");
  if (forecastRainMm >= 5) warnings.push("Chuva relevante prevista; confirme antes de regar.");

  return {
    priority,
    needsIrrigation,
    recommendedMinutes,
    estimatedVolumeM3: Number(estimatedVolumeM3.toFixed(1)),
    estimatedWaterNeedMm: Number(estimatedWaterNeedMm.toFixed(1)),
    bestWindow: maxTemp >= 30 ? "05:30–07:30" : "06:00–08:30",
    confidence: clamp(35 + knownValues * 14, 35, 91),
    reasons,
    warnings,
  };
}
