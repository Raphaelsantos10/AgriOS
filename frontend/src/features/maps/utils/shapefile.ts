import type { FeatureCollection, Geometry } from "geojson";

import type { Field } from "../../fields/types/field";
import {
  parseGeoJSONFields,
  type ImportedFieldCandidate,
} from "./geojsonImport";

type ShpResult =
  | FeatureCollection<Geometry>
  | FeatureCollection<Geometry>[];

function isFeatureCollection(value: unknown): value is FeatureCollection<Geometry> {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { type?: unknown }).type === "FeatureCollection" &&
    Array.isArray((value as { features?: unknown }).features)
  );
}

function mergeCollections(result: ShpResult): FeatureCollection<Geometry> {
  const collections = Array.isArray(result) ? result : [result];
  const validCollections = collections.filter(isFeatureCollection);

  if (validCollections.length === 0) {
    throw new Error(
      "O ZIP não contém um Shapefile válido. Confirme se inclui .shp, .shx e .dbf."
    );
  }

  return {
    type: "FeatureCollection",
    features: validCollections.flatMap((collection) => collection.features),
  };
}

export async function parseShapefileFields(
  buffer: ArrayBuffer,
  existingFields: Field[]
): Promise<ImportedFieldCandidate[]> {
  try {
    const module = await import("shpjs");
    const parseShapefile = module.default as (
      input: ArrayBuffer
    ) => Promise<ShpResult>;

    const result = await parseShapefile(buffer);
    const collection = mergeCollections(result);

    return parseGeoJSONFields(JSON.stringify(collection), existingFields);
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw new Error(`Não foi possível ler o Shapefile: ${error.message}`, { cause: error });
    }

    throw new Error(
      "Não foi possível ler o Shapefile. Use um ficheiro ZIP contendo .shp, .shx e .dbf.",
      { cause: error }
    );
  }
}
