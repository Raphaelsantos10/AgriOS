import { describe, expect, it } from "vitest";
import type { FieldIntegratedReportInput } from "./fieldIntegratedReport";
import { buildFieldIntegratedReportCsv } from "./fieldIntegratedReport";

const base = {
  farm: { id: "f1", name: 'Quinta "Norte"', owner: "Ana", area: 20, crop: "Vinha", latitude: 0, longitude: 0 },
  field: { id: "t1", farm_id: "f1", name: "Vale", crop: "Vinha", area: 3.5, status: "healthy", geometry: { type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] } },
  environment: null,
  irrigationSystem: null,
  irrigationEvents: [],
  fireAssessment: null,
  generatedAt: "2026-07-20T10:00:00.000Z",
} as FieldIntegratedReportInput;

describe("buildFieldIntegratedReportCsv", () => {
  it("reúne identificação, cultura e geometria com escape CSV", () => {
    const csv = buildFieldIntegratedReportCsv(base);
    expect(csv).toContain('"Exploração";"Quinta ""Norte"""');
    expect(csv).toContain('"Talhão";"Cultura";"Vinha"');
    expect(csv).toContain('"Geometria";"Vértices";"3"');
  });

  it("assinala módulos ainda sem dados", () => {
    const csv = buildFieldIntegratedReportCsv(base);
    expect(csv).toContain('"Ambiente";"Perfil disponível";"Não"');
    expect(csv).toContain('"Rega";"Sistema";"Não disponível"');
    expect(csv).toContain('"Incêndio";"Avaliação disponível";"Não"');
  });

  it("resume o histórico operacional de rega", () => {
    const csv = buildFieldIntegratedReportCsv({
      ...base,
      irrigationEvents: [
        { id: "e1", system_id: "s1", field_id: "t1", farm_id: "f1", started_at: "2026-07-20", duration_minutes: 30, volume_m3: 4.5, source: "manual", notes: "" },
        { id: "e2", system_id: "s1", field_id: "t1", farm_id: "f1", started_at: "2026-07-19", duration_minutes: 20, volume_m3: 2, source: "scheduled", notes: "" },
      ],
    });
    expect(csv).toContain('"Eventos considerados";"2"');
    expect(csv).toContain('"Duração total (min)";"50"');
    expect(csv).toContain('"Volume total (m³)";"6.5"');
  });
});
