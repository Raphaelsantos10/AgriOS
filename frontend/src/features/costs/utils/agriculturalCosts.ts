import type { AgriculturalCost, AgriculturalCostCategory } from "../types/agriculturalCost";

export const categoryLabels: Record<AgriculturalCostCategory, string> = {
  labor: "Mão de obra", water: "Água", fuel: "Combustível", product: "Produto", machine: "Máquina", other: "Outro",
};

export const calculateCostTotal = (cost: Pick<AgriculturalCost, "quantity" | "unitCost">) =>
  Number((Math.max(0, cost.quantity) * Math.max(0, cost.unitCost)).toFixed(2));

export function summarizeAgriculturalCosts(costs: AgriculturalCost[]) {
  const byCategory = Object.fromEntries(Object.keys(categoryLabels).map((category) => [category, 0])) as Record<AgriculturalCostCategory, number>;
  costs.forEach((cost) => { byCategory[cost.category] += calculateCostTotal(cost); });
  return { total: Number(costs.reduce((sum, cost) => sum + calculateCostTotal(cost), 0).toFixed(2)), entries: costs.length, byCategory };
}

const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
export function buildAgriculturalCostsCsv(costs: AgriculturalCost[], generatedAt: string) {
  const rows = costs.map((cost) => [cost.id, cost.date, cost.farm, cost.field || "Exploração inteira", categoryLabels[cost.category], cost.description, cost.quantity, cost.unit, cost.unitCost, calculateCostTotal(cost), cost.notes, generatedAt]);
  return [["ID", "Data", "Exploração", "Talhão", "Categoria", "Descrição", "Quantidade", "Unidade", "Preço unitário (€)", "Total (€)", "Observações", "Exportado em"], ...rows]
    .map((row) => row.map(escapeCsv).join(";"))
    .join("\r\n");
}

export function downloadAgriculturalCostsCsv(costs: AgriculturalCost[], generatedAt: string) {
  const blob = new Blob([`\uFEFF${buildAgriculturalCostsCsv(costs, generatedAt)}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
  anchor.href = url; anchor.download = "farpha-custos-agricolas.csv"; anchor.click(); URL.revokeObjectURL(url);
}
