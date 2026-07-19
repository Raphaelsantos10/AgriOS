import { describe, expect, it } from "vitest";

import type { Field } from "../../fields/types/field";
import { parseGeoJSONFields } from "./geojsonImport";

const polygon = {
  type: "Feature" as const,
  id: "talhao-1",
  properties: {
    nome: "Talhão Norte",
    cultura: "Oliveira",
    status: "attention",
  },
  geometry: {
    type: "Polygon" as const,
    coordinates: [[[-7.3, 41.5], [-7.29, 41.5], [-7.29, 41.51], [-7.3, 41.5]]],
  },
};

describe("parseGeoJSONFields", () => {
  it("importa um polígono e preserva os dados agrícolas", () => {
    const [candidate] = parseGeoJSONFields(
      JSON.stringify({ type: "FeatureCollection", features: [polygon] }),
      [],
    );

    expect(candidate).toMatchObject({
      sourceId: "talhao-1",
      name: "Talhão Norte",
      crop: "Oliveira",
      status: "attention",
      selected: true,
      duplicate: false,
    });
    expect(candidate.area).toBeGreaterThan(0);
  });

  it("fecha automaticamente um anel aberto", () => {
    const openPolygon = structuredClone(polygon);
    openPolygon.geometry.coordinates[0].pop();

    const [candidate] = parseGeoJSONFields(JSON.stringify(openPolygon), []);
    const ring = candidate.geometry.coordinates[0];

    expect(ring.at(-1)).toEqual(ring[0]);
  });

  it("identifica geometrias que já existem", () => {
    const [firstImport] = parseGeoJSONFields(JSON.stringify(polygon), []);
    const existingField: Field = {
      id: "existente",
      farm_id: "quinta-1",
      name: "Talhão existente",
      crop: "Oliveira",
      area: firstImport.area,
      status: "healthy",
      geometry: firstImport.geometry,
    };

    const [candidate] = parseGeoJSONFields(JSON.stringify(polygon), [existingField]);

    expect(candidate.duplicate).toBe(true);
    expect(candidate.selected).toBe(false);
  });

  it("rejeita ficheiros sem polígonos", () => {
    const point = {
      type: "Feature",
      properties: {},
      geometry: { type: "Point", coordinates: [-7.3, 41.5] },
    };

    expect(() => parseGeoJSONFields(JSON.stringify(point), [])).toThrow(
      "Apenas Polygon e MultiPolygon são suportados",
    );
  });

  it("rejeita JSON inválido com uma mensagem clara", () => {
    expect(() => parseGeoJSONFields("{invalido", [])).toThrow(
      "Não foi possível ler o JSON",
    );
  });
});
