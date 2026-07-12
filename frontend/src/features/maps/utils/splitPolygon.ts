import * as turf from "@turf/turf";
import type { PolygonGeometry } from "../../fields/types/field";

export interface SplitPolygonResult {
  geometries: [PolygonGeometry, PolygonGeometry];
  areas: [number, number];
}

const MIN_PART_AREA_HECTARES = 0.0001;
const CUT_BUFFER_METERS = 0.05;

function clonePosition(position: GeoJSON.Position): number[] {
  return position.map(Number);
}

function toPolygonGeometry(
  polygon: GeoJSON.Polygon
): PolygonGeometry {
  return {
    type: "Polygon",
    coordinates: polygon.coordinates.map((ring) =>
      ring.map(clonePosition)
    ),
  };
}

function uniqueIntersections(
  collection: GeoJSON.FeatureCollection<GeoJSON.Point>
) {
  const seen = new Set<string>();

  return collection.features.filter((feature) => {
    const [longitude, latitude] = feature.geometry.coordinates;
    const key = `${longitude.toFixed(8)}:${latitude.toFixed(8)}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function extendCutLine(
  coordinates: [number, number][],
  polygon: GeoJSON.Feature<GeoJSON.Polygon>
) {
  const bounds = turf.bbox(polygon);
  const diagonal = turf.distance(
    turf.point([bounds[0], bounds[1]]),
    turf.point([bounds[2], bounds[3]]),
    { units: "kilometers" }
  );

  const extensionDistance = Math.max(diagonal * 2, 1);
  const first = turf.point(coordinates[0]);
  const second = turf.point(coordinates[1]);
  const penultimate = turf.point(coordinates[coordinates.length - 2]);
  const last = turf.point(coordinates[coordinates.length - 1]);

  const startBearing = turf.bearing(second, first);
  const endBearing = turf.bearing(penultimate, last);

  const extendedStart = turf.destination(
    first,
    extensionDistance,
    startBearing,
    { units: "kilometers" }
  ).geometry.coordinates as [number, number];

  const extendedEnd = turf.destination(
    last,
    extensionDistance,
    endBearing,
    { units: "kilometers" }
  ).geometry.coordinates as [number, number];

  return turf.lineString([
    extendedStart,
    ...coordinates,
    extendedEnd,
  ]);
}

export function splitPolygonByLine(
  geometry: PolygonGeometry,
  cutCoordinates: [number, number][]
): SplitPolygonResult {
  if (cutCoordinates.length < 2) {
    throw new Error("A linha de corte precisa de pelo menos dois pontos.");
  }

  const polygon = turf.polygon(geometry.coordinates);
  const extendedLine = extendCutLine(cutCoordinates, polygon);
  const boundary = turf.polygonToLine(polygon);
  const intersections = uniqueIntersections(
    turf.lineIntersect(extendedLine, boundary)
  );

  if (intersections.length < 2) {
    throw new Error(
      "A linha precisa atravessar o talhão de um lado ao outro."
    );
  }

  const bufferedLine = turf.buffer(
    extendedLine,
    CUT_BUFFER_METERS,
    { units: "meters", steps: 8 }
  );

  if (!bufferedLine) {
    throw new Error("Não foi possível preparar a linha de corte.");
  }

  const difference = turf.difference(
    turf.featureCollection([polygon, bufferedLine])
  );

  if (!difference) {
    throw new Error("A linha não produziu uma divisão válida.");
  }

  const polygonFeatures: GeoJSON.Feature<GeoJSON.Polygon>[] = [];

  turf.flattenEach(difference, (feature) => {
    if (feature.geometry.type === "Polygon") {
      polygonFeatures.push(
        feature as GeoJSON.Feature<GeoJSON.Polygon>
      );
    }
  });

  const validParts = polygonFeatures
    .map((feature) => ({
      feature,
      area: turf.area(feature) / 10000,
    }))
    .filter(({ area }) => area >= MIN_PART_AREA_HECTARES)
    .sort((first, second) => second.area - first.area);

  if (validParts.length !== 2) {
    throw new Error(
      "A divisão deve gerar exatamente dois talhões válidos. Ajuste a linha de corte."
    );
  }

  const firstGeometry = toPolygonGeometry(
    validParts[0].feature.geometry
  );
  const secondGeometry = toPolygonGeometry(
    validParts[1].feature.geometry
  );

  return {
    geometries: [firstGeometry, secondGeometry],
    areas: [validParts[0].area, validParts[1].area],
  };
}
