import * as turf from "@turf/turf";
import { describe, expect, it } from "vitest";

import type { PolygonGeometry } from "../../fields/types/field";
import { splitPolygonByLine } from "./splitPolygon";

const square: PolygonGeometry = {
  type: "Polygon",
  coordinates: [[[0, 0], [0.01, 0], [0.01, 0.01], [0, 0.01], [0, 0]]],
};

describe("splitPolygonByLine", () => {
  it("divide um talhão atravessado de um lado ao outro", () => {
    const result = splitPolygonByLine(square, [[0.005, -0.005], [0.005, 0.015]]);

    expect(result.geometries).toHaveLength(2);
    expect(result.geometries.every((geometry) => geometry.type === "Polygon")).toBe(true);
    expect(result.areas.every((area) => area > 0)).toBe(true);
  });

  it("conserva aproximadamente a área original", () => {
    const originalArea = turf.area(turf.polygon(square.coordinates)) / 10000;
    const result = splitPolygonByLine(square, [[0.005, -0.005], [0.005, 0.015]]);
    const dividedArea = result.areas[0] + result.areas[1];

    expect(dividedArea).toBeCloseTo(originalArea, 1);
  });

  it("rejeita linhas incompletas ou que não atravessam o talhão", () => {
    expect(() => splitPolygonByLine(square, [[0.005, 0.005]])).toThrow(
      "pelo menos dois pontos",
    );
    expect(() =>
      splitPolygonByLine(square, [[0.02, -0.005], [0.02, 0.015]]),
    ).toThrow("precisa atravessar o talhão");
  });
});
