import { describe, expect, it } from "vitest";

import type { FieldEnvironmentInput } from "../../environment/types/environment";
import type { Field } from "../../fields/types/field";
import type { IrrigationSystem } from "../types/irrigation";
import { calculateIrrigationRecommendation } from "./irrigationCalculator";

const field: Field = {
  id: "field-1",
  farm_id: "farm-1",
  name: "Olival Norte",
  crop: "Oliveira",
  area: 2,
  status: "healthy",
  geometry: null,
};

const environment: FieldEnvironmentInput = {
  field_id: field.id,
  farm_id: field.farm_id,
  altitude_m: 450,
  slope_percent: 5,
  exposure: "S",
  soil_texture: "sandy",
  soil_ph: 6.5,
  organic_matter_percent: 2.5,
  drainage: "good",
  water_available: true,
  irrigation_type: "drip",
  annual_rainfall_mm: 600,
  average_humidity_percent: 30,
  min_temperature_c: 12,
  max_temperature_c: 35,
  chill_hours: 700,
  frost_risk: "moderate",
  fire_risk: "high",
  wind_exposure: "moderate",
  data_confidence: 90,
  notes: "",
};

const system: IrrigationSystem = {
  id: "irrigation-1",
  field_id: field.id,
  farm_id: field.farm_id,
  name: "Gota a gota",
  method: "drip",
  water_source: "well",
  flow_l_min: 100,
  pressure_bar: 2,
  reservoir_capacity_m3: 100,
  reservoir_level_percent: 80,
  efficiency_percent: 90,
  active: true,
  notes: "",
};

describe("calculateIrrigationRecommendation", () => {
  it("deteta necessidade crítica em solo seco e tempo quente", () => {
    const result = calculateIrrigationRecommendation(field, environment, system, 10, 0);
    expect(result.needsIrrigation).toBe(true);
    expect(result.priority).toBe("critical");
    expect(result.estimatedWaterNeedMm).toBeGreaterThanOrEqual(8);
    expect(result.recommendedMinutes).toBeGreaterThan(0);
    expect(result.bestWindow).toBe("05:30–07:30");
  });

  it("suspende a recomendação quando há chuva relevante", () => {
    const result = calculateIrrigationRecommendation(field, environment, system, 20, 10);
    expect(result.needsIrrigation).toBe(false);
    expect(result.priority).toBe("low");
    expect(result.warnings).toContain("Chuva relevante prevista; confirme antes de regar.");
  });

  it("não calcula duração sem sistema configurado", () => {
    const result = calculateIrrigationRecommendation(field, environment, null, 20, 0);
    expect(result.recommendedMinutes).toBe(0);
    expect(result.warnings).toContain("Configure um sistema de rega para calcular a duração.");
  });

  it("considera que solo arenoso necessita de mais água que solo argiloso", () => {
    const sandy = calculateIrrigationRecommendation(field, environment, system, 22, 0);
    const clay = calculateIrrigationRecommendation(
      field,
      { ...environment, soil_texture: "clay" },
      system,
      22,
      0,
    );
    expect(sandy.estimatedWaterNeedMm).toBeGreaterThan(clay.estimatedWaterNeedMm);
  });

  it("mantém volume e confiança dentro de limites seguros", () => {
    const result = calculateIrrigationRecommendation(field, environment, system, -20, 0);
    expect(result.estimatedWaterNeedMm).toBeLessThanOrEqual(12);
    expect(result.estimatedVolumeM3).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThanOrEqual(35);
    expect(result.confidence).toBeLessThanOrEqual(91);
  });
});
