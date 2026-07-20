import { describe, expect, it } from "vitest";
import { parseIpmaFireDay } from "../services/ipmaFireService";
import type { IpmaFireForecast } from "../types/ipmaFire";
import { buildIpmaFireCsv, fireOperationalGuidance, matchFireForecast } from "./ipmaFire";
describe("IPMA fire risk", () => {
  it("interpreta o formato real dico e a variante DICO documentada", () => { const day = parseIpmaFireDay({ dataPrev: "2026-07-21", dataRun: "2026-07-20", fileDate: "2026-07-20 09:00", local: { a: { dico: "0101", latitude: 40.6, longitude: -8.4, data: { rcm: 4 } }, b: { DICO: "0202", latitude: 39, longitude: -8, data: { rcm: 2 } } } }); expect(day.municipalities.map((item) => item.municipalityCode)).toEqual(["0101", "0202"]); });
  it("associa o ponto municipal mais próximo e mantém distância", () => { const forecast: IpmaFireForecast = { fetchedAt: "", source: "IPMA", days: [{ date: "2026-07-21", modelRunDate: "2026-07-20", fileDate: "09:00", municipalities: [{ municipalityCode: "A", latitude: 41, longitude: -8, level: 2 }, { municipalityCode: "B", latitude: 39, longitude: -9, level: 5 }] }] }; const matched = matchFireForecast(forecast, 41.01, -8.01); expect(matched[0]).toMatchObject({ municipalityCode: "A", level: 2 }); expect(matched[0].distanceKm).toBeLessThan(2); });
  it("exporta fonte e apresenta orientação proporcional ao nível", () => { const item = { date: "2026-07-21", municipalityCode: "0101", level: 5 as const, distanceKm: 3, modelRunDate: "2026-07-20", fileDate: "09:00" }; expect(buildIpmaFireCsv([item], "Quinta", "10:00")).toContain('"IPMA"'); expect(fireOperationalGuidance(5)).toContain("restrições oficiais"); });
});
