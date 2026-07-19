import type { PrecisionRecommendation, SatelliteObservation, VegetationIndex } from "../types/precision";

const values: Record<VegetationIndex, Record<string, number[]>> = {
  ndvi: {
    north: [0.61, 0.64, 0.66, 0.69, 0.72],
    south: [0.59, 0.57, 0.55, 0.53, 0.51],
    orchard: [0.48, 0.44, 0.40, 0.35, 0.31],
  },
  ndre: {
    north: [0.42, 0.44, 0.47, 0.49, 0.52],
    south: [0.41, 0.40, 0.39, 0.37, 0.36],
    orchard: [0.36, 0.34, 0.31, 0.29, 0.26],
  },
  ndmi: {
    north: [0.31, 0.33, 0.34, 0.36, 0.38],
    south: [0.34, 0.32, 0.30, 0.28, 0.25],
    orchard: [0.29, 0.27, 0.24, 0.21, 0.18],
  },
};

const fields = [
  { id: "north", name: "Talhão Norte" },
  { id: "south", name: "Talhão Sul" },
  { id: "orchard", name: "Pomar Este" },
];
const dates = ["2026-06-14", "2026-06-21", "2026-06-28", "2026-07-05", "2026-07-12"];

export const satelliteObservations: SatelliteObservation[] = (Object.keys(values) as VegetationIndex[]).flatMap((index) =>
  fields.flatMap((field) => values[index][field.id].map((value, position) => ({
    id: `${index}-${field.id}-${dates[position]}`,
    fieldId: field.id,
    fieldName: field.name,
    capturedAt: dates[position],
    cloudCoverage: [12, 18, 9, 14, 8][position],
    index,
    averageValue: value,
    minimumValue: Math.max(0, value - 0.11),
    maximumValue: Math.min(1, value + 0.12),
    status: value >= 0.6 ? "healthy" : value >= 0.4 ? "attention" : "critical",
  }))),
);

export const precisionRecommendations: PrecisionRecommendation[] = [
  {
    id: "rec-orchard",
    fieldId: "orchard",
    title: "Inspecionar o Pomar Este",
    description: "O vigor caiu de forma contínua nas últimas cinco observações e encontra-se em nível crítico.",
    priority: "high",
    action: "Criar missão de inspeção",
  },
  {
    id: "rec-south",
    fieldId: "south",
    title: "Rever a distribuição da rega",
    description: "O Talhão Sul apresenta perda gradual de humidade e redução do índice vegetativo.",
    priority: "medium",
    action: "Abrir plano de irrigação",
  },
  {
    id: "rec-north",
    fieldId: "north",
    title: "Manter monitorização semanal",
    description: "O Talhão Norte mantém evolução positiva e não requer intervenção imediata.",
    priority: "low",
    action: "Agendar nova leitura",
  },
];
