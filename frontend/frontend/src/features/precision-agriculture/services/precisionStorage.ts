import type { PrecisionLayer } from "../types/precision";

const STORAGE_KEY = "farpha.precision.layers.v1";

export const defaultPrecisionLayers: PrecisionLayer[] = [
  { id: "parcels", label: "Talhões", description: "Limites operacionais", enabled: true, opacity: 0.75 },
  { id: "ndvi", label: "NDVI", description: "Vigor vegetativo", enabled: true, opacity: 0.62 },
  { id: "irrigation", label: "Rega", description: "Zonas de água", enabled: false, opacity: 0.55 },
  { id: "alerts", label: "Alertas", description: "Pontos que exigem atenção", enabled: true, opacity: 0.9 },
];

export function loadPrecisionLayers(): PrecisionLayer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPrecisionLayers;
    return JSON.parse(raw) as PrecisionLayer[];
  } catch {
    return defaultPrecisionLayers;
  }
}

export function savePrecisionLayers(layers: PrecisionLayer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layers));
}
