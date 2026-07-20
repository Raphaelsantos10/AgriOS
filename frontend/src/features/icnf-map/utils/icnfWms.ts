export type WmsBounds = { west: number; south: number; east: number; north: number };
export type IcnfLayerId = "hazard" | "burned" | "water" | "critical";
export type IcnfLayer = { id: IcnfLayerId; label: string; description: string; endpoint: string; layerName: string; color: string };
export const icnfLayers: IcnfLayer[] = [
  { id: "hazard", label: "Perigosidade estrutural", description: "Carta 2020–2030, cinco classes de perigosidade.", endpoint: "https://si.icnf.pt/wms/perigosidade_estrutural_2020_2030", layerName: "BDG:perigosidade_incendio", color: "#dc2626" },
  { id: "burned", label: "Área ardida 2025", description: "Territórios ardidos registados em 2025.", endpoint: "https://si.icnf.pt/wms/areas_ardidas", layerName: "BDG:ardida_2025", color: "#111827" },
  { id: "water", label: "Pontos de água", description: "Rede de pontos de água para apoio à defesa da floresta.", endpoint: "https://si.icnf.pt/wms/pontos_agua", layerName: "BDG:pontos_agua", color: "#2563eb" },
  { id: "critical", label: "Locais críticos", description: "Locais críticos com risco de incêndio.", endpoint: "https://si.icnf.pt/wms/locais_criticos_incendio", layerName: "BDG:locais_criticos", color: "#f97316" },
];
export function buildIcnfWmsUrl(layer: IcnfLayer, bounds: WmsBounds, size = 1024) { const url = new URL(layer.endpoint); url.search = new URLSearchParams({ service: "WMS", version: "1.1.1", request: "GetMap", layers: layer.layerName, styles: "", format: "image/png", transparent: "true", srs: "EPSG:4326", bbox: [bounds.west, bounds.south, bounds.east, bounds.north].map((value) => value.toFixed(6)).join(","), width: String(size), height: String(size) }).toString(); return url.toString(); }
export function imageCoordinates(bounds: WmsBounds): [[number, number], [number, number], [number, number], [number, number]] { return [[bounds.west, bounds.north], [bounds.east, bounds.north], [bounds.east, bounds.south], [bounds.west, bounds.south]]; }
