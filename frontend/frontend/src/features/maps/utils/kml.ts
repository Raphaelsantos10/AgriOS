import * as turf from "@turf/turf";

import type { Farm } from "../../farms/types/farm";
import type { Field, FieldStatus, PolygonGeometry } from "../../fields/types/field";
import type { ImportedFieldCandidate } from "./geojsonImport";

function sanitizeFilename(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function downloadText(text: string, filename: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function coordinatesToKml(coordinates: number[][]) {
  return coordinates
    .map(([longitude, latitude]) => `${longitude},${latitude},0`)
    .join(" ");
}

function fieldToPlacemark(field: Field, farm: Farm) {
  if (!field.geometry) return null;

  const rings = field.geometry.coordinates;
  const outerRing = rings[0];

  if (!outerRing || outerRing.length < 4) return null;

  const innerBoundaries = rings
    .slice(1)
    .map(
      (ring) => `
        <innerBoundaryIs>
          <LinearRing>
            <coordinates>${coordinatesToKml(ring)}</coordinates>
          </LinearRing>
        </innerBoundaryIs>`
    )
    .join("");

  return `
    <Placemark>
      <name>${escapeXml(field.name)}</name>
      <description>${escapeXml(
        `Exploração: ${farm.name}\nCultura: ${field.crop}\nÁrea: ${Number(field.area).toFixed(
          4
        )} ha\nEstado: ${field.status}`
      )}</description>
      <ExtendedData>
        <Data name="id"><value>${escapeXml(field.id)}</value></Data>
        <Data name="farm_id"><value>${escapeXml(field.farm_id)}</value></Data>
        <Data name="farm_name"><value>${escapeXml(farm.name)}</value></Data>
        <Data name="crop"><value>${escapeXml(field.crop)}</value></Data>
        <Data name="area_hectares"><value>${Number(field.area) || 0}</value></Data>
        <Data name="status"><value>${field.status}</value></Data>
        <Data name="source"><value>AgriOS</value></Data>
      </ExtendedData>
      <Polygon>
        <tessellate>1</tessellate>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordinatesToKml(outerRing)}</coordinates>
          </LinearRing>
        </outerBoundaryIs>${innerBoundaries}
      </Polygon>
    </Placemark>`;
}

function buildKml(fields: Field[], farm: Farm) {
  const placemarks = fields
    .map((field) => fieldToPlacemark(field, farm))
    .filter((placemark): placemark is string => Boolean(placemark));

  if (placemarks.length === 0) {
    throw new Error("Nenhum talhão possui geometria válida para exportação KML.");
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${escapeXml(farm.name)}</name>
    <description>Exportado pelo AgriOS em ${new Date().toISOString()}</description>
    <Style id="agrios-field">
      <LineStyle><color>ff287a3f</color><width>3</width></LineStyle>
      <PolyStyle><color>5539a85b</color></PolyStyle>
    </Style>
    ${placemarks.map((placemark) => placemark.replace("<Placemark>", '<Placemark><styleUrl>#agrios-field</styleUrl>')).join("\n")}
  </Document>
</kml>`;
}

export function exportFieldAsKML(field: Field, farm: Farm) {
  const filename = sanitizeFilename(field.name) || "talhao";
  downloadText(buildKml([field], farm), `agrios-${filename}.kml`, "application/vnd.google-earth.kml+xml;charset=utf-8");
}

export function exportFieldsAsKML(fields: Field[], farm: Farm) {
  const filename = sanitizeFilename(farm.name) || "exploracao";
  downloadText(buildKml(fields, farm), `agrios-${filename}-talhoes.kml`, "application/vnd.google-earth.kml+xml;charset=utf-8");
}

function normalizeStatus(value: string | null): FieldStatus {
  if (value === "attention" || value === "critical" || value === "healthy") {
    return value;
  }

  return "healthy";
}

function parseCoordinates(text: string) {
  const coordinates = text
    .trim()
    .split(/\s+/)
    .map((item) => {
      const [longitudeText, latitudeText] = item.split(",");
      const longitude = Number(longitudeText);
      const latitude = Number(latitudeText);

      if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
        throw new Error("O KML contém coordenadas inválidas.");
      }

      return [longitude, latitude];
    });

  if (coordinates.length < 3) {
    throw new Error("O KML contém um polígono com menos de três vértices.");
  }

  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];

  if (first[0] !== last[0] || first[1] !== last[1]) {
    coordinates.push([...first]);
  }

  return coordinates;
}

function getDirectChildText(parent: Element, tagName: string) {
  const child = Array.from(parent.children).find(
    (element) => element.localName === tagName
  );

  return child?.textContent?.trim() ?? "";
}

function getExtendedData(placemark: Element) {
  const data = new Map<string, string>();

  for (const element of Array.from(placemark.getElementsByTagNameNS("*", "Data"))) {
    const name = element.getAttribute("name");
    const value = element.getElementsByTagNameNS("*", "value")[0]?.textContent?.trim();

    if (name && value) data.set(name, value);
  }

  for (const element of Array.from(placemark.getElementsByTagNameNS("*", "SimpleData"))) {
    const name = element.getAttribute("name");
    const value = element.textContent?.trim();

    if (name && value) data.set(name, value);
  }

  return data;
}

function geometrySignature(geometry: PolygonGeometry) {
  return JSON.stringify(geometry.coordinates);
}

export function parseKMLFields(
  text: string,
  existingFields: Field[]
): ImportedFieldCandidate[] {
  const parser = new DOMParser();
  const document = parser.parseFromString(text, "application/xml");

  if (document.getElementsByTagName("parsererror").length > 0) {
    throw new Error("Não foi possível ler o ficheiro KML.");
  }

  const placemarks = Array.from(document.getElementsByTagNameNS("*", "Placemark"));
  const existingSignatures = new Set(
    existingFields
      .filter((field) => field.geometry)
      .map((field) => geometrySignature(field.geometry as PolygonGeometry))
  );
  const candidates: ImportedFieldCandidate[] = [];

  placemarks.forEach((placemark, placemarkIndex) => {
    const name = getDirectChildText(placemark, "name") || `Talhão KML ${placemarkIndex + 1}`;
    const extendedData = getExtendedData(placemark);
    const crop = extendedData.get("crop") || extendedData.get("culture") || "Milho";
    const status = normalizeStatus(extendedData.get("status") ?? null);
    const sourceId = extendedData.get("id") ?? placemark.getAttribute("id");
    const polygons = Array.from(placemark.getElementsByTagNameNS("*", "Polygon"));

    polygons.forEach((polygon, polygonIndex) => {
      const outerBoundary = polygon.getElementsByTagNameNS("*", "outerBoundaryIs")[0];
      const outerCoordinates = outerBoundary?.getElementsByTagNameNS("*", "coordinates")[0]?.textContent;

      if (!outerCoordinates?.trim()) return;

      const rings = [parseCoordinates(outerCoordinates)];
      const innerBoundaries = Array.from(
        polygon.getElementsByTagNameNS("*", "innerBoundaryIs")
      );

      for (const boundary of innerBoundaries) {
        const coordinatesText = boundary.getElementsByTagNameNS("*", "coordinates")[0]?.textContent;
        if (coordinatesText?.trim()) rings.push(parseCoordinates(coordinatesText));
      }

      const geometry: PolygonGeometry = {
        type: "Polygon",
        coordinates: rings,
      };
      const area = turf.area(turf.polygon(geometry.coordinates)) / 10000;
      const duplicate = existingSignatures.has(geometrySignature(geometry));

      candidates.push({
        key: `kml-${placemarkIndex}-${polygonIndex}-${sourceId ?? "sem-id"}`,
        sourceId: sourceId ?? null,
        name: polygons.length > 1 ? `${name} ${polygonIndex + 1}` : name,
        crop,
        status,
        geometry,
        area,
        selected: !duplicate,
        duplicate,
      });
    });
  });

  if (candidates.length === 0) {
    throw new Error("Nenhum polígono válido foi encontrado no ficheiro KML.");
  }

  return candidates;
}
