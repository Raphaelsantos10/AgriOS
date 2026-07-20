import { describe, expect, it } from "vitest";
import type { FieldDiaryEntry } from "../types/fieldDiary";
import { buildFieldDiaryCsv, sortFieldDiary, summarizeFieldDiary } from "./fieldDiary";
const entries = [
  { id: "1", farm: "Quinta", field: "Norte", crop: "Vinha", date: "2026-07-19", activity: "inspection", title: 'Inspeção "Norte"', responsible: "Ana", weather: "Seco", notes: "Tudo normal", photoName: "foto.jpg", photoDataUrl: "data:image/jpeg;base64,abc", createdAt: "2026-07-19T10:00:00Z" },
  { id: "2", farm: "Quinta", field: "Sul", crop: "Oliveira", date: "2026-07-20", activity: "irrigation", title: "Rega", responsible: "João", weather: "Quente", notes: "", photoName: "", photoDataUrl: "", createdAt: "2026-07-20T10:00:00Z" },
] as FieldDiaryEntry[];
describe("fieldDiary", () => {
  it("ordena o diário do registo mais recente para o mais antigo", () => { expect(sortFieldDiary(entries).map((entry) => entry.id)).toEqual(["2", "1"]); });
  it("resume registos, talhões, fotografias e última data", () => { expect(summarizeFieldDiary(entries)).toEqual({ entries: 2, fields: 2, photos: 1, latestDate: "2026-07-20" }); });
  it("exporta atividade, fotografia e escapa textos", () => { const csv = buildFieldDiaryCsv(entries, "2026-07-20"); expect(csv).toContain('"Inspeção ""Norte"""'); expect(csv).toContain('"foto.jpg"'); expect(csv).toContain('"Rega"'); });
});
