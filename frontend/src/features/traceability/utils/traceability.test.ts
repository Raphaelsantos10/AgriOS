import { describe, expect, it } from "vitest";
import type { FieldDiaryEntry } from "../../field-diary/types/fieldDiary";
import type { HarvestRecord } from "../../harvest/types/harvest";
import { buildTraceabilityCsv, buildTraceabilityEvents, filterTraceabilityEvents, summarizeTraceability } from "./traceability";
const diary = [
  { id: "1", farm: "Quinta", field: "Norte", crop: "Vinha", date: "2026-01-10", activity: "soil_preparation", title: "Preparação", responsible: "Ana", weather: "", notes: "", photoName: "", photoDataUrl: "", createdAt: "" },
  { id: "2", farm: "Quinta", field: "Norte", crop: "Vinha", date: "2026-02-10", activity: "planting", title: "Plantação", responsible: "Ana", weather: "", notes: "", photoName: "", photoDataUrl: "", createdAt: "" },
] as FieldDiaryEntry[];
const harvests = [{ id: "h1", campaign: "2026", farm: "Quinta", field: "Norte", crop: "Vinha", harvestDate: "2026-09-01", harvestedAreaHa: 2, grossQuantity: 5, marketableQuantity: 4.5, unit: "t", quality: "first", destination: "Adega", notes: "", createdAt: "" }] as HarvestRecord[];
describe("traceability", () => {
  it("une diário e colheita em ordem cronológica com origem", () => { const events = buildTraceabilityEvents(diary, harvests); expect(events.map((event) => event.stage)).toEqual(["soil", "planting", "harvest"]); expect(events.at(-1)?.source).toBe("Colheitas locais"); });
  it("filtra e identifica etapas presentes e ausentes", () => { const events = buildTraceabilityEvents(diary, harvests); expect(filterTraceabilityEvents(events, { farm: "quinta", field: "norte", crop: "vinha", startDate: "2026-02-01", endDate: "" })).toHaveLength(2); expect(summarizeTraceability(events)).toMatchObject({ coveragePercent: 60, missingStages: ["care", "irrigation"] }); });
  it("exporta cobertura, eventos e origem transparente", () => { const csv = buildTraceabilityCsv(buildTraceabilityEvents(diary, harvests), "2026-07-20"); expect(csv).toContain('"Cobertura das etapas (%)";"60"'); expect(csv).toContain("Origem: Colheitas locais"); expect(csv).toContain("Cuidados culturais, Rega"); });
});
