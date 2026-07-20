import type { AgriculturalCost, AgriculturalCostCategory } from "../types/agriculturalCost";
import { calculateCostTotal, categoryLabels } from "./agriculturalCosts";

export type FinancialReportFilters = {
  startDate: string;
  endDate: string;
  farm: string;
  field: string;
  category: "all" | AgriculturalCostCategory;
};

export function filterFinancialCosts(costs: AgriculturalCost[], filters: FinancialReportFilters) {
  const farm = filters.farm.trim().toLowerCase();
  const field = filters.field.trim().toLowerCase();
  return costs.filter((cost) =>
    (!filters.startDate || cost.date >= filters.startDate) &&
    (!filters.endDate || cost.date <= filters.endDate) &&
    (!farm || cost.farm.toLowerCase().includes(farm)) &&
    (!field || cost.field.toLowerCase().includes(field)) &&
    (filters.category === "all" || cost.category === filters.category)
  );
}

export function buildFinancialSummary(costs: AgriculturalCost[]) {
  const total = Number(costs.reduce((sum, cost) => sum + calculateCostTotal(cost), 0).toFixed(2));
  const byCategory = Object.fromEntries(Object.keys(categoryLabels).map((key) => [key, 0])) as Record<AgriculturalCostCategory, number>;
  const byFarm: Record<string, number> = {};
  const byField: Record<string, number> = {};
  costs.forEach((cost) => {
    const value = calculateCostTotal(cost);
    byCategory[cost.category] += value;
    byFarm[cost.farm] = (byFarm[cost.farm] ?? 0) + value;
    const fieldKey = cost.field || "Exploração inteira";
    byField[fieldKey] = (byField[fieldKey] ?? 0) + value;
  });
  const topCategory = (Object.entries(byCategory) as Array<[AgriculturalCostCategory, number]>).sort((a, b) => b[1] - a[1])[0];
  return {
    total,
    entries: costs.length,
    average: costs.length ? Number((total / costs.length).toFixed(2)) : 0,
    topCategory: topCategory?.[1] ? { category: topCategory[0], label: categoryLabels[topCategory[0]], total: Number(topCategory[1].toFixed(2)) } : null,
    byCategory,
    byFarm,
    byField,
  };
}

const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
export function buildFinancialReportCsv(costs: AgriculturalCost[], filters: FinancialReportFilters, generatedAt: string) {
  const filtered = filterFinancialCosts(costs, filters);
  const summary = buildFinancialSummary(filtered);
  const rows: Array<Array<string | number>> = [
    ["Resumo", "Período inicial", filters.startDate || "Sem limite", ""],
    ["Resumo", "Período final", filters.endDate || "Sem limite", ""],
    ["Resumo", "Total de custos (€)", summary.total, ""],
    ["Resumo", "Custo médio (€)", summary.average, ""],
    ["Resumo", "Lançamentos", summary.entries, ""],
  ];
  Object.entries(summary.byCategory).filter(([, value]) => value > 0).forEach(([category, value]) => rows.push(["Categoria", categoryLabels[category as AgriculturalCostCategory], Number(value.toFixed(2)), ""]));
  filtered.forEach((cost) => rows.push([cost.date, `${cost.farm} / ${cost.field || "Exploração inteira"}`, categoryLabels[cost.category], calculateCostTotal(cost)]));
  rows.push(["Relatório", "Gerado em", generatedAt, "Custos reais registados pelo utilizador"]);
  return [["Secção/Data", "Indicador/Local", "Categoria/Valor", "Total/Origem"], ...rows].map((row) => row.map(escapeCsv).join(";")).join("\r\n");
}

export function downloadFinancialReportCsv(costs: AgriculturalCost[], filters: FinancialReportFilters, generatedAt: string) {
  const blob = new Blob([`\uFEFF${buildFinancialReportCsv(costs, filters, generatedAt)}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
  anchor.href = url; anchor.download = "farpha-relatorio-financeiro.csv"; anchor.click(); URL.revokeObjectURL(url);
}
