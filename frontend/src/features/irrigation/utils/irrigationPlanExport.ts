import type { Field } from "../../fields/types/field";
import type {
  IrrigationRecommendation,
  IrrigationSystem,
} from "../types/irrigation";

export type IrrigationPlanExportInput = {
  field: Field;
  system: IrrigationSystem | null;
  recommendation: IrrigationRecommendation;
  soilMoisturePercent: number;
  forecastRainMm: number;
  generatedAt: string;
};

const escapeCsvValue = (value: string | number) =>
  `"${String(value).replaceAll('"', '""')}"`;

export function buildIrrigationPlanCsv({
  field,
  system,
  recommendation,
  soilMoisturePercent,
  forecastRainMm,
  generatedAt,
}: IrrigationPlanExportInput) {
  const rows: Array<[string, string | number]> = [
    ["Aplicação", "FARPHA 2.1.0"],
    ["Talhão", field.name],
    ["Cultura", field.crop || "Não definida"],
    ["Área (ha)", Number(field.area) || 0],
    ["Sistema de rega", system?.name ?? "Não configurado"],
    ["Método", system?.method ?? "Não configurado"],
    ["Caudal (L/min)", system?.flow_l_min ?? "Não configurado"],
    ["Eficiência (%)", system?.efficiency_percent ?? "Não configurado"],
    ["Humidade do solo (%)", soilMoisturePercent],
    ["Chuva prevista 24 h (mm)", forecastRainMm],
    ["Necessidade de rega", recommendation.needsIrrigation ? "Sim" : "Não"],
    ["Necessidade estimada (mm)", recommendation.estimatedWaterNeedMm],
    ["Volume estimado (m³)", recommendation.estimatedVolumeM3],
    ["Duração recomendada (min)", recommendation.recommendedMinutes],
    ["Melhor janela", recommendation.bestWindow],
    ["Prioridade", recommendation.priority],
    ["Confiança (%)", recommendation.confidence],
    ["Motivos", recommendation.reasons.join(" | ")],
    ["Alertas", recommendation.warnings.join(" | ") || "Sem alertas"],
    ["Gerado em", generatedAt],
  ];

  return [
    ["Campo", "Valor"],
    ...rows,
  ]
    .map((row) => row.map(escapeCsvValue).join(";"))
    .join("\r\n");
}

export function downloadIrrigationPlan(input: IrrigationPlanExportInput) {
  const csv = `\uFEFF${buildIrrigationPlanCsv(input)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeFieldName = input.field.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "talhao";

  anchor.href = url;
  anchor.download = `farpha-plano-rega-${safeFieldName}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
