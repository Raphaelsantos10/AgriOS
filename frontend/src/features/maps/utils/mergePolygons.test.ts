import { describe, expect, it } from "vitest";

import type { PolygonGeometry } from "../../fields/types/field";
import { mergePolygonGeometries } from "./mergePolygons";

const first: PolygonGeometry = {
  type: "Polygon",
  coordinates: [[[0, 0], [0.01, 0], [0.01, 0.01], [0, 0.01], [0, 0]]],
};

describe("mergePolygonGeometries", () => {
  it("une dois talhões adjacentes num único polígono", () => {
    const adjacent: PolygonGeometry = {
      type: "Polygon",
      coordinates: [[[0.01, 0], [0.02, 0], [0.02, 0.01], [0.01, 0.01], [0.01, 0]]],
    };

    const result = mergePolygonGeometries(first, adjacent);

    expect(result.geometry.type).toBe("Polygon");
    expect(result.area).toBeGreaterThan(200);
  });

  it("une talhões sobrepostos sem duplicar a área comum", () => {
    const overlapping: PolygonGeometry = {
      type: "Polygon",
      coordinates: [[[0.005, 0], [0.015, 0], [0.015, 0.01], [0.005, 0.01], [0.005, 0]]],
    };

    const result = mergePolygonGeometries(first, overlapping);

    expect(result.geometry.type).toBe("Polygon");
    expect(result.area).toBeGreaterThan(100);
    expect(result.area).toBeLessThan(200);
  });

  it("rejeita talhões separados", () => {
    const distant: PolygonGeometry = {
      type: "Polygon",
      coordinates: [[[0.03, 0], [0.04, 0], [0.04, 0.01], [0.03, 0.01], [0.03, 0]]],
    };

    expect(() => mergePolygonGeometries(first, distant)).toThrow(
      "precisam tocar-se ou sobrepor-se",
    );
  });
});
