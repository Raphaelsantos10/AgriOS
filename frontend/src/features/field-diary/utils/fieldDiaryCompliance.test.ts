import { describe, expect, it } from "vitest";
import type { FieldDiaryEntry } from "../types/fieldDiary";
import { assessDiaryCompliance, buildFieldDiaryCsv } from "./fieldDiary";

const base = { activity: "inspection", farm: "Quinta", field: "Norte", date: "2026-07-21", title: "Inspeção", responsible: "Ana", complianceObligationId: "field-book" } as const;
describe("caderno de campo de conformidade", () => {
  it("considera completo um registo geral ligado a uma obrigação", () => { expect(assessDiaryCompliance(base)).toEqual({ complete: true, missing: [] }); });
  it("exige produto, dose, unidade e equipamento numa pulverização", () => { const result = assessDiaryCompliance({ ...base, activity: "spraying" }); expect(result.complete).toBe(false); expect(result.missing).toEqual(expect.arrayContaining(["produto/insumo", "quantidade", "unidade", "equipamento"])); });
  it("inclui os novos campos na exportação CSV", () => { const entry = { ...base, id: "1", crop: "Vinha", weather: "Seco", notes: "", product: "Produto A", quantity: "2", unit: "L/ha", equipment: "Pulverizador 1", evidenceReference: "FAT-1", photoName: "", photoDataUrl: "", createdAt: "2026-07-21T10:00:00Z" } as FieldDiaryEntry; const csv = buildFieldDiaryCsv([entry], "2026-07-21"); expect(csv).toContain('"Produto A"'); expect(csv).toContain('"field-book"'); expect(csv).toContain('"FAT-1"'); });
});
