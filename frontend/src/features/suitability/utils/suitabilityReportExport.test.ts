import { describe, expect, it } from "vitest";

import type { Crop } from "../../crops/types/crop";
import type { Field } from "../../fields/types/field";
import type { CropSuitabilityResult } from "../types/suitability";
import { buildSuitabilityReportCsv } from "./suitabilityReportExport";

const field = { name: 'Talhão "Sul"' } as Field;

const createResult = (
  commonName: string,
  score: number,
  scoreWithIrrigation: number,
): CropSuitabilityResult => ({
  crop: {
    id: commonName,
    commonName,
    scientificName: `${commonName} scientific`,
  } as Crop,
  score,
  scoreWithIrrigation,
  confidence: 80,
  strengths: ["pH do solo: condição favorável."],
  warnings: ["Drenagem: requer atenção."],
  factors: [
    {
      id: "soil_ph",
      label: "pH do solo",
      score: 92,
      weight: 24,
      known: true,
      detail: "pH registado.",
    },
  ],
});

const results = [
  createResult("Oliveira", 82, 86),
  createResult("Milho", 68, 84),
];

describe("buildSuitabilityReportCsv", () => {
  it("mantém a classificação e as pontuações das culturas", () => {
    const csv = buildSuitabilityReportCsv({
      field,
      results,
      withIrrigation: false,
      generatedAt: "2026-07-20T10:00:00.000Z",
    });

    expect(csv).toContain('"1";"Talhão ""Sul""";"Oliveira"');
    expect(csv).toContain('"2";"Talhão ""Sul""";"Milho"');
    expect(csv).toContain('"Oliveira scientific";"Condições atuais";"82";"82";"86";"4"');
  });

  it("usa a pontuação simulada e apresenta o ganho com rega", () => {
    const csv = buildSuitabilityReportCsv({
      field,
      results,
      withIrrigation: true,
      generatedAt: "2026-07-20T10:00:00.000Z",
    });

    expect(csv).toContain('"Milho scientific";"Com rega simulada";"84";"68";"84";"16"');
  });

  it("inclui confiança, pontos fortes, alertas e fatores conhecidos", () => {
    const csv = buildSuitabilityReportCsv({
      field,
      results: [results[0]],
      withIrrigation: false,
      generatedAt: "2026-07-20T10:00:00.000Z",
    });

    expect(csv).toContain('"80";"pH do solo: condição favorável."');
    expect(csv).toContain('"Drenagem: requer atenção.";"pH do solo: 92%"');
  });
});
