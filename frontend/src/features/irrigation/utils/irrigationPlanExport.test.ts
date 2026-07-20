import { describe, expect, it } from "vitest";

import type { Field } from "../../fields/types/field";
import type { IrrigationRecommendation, IrrigationSystem } from "../types/irrigation";
import { buildIrrigationPlanCsv } from "./irrigationPlanExport";

const field = {
  id: "field-1",
  farm_id: "farm-1",
  name: 'Talhão "Norte"',
  crop: "Milho",
  area: 2.5,
} as Field;

const system = {
  id: "system-1",
  field_id: "field-1",
  farm_id: "farm-1",
  name: "Gota principal",
  method: "drip",
  water_source: "well",
  flow_l_min: 500,
  pressure_bar: 2,
  reservoir_capacity_m3: 100,
  reservoir_level_percent: 80,
  efficiency_percent: 90,
  active: true,
  notes: "",
} satisfies IrrigationSystem;

const recommendation = {
  priority: "high",
  needsIrrigation: true,
  recommendedMinutes: 90,
  estimatedVolumeM3: 42.5,
  estimatedWaterNeedMm: 3.4,
  bestWindow: "06:00–08:30",
  confidence: 87,
  reasons: ["Solo seco.", "Sem chuva relevante."],
  warnings: ["Confirmar nível do depósito."],
} satisfies IrrigationRecommendation;

const createCsv = (systemValue: IrrigationSystem | null = system) =>
  buildIrrigationPlanCsv({
    field,
    system: systemValue,
    recommendation,
    soilMoisturePercent: 21,
    forecastRainMm: 0,
    generatedAt: "2026-07-20T10:00:00.000Z",
  });

describe("buildIrrigationPlanCsv", () => {
  it("inclui os dados operacionais da recomendação", () => {
    const csv = createCsv();

    expect(csv).toContain('"Volume estimado (m³)";"42.5"');
    expect(csv).toContain('"Duração recomendada (min)";"90"');
    expect(csv).toContain('"Melhor janela";"06:00–08:30"');
    expect(csv).toContain('"Prioridade";"high"');
  });

  it("escapa aspas e preserva motivos e alertas", () => {
    const csv = createCsv();

    expect(csv).toContain('"Talhão ""Norte"""');
    expect(csv).toContain("Solo seco. | Sem chuva relevante.");
    expect(csv).toContain("Confirmar nível do depósito.");
  });

  it("exporta uma indicação clara quando o sistema não está configurado", () => {
    const csv = createCsv(null);

    expect(csv).toContain('"Sistema de rega";"Não configurado"');
    expect(csv).toContain('"Caudal (L/min)";"Não configurado"');
  });
});
