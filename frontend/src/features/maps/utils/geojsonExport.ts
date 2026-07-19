import type { Feature, FeatureCollection, Polygon } from "geojson";

import type { Farm } from "../../farms/types/farm";
import type { Field } from "../../fields/types/field";

function sanitizeFilename(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/geo+json;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

function fieldToFeature(field: Field, farm: Farm): Feature<Polygon> | null {
  if (!field.geometry) {
    return null;
  }

  return {
    type: "Feature",
    id: field.id,
    geometry: field.geometry,
    properties: {
      id: field.id,
      farm_id: field.farm_id,
      farm_name: farm.name,
      name: field.name,
      crop: field.crop,
      area_hectares: Number(field.area) || 0,
      status: field.status,
      created_at: field.created_at ?? null,
      exported_at: new Date().toISOString(),
      source: "FARPHA",
    },
  };
}

export function exportFieldAsGeoJSON(field: Field, farm: Farm) {
  const feature = fieldToFeature(field, farm);

  if (!feature) {
    throw new Error("O talhão não possui uma geometria válida para exportação.");
  }

  const collection: FeatureCollection<Polygon> = {
    type: "FeatureCollection",
    features: [feature],
  };

  const fieldName = sanitizeFilename(field.name) || "talhao";
  downloadJson(collection, `farpha-${fieldName}.geojson`);
}

export function exportFieldsAsGeoJSON(fields: Field[], farm: Farm) {
  const features = fields
    .map((field) => fieldToFeature(field, farm))
    .filter((feature): feature is Feature<Polygon> => feature !== null);

  if (features.length === 0) {
    throw new Error("Nenhum talhão possui geometria válida para exportação.");
  }

  const collection: FeatureCollection<Polygon> = {
    type: "FeatureCollection",
    features,
  };

  const farmName = sanitizeFilename(farm.name) || "exploracao";
  downloadJson(collection, `farpha-${farmName}-talhoes.geojson`);
}
