import { describe, expect, it } from "vitest";
import type { Field } from "../../fields/types/field";
import type { Farm } from "../types/farm";
import { buildFarmOverview, buildFarmOverviewCsv, type FieldModuleCoverage } from "./farmOverview";

const fields = [
  { id: "1", name: "Norte", area: 4, status: "healthy", geometry: { type: "Polygon", coordinates: [] } },
  { id: "2", name: "Sul", area: 2.5, status: "critical", geometry: null },
] as Field[];
const coverage: FieldModuleCoverage[] = [
  { fieldId: "1", environment: true, irrigation: true, fireAssessment: true, fireRiskLevel: "low" },
  { fieldId: "2", environment: false, irrigation: false, fireAssessment: true, fireRiskLevel: "high" },
];
const farm = { name: 'Quinta "Verde"' } as Farm;

describe("farmOverview", () => {
  it("consolida estados, área e cobertura dos módulos", () => {
    const result = buildFarmOverview(fields, coverage);
    expect(result).toMatchObject({ totalFields: 2, totalArea: 6.5, healthy: 1, critical: 1, environmentConfigured: 1, irrigationConfigured: 1, fireAssessed: 2 });
  });

  it("gera prioridades para risco e dados incompletos", () => {
    const result = buildFarmOverview(fields, coverage);
    expect(result.highFireRisk).toBe(1);
    expect(result.priorities.join(" ")).toContain("estado crítico");
    expect(result.priorities.join(" ")).toContain("sem perfil ambiental");
  });

  it("exporta a classificação e escapa valores CSV", () => {
    const csv = buildFarmOverviewCsv(farm, fields, coverage, "2026-07-20");
    expect(csv).toContain('"Quinta ""Verde"""');
    expect(csv).toContain('"Perfil ambiental";"Disponível";"Funcional — dados reais"');
    expect(csv).toContain('"Sistema de rega";"Não disponível";"Parcial — sem dados"');
  });
});
