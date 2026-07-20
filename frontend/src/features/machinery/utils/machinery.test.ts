import { describe, expect, it } from "vitest";
import type { Machine } from "../types/machinery";
import { buildMachineryCsv, getMaintenanceState, summarizeMachinery } from "./machinery";

const machines = [
  { id: "1", name: 'Trator "A"', category: "tractor", brand: "Marca", model: "100", registration: "AA", status: "active", currentHours: 500, fuelConsumedLiters: 200, hourlyCost: 25, lastMaintenanceDate: "2026-01-01", nextMaintenanceDate: "2026-07-01", nextMaintenanceHours: 550, notes: "", createdAt: "", updatedAt: "" },
  { id: "2", name: "Alfaia", category: "implement", brand: "", model: "", registration: "", status: "inactive", currentHours: 50, fuelConsumedLiters: 0, hourlyCost: 5, lastMaintenanceDate: "", nextMaintenanceDate: "2026-08-10", nextMaintenanceHours: null, notes: "", createdAt: "", updatedAt: "" },
] as Machine[];
describe("machinery", () => {
  it("deteta manutenção vencida, próxima e em dia", () => { expect(getMaintenanceState(machines[0], "2026-07-20")).toBe("overdue"); expect(getMaintenanceState(machines[1], "2026-07-20")).toBe("due_soon"); expect(getMaintenanceState({ ...machines[1], nextMaintenanceDate: "2027-01-01" }, "2026-07-20")).toBe("ok"); });
  it("resume horas, combustível, alertas e custo estimado", () => { expect(summarizeMachinery(machines, "2026-07-20")).toEqual({ machines: 2, active: 1, maintenanceAlerts: 2, totalHours: 550, totalFuel: 200, estimatedUsageCost: 12750 }); });
  it("exporta manutenção e escapa nomes", () => { const csv = buildMachineryCsv(machines, "2026-07-20", "2026-07-20"); expect(csv).toContain('"Trator ""A"""'); expect(csv).toContain('"Manutenção vencida"'); expect(csv).toContain('"Manutenção próxima"'); });
});
