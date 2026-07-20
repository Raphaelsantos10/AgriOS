import { describe, expect, it } from "vitest";

import type { FireRiskAssessmentResult, FireRiskInput } from "../../../engines/fire/types";
import type { Field } from "../../fields/types/field";
import { buildFireRiskReportCsv } from "./fireRiskReportExport";

const field = {
  name: 'Talhão "Serra"',
  crop: "Oliveira",
  area: 4.2,
} as Field;

const input: FireRiskInput = {
  temperatureC: 36,
  humidityPercent: 20,
  windSpeedKmh: 38,
  slopePercent: 18,
  vegetationDrynessPercent: 82,
  fuelLoad: "high",
  nearbyFireDistanceKm: 7,
  windTowardProperty: true,
};

const assessment: FireRiskAssessmentResult = {
  score: 88,
  level: "extreme",
  confidence: 90,
  factors: [
    { label: "Temperatura", score: 82, explanation: "36.0 °C registados." },
  ],
  recommendations: ["Manter acessos desobstruídos.", "Acompanhar a Proteção Civil."],
};

const createCsv = (inputValue = input) =>
  buildFireRiskReportCsv({
    field,
    input: inputValue,
    assessment,
    notes: "Reservatório disponível.",
    generatedAt: "2026-07-20T10:00:00.000Z",
  });

describe("buildFireRiskReportCsv", () => {
  it("inclui risco, confiança e condições observadas", () => {
    const csv = createCsv();

    expect(csv).toContain('"Risco calculado";"88/100"');
    expect(csv).toContain('"Nível de risco";"Extremo"');
    expect(csv).toContain('"Temperatura (°C)";"36"');
    expect(csv).toContain('"Vento em direção à propriedade";"Sim"');
  });

  it("inclui fatores, recomendações, notas e aviso de emergência", () => {
    const csv = createCsv();

    expect(csv).toContain("Temperatura: 82/100 — 36.0 °C registados.");
    expect(csv).toContain("Manter acessos desobstruídos. | Acompanhar a Proteção Civil.");
    expect(csv).toContain("Reservatório disponível.");
    expect(csv).toContain("ligue 112");
  });

  it("identifica valores que não foram informados e escapa aspas", () => {
    const csv = createCsv({ ...input, temperatureC: null, nearbyFireDistanceKm: null });

    expect(csv).toContain('"Talhão";"Talhão ""Serra"""');
    expect(csv).toContain('"Temperatura (°C)";"Não informado"');
    expect(csv).toContain('"Incêndio próximo (km)";"Não informado"');
  });
});
