import type { SatelliteObservation, VegetationIndex } from "../types/precision";

export function filterObservations(observations: SatelliteObservation[], index: VegetationIndex, fieldId: string) {
  return observations
    .filter((item) => item.index === index && (fieldId === "all" || item.fieldId === fieldId))
    .sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
}

export function latestByField(observations: SatelliteObservation[]) {
  const latest = new Map<string, SatelliteObservation>();
  observations.forEach((item) => {
    const current = latest.get(item.fieldId);
    if (!current || item.capturedAt > current.capturedAt) latest.set(item.fieldId, item);
  });
  return [...latest.values()];
}

export function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function percentageDelta(first: number, last: number) {
  if (!first) return 0;
  return ((last - first) / first) * 100;
}

export function downloadObservationsCsv(observations: SatelliteObservation[]) {
  const header = ["Talhão", "Data", "Índice", "Média", "Mínimo", "Máximo", "Nuvens", "Estado"];
  const rows = observations.map((item) => [
    item.fieldName,
    item.capturedAt,
    item.index.toUpperCase(),
    item.averageValue.toFixed(3),
    item.minimumValue.toFixed(3),
    item.maximumValue.toFixed(3),
    `${item.cloudCoverage}%`,
    item.status,
  ]);
  const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "farpha-observacoes-satelite.csv";
  link.click();
  URL.revokeObjectURL(url);
}
