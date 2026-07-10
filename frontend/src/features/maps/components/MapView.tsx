import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import * as turf from "@turf/turf";

import type { Farm } from "../../farms/types/farm";
import type { Field, PolygonGeometry } from "../../fields/types/field";

import "maplibre-gl/dist/maplibre-gl.css";

interface Props {
  farms: Farm[];
  fields?: Field[];
  drawingMode?: boolean;
  onPolygonCreated?: (geometry: PolygonGeometry, area: number) => void;
}

export default function MapView({
  farms,
  fields = [],
  drawingMode = false,
  onPolygonCreated,
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [points, setPoints] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!container.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: container.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-7.9, 39.5],
      zoom: 6,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.addSource("fields", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addLayer({
        id: "fields-fill",
        type: "fill",
        source: "fields",
        paint: {
          "fill-color": [
            "match",
            ["get", "status"],
            "healthy",
            "#16a34a",
            "attention",
            "#facc15",
            "critical",
            "#ef4444",
            "#16a34a",
          ],
          "fill-opacity": 0.35,
        },
      });

      map.addLayer({
        id: "fields-line",
        type: "line",
        source: "fields",
        paint: {
          "line-color": [
            "match",
            ["get", "status"],
            "healthy",
            "#15803d",
            "attention",
            "#ca8a04",
            "critical",
            "#b91c1c",
            "#15803d",
          ],
          "line-width": 3,
        },
      });

      map.addLayer({
        id: "fields-label",
        type: "symbol",
        source: "fields",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 14,
          "text-font": ["Noto Sans Regular"],
        },
        paint: {
          "text-color": "#064e3b",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
      });

      map.addSource("draft-field", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addLayer({
        id: "draft-fill",
        type: "fill",
        source: "draft-field",
        paint: {
          "fill-color": "#22c55e",
          "fill-opacity": 0.2,
        },
      });

      map.addLayer({
        id: "draft-line",
        type: "line",
        source: "draft-field",
        paint: {
          "line-color": "#16a34a",
          "line-width": 4,
          "line-dasharray": [2, 2],
        },
      });

      map.on("click", "fields-fill", (event) => {
        const feature = event.features?.[0];

        if (!feature) return;

        const name = feature.properties?.name ?? "Talhão";
        const crop = feature.properties?.crop ?? "";
        const area = feature.properties?.area ?? "";
        const status = feature.properties?.status ?? "";

        new maplibregl.Popup()
          .setLngLat(event.lngLat)
          .setHTML(`
            <div style="min-width:220px;font-family:Arial,Helvetica,sans-serif;">
              <h3 style="margin:0;color:#166534;font-size:18px;font-weight:bold;">
                🌱 ${name}
              </h3>

              <hr style="margin:10px 0" />

              <p style="margin:6px 0;">
                🌾 <strong>Cultura:</strong> ${crop}
              </p>

              <p style="margin:6px 0;">
                📐 <strong>Área:</strong> ${Number(area).toFixed(2)} ha
              </p>

              <p style="margin:6px 0;">
                📊 <strong>Estado:</strong> ${status}
              </p>
            </div>
          `)
          .addTo(map);
      });

      map.on("mouseenter", "fields-fill", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "fields-fill", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    farms.forEach((farm) => {
      const marker = new maplibregl.Marker({ color: "#16a34a" })
        .setLngLat([farm.longitude, farm.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });

    if (farms.length > 0) {
      const farm = farms[0];

      map.flyTo({
        center: [farm.longitude, farm.latitude],
        zoom: 15,
        speed: 1.2,
      });
    }
  }, [farms]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getSource("fields")) return;

    const features = fields
      .filter((field) => field.geometry)
      .map((field) => ({
        type: "Feature" as const,
        properties: {
          id: field.id,
          name: field.name,
          crop: field.crop,
          area: field.area,
          status: field.status,
        },
        geometry: field.geometry!,
      }));

    const source = map.getSource("fields") as maplibregl.GeoJSONSource;

    source.setData({
      type: "FeatureCollection",
      features,
    });
  }, [fields]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getSource("draft-field")) return;

    const features: GeoJSON.Feature[] = [];

    if (points.length >= 2) {
      features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: points,
        },
      });
    }

    if (points.length >= 3) {
      features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [[...points, points[0]]],
        },
      });
    }

    const source = map.getSource("draft-field") as maplibregl.GeoJSONSource;

    source.setData({
      type: "FeatureCollection",
      features,
    });
  }, [points]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    function handleClick(event: maplibregl.MapMouseEvent) {
      if (!drawingMode) return;

      setPoints((current) => [
        ...current,
        [event.lngLat.lng, event.lngLat.lat],
      ]);
    }

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [drawingMode]);

  function finishDrawing() {
    if (points.length < 3) {
      alert("Clique pelo menos 3 pontos no mapa.");
      return;
    }

    const coordinates = [...points, points[0]];

    const geometry: PolygonGeometry = {
      type: "Polygon",
      coordinates: [coordinates],
    };

    const polygon = turf.polygon([coordinates]);
    const area = turf.area(polygon) / 10000;

    onPolygonCreated?.(geometry, area);
    setPoints([]);
  }

  function clearDrawing() {
    setPoints([]);
  }

  return (
    <div className="relative h-full w-full">
      <div
        ref={container}
        className={`h-full w-full ${drawingMode ? "cursor-crosshair" : ""}`}
      />

      {drawingMode && (
        <div className="absolute left-4 top-4 z-10 rounded-2xl bg-white p-4 shadow-xl">
          <p className="text-sm font-bold text-slate-900">
            Desenhar Talhão
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Clique no mapa para marcar os pontos.
          </p>

          <p className="mt-2 text-sm text-green-700">
            Pontos: {points.length}
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={finishDrawing}
              className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
            >
              Concluir
            </button>

            <button
              onClick={clearDrawing}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-100"
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}