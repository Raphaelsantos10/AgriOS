import { beforeEach, describe, expect, it } from "vitest";
import { parseSoilGridsResponse } from "../services/soilGridsService";
import { registerSoilRequest } from "../services/soilCache";
import type { SoilProfile } from "../types/soil";
import { buildSoilCsv, estimateUncertainty } from "./soilProfile";
const memory = new Map<string, string>(); beforeEach(() => { memory.clear(); Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: (key: string) => memory.get(key) ?? null, setItem: (key: string, value: string) => memory.set(key, value) } }); });
describe("soil profile", () => {
  it("converte fatores e preserva intervalos e unidades", () => { const values = parseSoilGridsResponse({ properties: { layers: [{ name: "phh2o", unit_measure: { d_factor: 10, target_units: "pH" }, depths: [{ label: "0-5cm", values: { mean: 62, "Q0.05": 51, "Q0.95": 73 } }] }] } }); expect(values[0]).toEqual({ property: "phh2o", depth: "0-5cm", mean: 6.2, low: 5.1, high: 7.3, unit: "pH" }); expect(estimateUncertainty(values[0])).toBe(35.5); });
  it("impõe no máximo cinco consultas por minuto", () => { for (let index = 0; index < 5; index += 1) registerSoilRequest(1000 + index); expect(() => registerSoilRequest(2000)).toThrow("aguarde um minuto"); expect(registerSoilRequest(62_000)).toBe(4); });
  it("exporta estimativas, incerteza e atribuição", () => { const profile: SoilProfile = { latitude: 41, longitude: -8, queriedAt: "2026-07-20", source: "SoilGrids / ISRIC", resolutionMeters: 250, estimates: [{ property: "clay", depth: "0-5cm", mean: 20, low: 10, high: 30, unit: "%" }] }; const csv = buildSoilCsv(profile); expect(csv).toContain('"Argila"'); expect(csv).toContain('"SoilGrids / ISRIC"'); expect(csv).toContain('"100"'); });
});
