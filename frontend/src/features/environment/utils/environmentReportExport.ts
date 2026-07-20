import type { Field } from "../../fields/types/field";
import type {
  DrainageLevel,
  FieldEnvironmentInput,
  IrrigationType,
  RiskLevel,
  SoilTexture,
} from "../types/environment";

export type EnvironmentReportExportInput = {
  field: Field;
  profile: FieldEnvironmentInput;
  generatedAt: string;
};

const soilLabels: Record<SoilTexture, string> = {
  sandy: "Arenoso",
  loamy_sand: "Areia franca",
  loam: "Franco",
  silt_loam: "Franco-siltoso",
  clay_loam: "Franco-argiloso",
  clay: "Argiloso",
  unknown: "Desconhecido",
};

const drainageLabels: Record<DrainageLevel, string> = {
  poor: "Fraca",
  moderate: "Moderada",
  good: "Boa",
  excellent: "Excelente",
  unknown: "Desconhecida",
};

const riskLabels: Record<RiskLevel, string> = {
  low: "Baixo",
  moderate: "Moderado",
  high: "Elevado",
  very_high: "Muito elevado",
  unknown: "Desconhecido",
};

const irrigationLabels: Record<IrrigationType, string> = {
  none: "Sem rega",
  drip: "Gota-a-gota",
  sprinkler: "Aspersão",
  pivot: "Pivô",
  furrow: "Sulcos",
  manual: "Manual",
  other: "Outra",
};

const valueOrUnknown = (value: number | null) => value ?? "Não informado";
const escapeCsvValue = (value: string | number) =>
  `"${String(value).replaceAll('"', '""')}"`;

export function buildEnvironmentReportCsv({
  field,
  profile,
  generatedAt,
}: EnvironmentReportExportInput) {
  const rows: Array<[string, string | number]> = [
    ["Aplicação", "FARPHA 2.1.0"],
    ["Talhão", field.name],
    ["Cultura", field.crop || "Não definida"],
    ["Área (ha)", Number(field.area) || 0],
    ["Confiança dos dados (%)", profile.data_confidence],
    ["Altitude (m)", valueOrUnknown(profile.altitude_m)],
    ["Declive (%)", valueOrUnknown(profile.slope_percent)],
    ["Exposição", profile.exposure === "unknown" ? "Desconhecida" : profile.exposure],
    ["Textura do solo", soilLabels[profile.soil_texture]],
    ["pH do solo", valueOrUnknown(profile.soil_ph)],
    ["Matéria orgânica (%)", valueOrUnknown(profile.organic_matter_percent)],
    ["Drenagem", drainageLabels[profile.drainage]],
    ["Água disponível", profile.water_available ? "Sim" : "Não"],
    ["Tipo de rega", irrigationLabels[profile.irrigation_type]],
    ["Precipitação anual (mm)", valueOrUnknown(profile.annual_rainfall_mm)],
    ["Humidade média (%)", valueOrUnknown(profile.average_humidity_percent)],
    ["Temperatura mínima (°C)", valueOrUnknown(profile.min_temperature_c)],
    ["Temperatura máxima (°C)", valueOrUnknown(profile.max_temperature_c)],
    ["Horas de frio", valueOrUnknown(profile.chill_hours)],
    ["Risco de geada", riskLabels[profile.frost_risk]],
    ["Risco de incêndio", riskLabels[profile.fire_risk]],
    ["Exposição ao vento", riskLabels[profile.wind_exposure]],
    ["Observações", profile.notes.trim() || "Sem observações"],
    ["Gerado em", generatedAt],
  ];

  return [["Campo", "Valor"], ...rows]
    .map((row) => row.map(escapeCsvValue).join(";"))
    .join("\r\n");
}

export function downloadEnvironmentReport(input: EnvironmentReportExportInput) {
  const csv = `\uFEFF${buildEnvironmentReportCsv(input)}`;
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
  anchor.download = `farpha-perfil-ambiental-${safeFieldName}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
