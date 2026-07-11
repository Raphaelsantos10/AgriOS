import * as turf from "@turf/turf";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  MultiPolygon,
  Polygon,
} from "geojson";

import type { Field, FieldStatus, PolygonGeometry } from "../../fields/types/field";

export type ImportedFieldCandidate = {
  key: string;
  sourceId: string | null;
  name: string;
  crop: string;
  status: FieldStatus;
  geometry: PolygonGeometry;
  area: number;
  selected: boolean;
  duplicate: boolean;
};

type SupportedFeature = Feature<Polygon | MultiPolygon, GeoJsonProperties>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeStatus(value: unknown): FieldStatus {
  if (value === "attention" || value === "critical" || value === "healthy") {
    return value;
  }

  return "healthy";
}

function readText(
  properties: GeoJsonProperties,
  keys: string[],
  fallback: string
) {
  if (!properties) return fallback;

  for (const key of keys) {
    const value = properties[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return fallback;
}

function closeRing(ring: number[][]) {
  if (ring.length < 3) {
    throw new Error("Um polígono precisa de pelo menos três vértices.");
  }

  const cleaned = ring.map((coordinate) => {
    if (
      !Array.isArray(coordinate) ||
      coordinate.length < 2 ||
      !Number.isFinite(coordinate[0]) ||
      !Number.isFinite(coordinate[1])
    ) {
      throw new Error("O ficheiro contém coordenadas inválidas.");
    }

    return [Number(coordinate[0]), Number(coordinate[1])];
  });

  const first = cleaned[0];
  const last = cleaned[cleaned.length - 1];

  if (first[0] !== last[0] || first[1] !== last[1]) {
    cleaned.push([...first]);
  }

  return cleaned;
}

function normalizePolygonCoordinates(coordinates: number[][][]) {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    throw new Error("Foi encontrado um polígono sem coordenadas.");
  }

  return coordinates.map(closeRing);
}

function geometrySignature(geometry: PolygonGeometry) {
  return JSON.stringify(geometry.coordinates);
}

function featureCandidates(
  feature: SupportedFeature,
  featureIndex: number
): Omit<ImportedFieldCandidate, "duplicate" | "selected">[] {
  const properties = feature.properties;
  const sourceId =
    typeof feature.id === "string" || typeof feature.id === "number"
      ? String(feature.id)
      : null;
  const baseName = readText(
    properties,
    ["name", "field_name", "talhao", "title"],
    `Talhão importado ${featureIndex + 1}`
  );
  const crop = readText(properties, ["crop", "culture", "cultura"], "Milho");
  const status = normalizeStatus(properties?.status);

  const polygons =
    feature.geometry.type === "Polygon"
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;

  return polygons.map((coordinates, polygonIndex) => {
    const geometry: PolygonGeometry = {
      type: "Polygon",
      coordinates: normalizePolygonCoordinates(coordinates),
    };
    const area = turf.area(turf.polygon(geometry.coordinates)) / 10000;

    return {
      key: `${featureIndex}-${polygonIndex}-${sourceId ?? "sem-id"}`,
      sourceId,
      name:
        polygons.length > 1
          ? `${baseName} ${polygonIndex + 1}`
          : baseName,
      crop,
      status,
      geometry,
      area,
    };
  });
}

function extractFeatures(value: unknown): SupportedFeature[] {
  if (!isRecord(value)) {
    throw new Error("O conteúdo do ficheiro não é um GeoJSON válido.");
  }

  if (value.type === "FeatureCollection") {
    const collection = value as unknown as FeatureCollection<Geometry>;

    if (!Array.isArray(collection.features)) {
      throw new Error("A coleção GeoJSON não possui uma lista de elementos válida.");
    }

    return collection.features.filter(
      (feature): feature is SupportedFeature =>
        feature?.type === "Feature" &&
        Boolean(feature.geometry) &&
        (feature.geometry.type === "Polygon" ||
          feature.geometry.type === "MultiPolygon")
    );
  }

  if (value.type === "Feature") {
    const feature = value as unknown as Feature<Geometry>;

    if (
      feature.geometry?.type === "Polygon" ||
      feature.geometry?.type === "MultiPolygon"
    ) {
      return [feature as SupportedFeature];
    }
  }

  if (value.type === "Polygon" || value.type === "MultiPolygon") {
    return [
      {
        type: "Feature",
        properties: {},
        geometry: value as unknown as Polygon | MultiPolygon,
      },
    ];
  }

  throw new Error(
    "O ficheiro não contém polígonos. Apenas Polygon e MultiPolygon são suportados."
  );
}

export function parseGeoJSONFields(
  text: string,
  existingFields: Field[]
): ImportedFieldCandidate[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Não foi possível ler o JSON do ficheiro selecionado.");
  }

  const features = extractFeatures(parsed);

  if (features.length === 0) {
    throw new Error("Nenhum Polygon ou MultiPolygon válido foi encontrado.");
  }

  const existingSignatures = new Set(
    existingFields
      .filter((field) => field.geometry)
      .map((field) => geometrySignature(field.geometry as PolygonGeometry))
  );

  return features.flatMap(featureCandidates).map((candidate) => {
    const duplicate = existingSignatures.has(geometrySignature(candidate.geometry));

    return {
      ...candidate,
      duplicate,
      selected: !duplicate,
    };
  });
}
