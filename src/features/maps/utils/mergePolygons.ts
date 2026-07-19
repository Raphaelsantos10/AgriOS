import * as turf from "@turf/turf";

import type { PolygonGeometry } from "../../fields/types/field";

export interface MergePolygonResult {
  geometry: PolygonGeometry;
  area: number;
}

export function mergePolygonGeometries(
  first: PolygonGeometry,
  second: PolygonGeometry
): MergePolygonResult {
  const firstFeature = turf.polygon(first.coordinates);
  const secondFeature = turf.polygon(second.coordinates);
  const merged = turf.union(
    turf.featureCollection([firstFeature, secondFeature])
  );

  if (!merged) {
    throw new Error("Os talhões não puderam ser unidos.");
  }

  if (merged.geometry.type !== "Polygon") {
    throw new Error(
      "Os talhões precisam tocar-se ou sobrepor-se para formar um único limite."
    );
  }

  if (!turf.booleanValid(merged)) {
    throw new Error("A geometria resultante da união é inválida.");
  }

  return {
    geometry: {
      type: "Polygon",
      coordinates: merged.geometry.coordinates,
    },
    area: turf.area(merged) / 10000,
  };
}
