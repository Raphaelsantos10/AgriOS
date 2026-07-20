import { describe, expect, it } from "vitest";
import type { AgriculturalCost } from "../types/agriculturalCost";
import { buildFinancialReportCsv, buildFinancialSummary, filterFinancialCosts, type FinancialReportFilters } from "./financialReport";

const costs = [
  { id: "1", farm: "Quinta Norte", field: "Vale", category: "labor", description: "Poda", date: "2026-06-10", quantity: 2, unit: "h", unitCost: 15, notes: "", createdAt: "" },
  { id: "2", farm: "Quinta Norte", field: "Serra", category: "fuel", description: "Gasóleo", date: "2026-07-10", quantity: 20, unit: "l", unitCost: 1.5, notes: "", createdAt: "" },
] as AgriculturalCost[];
const filters: FinancialReportFilters = { startDate: "2026-07-01", endDate: "2026-07-31", farm: "norte", field: "", category: "all" };

describe("financialReport", () => {
  it("filtra por período, exploração, talhão e categoria", () => {
    expect(filterFinancialCosts(costs, filters)).toHaveLength(1);
    expect(filterFinancialCosts(costs, { ...filters, field: "vale", startDate: "" })).toHaveLength(1);
    expect(filterFinancialCosts(costs, { ...filters, category: "labor" })).toHaveLength(0);
  });
  it("calcula total, média e maior categoria", () => {
    const summary = buildFinancialSummary(costs);
    expect(summary).toMatchObject({ total: 60, average: 30, entries: 2 });
    expect(summary.topCategory?.total).toBe(30);
  });
  it("exporta filtros, totais e origem transparente", () => {
    const csv = buildFinancialReportCsv(costs, filters, "2026-07-20");
    expect(csv).toContain('"Total de custos (€)";"30"');
    expect(csv).toContain('"Custos reais registados pelo utilizador"');
    expect(csv).not.toContain('"Poda"');
  });
});
