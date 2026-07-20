import { describe, expect, it } from "vitest";

import type { Crop } from "../../crops/types/crop";
import type { FieldEnvironmentInput } from "../../environment/types/environment";
import { calculateCropSuitability } from "./calculateSuitability";

const crop: Crop = {
  id: "crop-1",
  slug: "macieira",
  commonName: "Macieira",
  scientificName: "Malus domestica",
  category: "fruit_tree",
  aliases: ["Maçã"],
  recommendedRegions: ["Norte"],
  description: null,
  climateProfile: { winter_chill: { min: 500, max: 1000 } },
  soilProfile: { ph: { min: 6, max: 7 }, drainage: "good" },
  waterProfile: { need: "high" },
  frostTolerance: "high",
  heatTolerance: "medium",
  sourceType: "catalog",
  createdAt: "2026-07-20T00:00:00.000Z",
};

const environment: FieldEnvironmentInput = {
  field_id: "field-1",
  farm_id: "farm-1",
  altitude_m: 500,
  slope_percent: 4,
  exposure: "S",
  soil_texture: "loam",
  soil_ph: 6.5,
  organic_matter_percent: 3,
  drainage: "good",
  water_available: true,
  irrigation_type: "drip",
  annual_rainfall_mm: 700,
  average_humidity_percent: 60,
  min_temperature_c: 2,
  max_temperature_c: 30,
  chill_hours: 750,
  frost_risk: "moderate",
  fire_risk: "moderate",
  wind_exposure: "low",
  data_confidence: 90,
  notes: "",
};

describe("calculateCropSuitability", () => {
  it("atribui pontuação elevada a condições compatíveis", () => {
    const result = calculateCropSuitability(crop, environment);
    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.confidence).toBe(100);
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  it("mostra o ganho potencial de instalar rega", () => {
    const dryEnvironment = { ...environment, water_available: false, irrigation_type: "none" as const };
    const result = calculateCropSuitability(crop, dryEnvironment);
    expect(result.scoreWithIrrigation).toBeGreaterThan(result.score);
  });

  it("penaliza pH e horas de frio fora do intervalo", () => {
    const result = calculateCropSuitability(crop, {
      ...environment,
      soil_ph: 8.5,
      chill_hours: 100,
    });
    expect(result.score).toBeLessThan(80);
    expect(result.warnings).toContain("pH do solo: requer atenção.");
  });

  it("reduz a confiança quando faltam dados ambientais", () => {
    const result = calculateCropSuitability(crop, {
      ...environment,
      soil_ph: null,
      chill_hours: null,
      frost_risk: "unknown",
      fire_risk: "unknown",
      drainage: "unknown",
    });
    expect(result.confidence).toBe(22);
    expect(result.factors.filter((factor) => !factor.known)).toHaveLength(5);
  });

  it("devolve sempre seis fatores explicáveis", () => {
    const result = calculateCropSuitability(crop, environment);
    expect(result.factors.map((factor) => factor.id)).toEqual([
      "soil_ph",
      "chill",
      "water",
      "frost",
      "heat",
      "drainage",
    ]);
    expect(result.factors.every((factor) => factor.detail.length > 0)).toBe(true);
  });
});
