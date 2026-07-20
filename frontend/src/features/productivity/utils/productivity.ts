import type { HarvestRecord } from "../../harvest/types/harvest";
import { calculateHarvestMetrics } from "../../harvest/utils/harvest";

export type ProductivityDimension = "crop" | "field" | "campaign";
export type ProductivityFilters = { farm: string; crop: string; campaign: string; startDate: string; endDate: string };
export type ProductivityGroup = { key: string; records: number; areaHa: number; grossTons: number; marketableTons: number; lossPercent: number; yieldTonsPerHa: number };

export function filterProductivityRecords(records: HarvestRecord[], filters: ProductivityFilters) {
  const farm = filters.farm.trim().toLowerCase(); const crop = filters.crop.trim().toLowerCase(); const campaign = filters.campaign.trim().toLowerCase();
  return records.filter((record) => (!farm || record.farm.toLowerCase().includes(farm)) && (!crop || record.crop.toLowerCase().includes(crop)) && (!campaign || record.campaign.toLowerCase().includes(campaign)) && (!filters.startDate || record.harvestDate >= filters.startDate) && (!filters.endDate || record.harvestDate <= filters.endDate));
}

export function groupProductivity(records: HarvestRecord[], dimension: ProductivityDimension): ProductivityGroup[] {
  const groups = new Map<string, HarvestRecord[]>();
  records.forEach((record) => { const key = dimension === "crop" ? record.crop : dimension === "field" ? `${record.farm} / ${record.field}` : record.campaign; groups.set(key, [...(groups.get(key) ?? []), record]); });
  return [...groups.entries()].map(([key, items]) => { const totals = items.reduce((acc, record) => { const metrics = calculateHarvestMetrics(record); acc.area += Math.max(0, record.harvestedAreaHa); acc.gross += metrics.grossKg; acc.marketable += metrics.marketableKg; return acc; }, { area: 0, gross: 0, marketable: 0 }); const loss = Math.max(0, totals.gross - totals.marketable); return { key, records: items.length, areaHa: Number(totals.area.toFixed(2)), grossTons: Number((totals.gross / 1000).toFixed(2)), marketableTons: Number((totals.marketable / 1000).toFixed(2)), lossPercent: totals.gross ? Number(((loss / totals.gross) * 100).toFixed(2)) : 0, yieldTonsPerHa: totals.area ? Number(((totals.gross / 1000) / totals.area).toFixed(2)) : 0 }; }).sort((a, b) => b.yieldTonsPerHa - a.yieldTonsPerHa || a.key.localeCompare(b.key));
}

const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
export function buildProductivityCsv(groups: ProductivityGroup[], dimension: ProductivityDimension, generatedAt: string) { const labels: Record<ProductivityDimension, string> = { crop: "Cultura", field: "Exploração / Talhão", campaign: "Campanha" }; const rows = groups.map((group, index) => [index + 1, group.key, group.records, group.areaHa, group.grossTons, group.marketableTons, group.lossPercent, group.yieldTonsPerHa, generatedAt]); return [["Posição", labels[dimension], "Registos", "Área (ha)", "Produção bruta (t)", "Comercializável (t)", "Perdas (%)", "Produtividade (t/ha)", "Exportado em"], ...rows].map((row) => row.map(escapeCsv).join(";")).join("\r\n"); }
export function downloadProductivityCsv(groups: ProductivityGroup[], dimension: ProductivityDimension, generatedAt: string) { const blob = new Blob([`\uFEFF${buildProductivityCsv(groups, dimension, generatedAt)}`], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "farpha-dashboard-produtividade.csv"; anchor.click(); URL.revokeObjectURL(url); }
