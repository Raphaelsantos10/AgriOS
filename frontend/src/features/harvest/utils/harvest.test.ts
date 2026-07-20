import { describe, expect, it } from "vitest";
import type { HarvestRecord } from "../types/harvest";
import { buildHarvestCsv, calculateHarvestMetrics, summarizeHarvest } from "./harvest";
const records = [
  { id: "1", campaign: "2026", farm: "Quinta", field: "Norte", crop: 'Maçã "Gala"', harvestDate: "2026-09-01", harvestedAreaHa: 2, grossQuantity: 10, marketableQuantity: 9, unit: "t", quality: "premium", destination: "Mercado", notes: "", createdAt: "" },
  { id: "2", campaign: "2026", farm: "Quinta", field: "Sul", crop: "Pera", harvestDate: "2026-09-02", harvestedAreaHa: 1, grossQuantity: 2000, marketableQuantity: 1500, unit: "kg", quality: "first", destination: "Cooperativa", notes: "", createdAt: "" },
] as HarvestRecord[];
describe("harvest", () => {
  it("calcula perdas e produtividade convertendo toneladas", () => { expect(calculateHarvestMetrics(records[0])).toEqual({ grossKg: 10000, marketableKg: 9000, lossKg: 1000, lossPercent: 10, yieldTonsPerHa: 5 }); });
  it("consolida produção, perdas e produtividade", () => { expect(summarizeHarvest(records)).toEqual({ records: 2, grossTons: 12, marketableTons: 10.5, lossTons: 1.5, lossPercent: 12.5, yieldTonsPerHa: 4 }); });
  it("exporta qualidade e escapa a cultura", () => { const csv = buildHarvestCsv(records, "2026-07-20"); expect(csv).toContain('"Maçã ""Gala"""'); expect(csv).toContain('"Premium"'); expect(csv).toContain('"5";"Premium"'); });
});
