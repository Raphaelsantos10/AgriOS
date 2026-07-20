import type {
  FireRiskAssessmentResult,
  FireRiskInput,
  FireRiskLevel,
} from "../../../engines/fire/types";
import type { Field } from "../../fields/types/field";

export type FireRiskReportExportInput = {
  field: Field;
  input: FireRiskInput;
  assessment: FireRiskAssessmentResult;
  notes: string;
  generatedAt: string;
};

const levelLabels: Record<FireRiskLevel, string> = {
  low: "Baixo",
  moderate: "Moderado",
  high: "Elevado",
  very_high: "Muito elevado",
  extreme: "Extremo",
};

const fuelLabels: Record<FireRiskInput["fuelLoad"], string> = {
  low: "Baixa",
  moderate: "Moderada",
  high: "Elevada",
  very_high: "Muito elevada",
};

const valueOrUnknown = (value: number | null) => value ?? "Não informado";
const escapeCsvValue = (value: string | number) =>
  `"${String(value).replaceAll('"', '""')}"`;

export function buildFireRiskReportCsv({
  field,
  input,
  assessment,
  notes,
  generatedAt,
}: FireRiskReportExportInput) {
  const rows: Array<[string, string | number]> = [
    ["Aplicação", "FARPHA 2.1.0"],
    ["Talhão", field.name],
    ["Cultura", field.crop || "Não definida"],
    ["Área (ha)", Number(field.area) || 0],
    ["Risco calculado", `${assessment.score}/100`],
    ["Nível de risco", levelLabels[assessment.level]],
    ["Confiança (%)", assessment.confidence],
    ["Temperatura (°C)", valueOrUnknown(input.temperatureC)],
    ["Humidade relativa (%)", valueOrUnknown(input.humidityPercent)],
    ["Vento (km/h)", valueOrUnknown(input.windSpeedKmh)],
    ["Declive (%)", valueOrUnknown(input.slopePercent)],
    ["Secura da vegetação (%)", valueOrUnknown(input.vegetationDrynessPercent)],
    ["Carga combustível", fuelLabels[input.fuelLoad]],
    ["Incêndio próximo (km)", valueOrUnknown(input.nearbyFireDistanceKm)],
    ["Vento em direção à propriedade", input.windTowardProperty ? "Sim" : "Não"],
    [
      "Fatores",
      assessment.factors
        .map((factor) => `${factor.label}: ${factor.score}/100 — ${factor.explanation}`)
        .join(" | "),
    ],
    ["Ações recomendadas", assessment.recommendations.join(" | ")],
    ["Notas", notes.trim() || "Sem notas"],
    [
      "Aviso de segurança",
      "Avaliação preventiva. Em emergência, siga as autoridades e ligue 112.",
    ],
    ["Gerado em", generatedAt],
  ];

  return [["Campo", "Valor"], ...rows]
    .map((row) => row.map(escapeCsvValue).join(";"))
    .join("\r\n");
}

export function downloadFireRiskReport(input: FireRiskReportExportInput) {
  const csv = `\uFEFF${buildFireRiskReportCsv(input)}`;
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
  anchor.download = `farpha-risco-incendio-${safeFieldName}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
