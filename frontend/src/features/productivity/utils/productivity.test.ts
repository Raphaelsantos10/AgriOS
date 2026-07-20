import { describe, expect, it } from "vitest";
import type { HarvestRecord } from "../../harvest/types/harvest";
import { buildProductivityCsv, filterProductivityRecords, groupProductivity } from "./productivity";

const records = [
  { id: "1", campaign: "2025/26", farm: "Quinta Sul", field: "A", crop: "Milho", harvestDate: "2026-05-01", harvestedAreaHa: 2, grossQuantity: 20, marketableQuantity: 18, unit: "t", quality: "first", destination: "", notes: "", createdAt: "" },
  { id: "2", campaign: "2025/26", farm: "Quinta Sul", field: "B", crop: "Milho", harvestDate: "2026-05-02", harvestedAreaHa: 1, grossQuantity: 8, marketableQuantity: 7, unit: "t", quality: "second", destination: "", notes: "", createdAt: "" },
  { id: "3", campaign: "2024/25", farm: "Quinta Norte", field: "C", crop: "Trigo", harvestDate: "2025-06-01", harvestedAreaHa: 2, grossQuantity: 10, marketableQuantity: 9, unit: "t", quality: "first", destination: "", notes: "", createdAt: "" },
] as HarvestRecord[];

describe("productivity dashboard", () => {
  it("agrega produtividade ponderada por cultura e ordena o ranking", () => { const groups = groupProductivity(records, "crop"); expect(groups[0]).toMatchObject({ key: "Milho", records: 2, areaHa: 3, grossTons: 28, yieldTonsPerHa: 9.33 }); expect(groups[1].key).toBe("Trigo"); });
  it("filtra por exploração, campanha e datas", () => { expect(filterProductivityRecords(records, { farm: "sul", crop: "milho", campaign: "2025/26", startDate: "2026-01-01", endDate: "2026-12-31" })).toHaveLength(2); });
  it("exporta ranking e indicadores com a dimensão identificada", () => { const csv = buildProductivityCsv(groupProductivity(records, "field"), "field", "2026-07-20"); expect(csv).toContain('"Exploração / Talhão"'); expect(csv).toContain('"Quinta Sul / A"'); expect(csv).toContain('"10"'); });
});
