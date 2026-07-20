import { describe, expect, it } from "vitest";

import type { Field } from "../../fields/types/field";
import type { FieldEnvironmentInput } from "../types/environment";
import { buildEnvironmentReportCsv } from "./environmentReportExport";

const field = {
  name: 'Talhão "Vale"',
  crop: "Vinha",
  area: 3.8,
} as Field;

const profile: FieldEnvironmentInput = {
  field_id: "field-1",
  farm_id: "farm-1",
  altitude_m: 420,
  slope_percent: 12,
  exposure: "S",
  soil_texture: "clay_loam",
  soil_ph: 6.4,
  organic_matter_percent: 3.2,
  drainage: "good",
  water_available: true,
  irrigation_type: "drip",
  annual_rainfall_mm: 780,
  average_humidity_percent: 58,
  min_temperature_c: 4,
  max_temperature_c: 34,
  chill_hours: 650,
  frost_risk: "moderate",
  fire_risk: "high",
  wind_exposure: "low",
  data_confidence: 91,
  notes: "Solo observado no campo.",
};

const createCsv = (profileValue = profile) =>
  buildEnvironmentReportCsv({
    field,
    profile: profileValue,
    generatedAt: "2026-07-20T10:00:00.000Z",
  });

describe("buildEnvironmentReportCsv", () => {
  it("inclui a identificação, o relevo e os dados do solo", () => {
    const csv = createCsv();

    expect(csv).toContain('"Talhão";"Talhão ""Vale"""');
    expect(csv).toContain('"Altitude (m)";"420"');
    expect(csv).toContain('"Textura do solo";"Franco-argiloso"');
    expect(csv).toContain('"pH do solo";"6.4"');
  });

  it("inclui água, clima, riscos e confiança", () => {
    const csv = createCsv();

    expect(csv).toContain('"Tipo de rega";"Gota-a-gota"');
    expect(csv).toContain('"Precipitação anual (mm)";"780"');
    expect(csv).toContain('"Risco de incêndio";"Elevado"');
    expect(csv).toContain('"Confiança dos dados (%)";"91"');
  });

  it("identifica campos desconhecidos e observações vazias", () => {
    const csv = createCsv({
      ...profile,
      altitude_m: null,
      soil_texture: "unknown",
      drainage: "unknown",
      notes: "",
    });

    expect(csv).toContain('"Altitude (m)";"Não informado"');
    expect(csv).toContain('"Textura do solo";"Desconhecido"');
    expect(csv).toContain('"Drenagem";"Desconhecida"');
    expect(csv).toContain('"Observações";"Sem observações"');
  });
});
