import { describe, expect, it } from "vitest";
import type { AgriculturalCost } from "../types/agriculturalCost";
import { buildAgriculturalCostsCsv, calculateCostTotal, summarizeAgriculturalCosts } from "./agriculturalCosts";

const costs = [
  { id: "1", farm: "Quinta", field: "Norte", category: "labor", description: 'Poda "manual"', date: "2026-07-20", quantity: 3, unit: "hora", unitCost: 12, notes: "", createdAt: "" },
  { id: "2", farm: "Quinta", field: "Norte", category: "fuel", description: "Gasóleo", date: "2026-07-20", quantity: 10, unit: "litro", unitCost: 1.5, notes: "", createdAt: "" },
] as AgriculturalCost[];

describe("agriculturalCosts", () => {
  it("calcula quantidade por preço unitário sem aceitar valores negativos", () => {
    expect(calculateCostTotal(costs[0])).toBe(36);
    expect(calculateCostTotal({ quantity: -2, unitCost: 10 })).toBe(0);
  });
  it("resume o total e os valores por categoria", () => {
    const summary = summarizeAgriculturalCosts(costs);
    expect(summary).toMatchObject({ total: 51, entries: 2 });
    expect(summary.byCategory.labor).toBe(36);
    expect(summary.byCategory.fuel).toBe(15);
  });
  it("exporta valores e escapa descrições CSV", () => {
    const csv = buildAgriculturalCostsCsv(costs, "2026-07-20");
    expect(csv).toContain('"Poda ""manual"""');
    expect(csv).toContain('"Mão de obra"');
    expect(csv).toContain('"36"');
  });
});
