import { describe, expect, it } from "vitest";
import type { AgriculturalTreatmentDraft } from "../types/treatment";
import { addCalendarDays, assessTreatment, harvestRestriction } from "./treatmentCompliance";
const base: AgriculturalTreatmentDraft = { kind: "plant_protection", date: "2026-07-21", farm: "Quinta", field: "Norte", crop: "Vinha", areaHectares: 2, applicator: "Ana", applicatorCard: "APF-1", applicatorCardExpiry: "2027-01-01", productName: "Produto A", inventoryProductId: "", authorizationNumber: "AV-1", dose: 1, doseUnit: "L/ha", totalQuantity: 2, equipment: "Pulverizador", machineId: "", equipmentInspectionExpiry: "2027-01-01", weather: "Vento fraco", safetyIntervalDays: 14, notes: "" };
describe("tratamentos agrícolas", () => {
  it("calcula a primeira data de colheita pelo intervalo indicado", () => { expect(addCalendarDays("2026-07-21", 14)).toBe("2026-08-04"); });
  it("rejeita um fitofármaco sem autorização, cartão e equipamento", () => { const result = assessTreatment({ ...base, authorizationNumber: "", applicatorCard: "", equipment: "" }, "2026-07-21"); expect(result.valid).toBe(false); expect(result.errors.join(" ")).toContain("autorização"); });
  it("mantém ativa a restrição de colheita até à data calculada", () => { expect(harvestRestriction({ kind: "plant_protection", harvestAllowedFrom: "2026-08-04" }, "2026-08-03")).toBe("active"); expect(harvestRestriction({ kind: "plant_protection", harvestAllowedFrom: "2026-08-04" }, "2026-08-04")).toBe("elapsed"); });
});
