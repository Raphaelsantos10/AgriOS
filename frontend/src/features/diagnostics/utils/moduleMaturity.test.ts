import { describe, expect, it } from "vitest";

import { moduleMaturityRegistry } from "../data/moduleMaturity";
import { countMaturity, filterMaturity, maturityCsv } from "./moduleMaturity";

describe("matriz de maturidade FARPHA", () => {
  it("classifica todos os módulos e mantém os totais auditados", () => {
    expect(moduleMaturityRegistry).toHaveLength(44);
    expect(countMaturity(moduleMaturityRegistry)).toEqual({
      real: 14,
      partial: 22,
      demonstrative: 4,
      planned: 4,
    });
  });

  it("pesquisa limitações e filtra por estado", () => {
    expect(filterMaturity(moduleMaturityRegistry, "demonstrative", "NDVI").map((item) => item.id))
      .toEqual(["precision"]);
    expect(filterMaturity(moduleMaturityRegistry, "real", "Supabase").length).toBeGreaterThan(0);
  });

  it("exporta uma linha por módulo sem perder campos", () => {
    const csv = maturityCsv(moduleMaturityRegistry);
    expect(csv.split("\n")).toHaveLength(45);
    expect(csv).toContain("FARPHA Intelligence");
    expect(csv).toContain("Demonstrativo");
  });
});
