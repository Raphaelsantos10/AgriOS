import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import * as turf from "@turf/turf";

import type { Farm } from "../../farms/types/farm";
import type {
  Field,
  PolygonGeometry,
} from "../../fields/types/field";

import LayersManager, { type MapLayerPreferences } from "./LayersManager";

import "maplibre-gl/dist/maplibre-gl.css";

interface Props {
  farms: Farm[];
  fields?: Field[];
  drawingMode?: boolean;
  selectedFieldId?: string | null;
  focusFieldId?: string | null;
  editGeometryMode?: boolean;
  editableGeometry?: PolygonGeometry | null;
  splitMode?: boolean;
  splitFieldGeometry?: PolygonGeometry | null;
  splitPreview?: PolygonGeometry[] | null;
  onGeometryChange?: (geometry: PolygonGeometry, area: number) => void;
  onGeometryCommit?: (geometry: PolygonGeometry, area: number) => void;
  onFieldSelect?: (field: Field | null) => void;
  onSplitLineCreated?: (coordinates: [number, number][]) => void;
  onSplitCancel?: () => void;
  onPolygonCreated?: (
    geometry: PolygonGeometry,
    area: number
  ) => void;
}

type MeasurementMode = "distance" | "area" | null;

const LAYER_PREFERENCES_KEY = "agrios.map.layer-preferences.v1";

const DEFAULT_LAYER_PREFERENCES: MapLayerPreferences = {
  baseMap: "osm",
  fields: true,
  labels: true,
  farms: true,
  hillshade: true,
  measurements: true,
  draft: true,
  fieldsOpacity: 0.32,
  hillshadeOpacity: 0.25,
};

function loadLayerPreferences(): MapLayerPreferences {
  try {
    const saved = window.localStorage.getItem(LAYER_PREFERENCES_KEY);
    if (!saved) return DEFAULT_LAYER_PREFERENCES;
    return { ...DEFAULT_LAYER_PREFERENCES, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_LAYER_PREFERENCES;
  }
}

const EMPTY_COLLECTION: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

export default function MapView({
  farms,
  fields = [],
  drawingMode = false,
  selectedFieldId = null,
  focusFieldId = null,
  editGeometryMode = false,
  editableGeometry = null,
  splitMode = false,
  splitFieldGeometry = null,
  splitPreview = null,
  onGeometryChange,
  onGeometryCommit,
  onSplitLineCreated,
  onSplitCancel,
  onFieldSelect,
  onPolygonCreated,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const drawingModeRef = useRef(drawingMode);
  const editGeometryModeRef = useRef(editGeometryMode);
  const editableGeometryRef = useRef<PolygonGeometry | null>(editableGeometry);
  const onGeometryChangeRef = useRef(onGeometryChange);
  const onGeometryCommitRef = useRef(onGeometryCommit);
  const draggedVertexRef = useRef<number | null>(null);
  const fieldsRef = useRef<Field[]>(fields);
  const onFieldSelectRef = useRef(onFieldSelect);
  const onPolygonCreatedRef = useRef(onPolygonCreated);
  const measurementModeRef = useRef<MeasurementMode>(null);
  const splitModeRef = useRef(splitMode);
  const onSplitLineCreatedRef = useRef(onSplitLineCreated);

  const terrainAvailableRef = useRef(true);

  const [points, setPoints] = useState<[number, number][]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [view3D, setView3D] = useState(false);
  const [measurementMode, setMeasurementMode] = useState<MeasurementMode>(null);
  const [measurementPoints, setMeasurementPoints] = useState<[number, number][]>([]);
  const [splitPoints, setSplitPoints] = useState<[number, number][]>([]);
  const [layersOpen, setLayersOpen] = useState(false);
  const [layerPreferences, setLayerPreferences] = useState<MapLayerPreferences>(loadLayerPreferences);

  useEffect(() => {
    drawingModeRef.current = drawingMode;
  }, [drawingMode]);

  useEffect(() => {
    measurementModeRef.current = measurementMode;
  }, [measurementMode]);

  useEffect(() => {
    splitModeRef.current = splitMode;
    if (!splitMode) queueMicrotask(() => setSplitPoints([]));
  }, [splitMode]);

  useEffect(() => {
    onSplitLineCreatedRef.current = onSplitLineCreated;
  }, [onSplitLineCreated]);

  useEffect(() => {
    editGeometryModeRef.current = editGeometryMode;
  }, [editGeometryMode]);

  useEffect(() => {
    editableGeometryRef.current = editableGeometry;
  }, [editableGeometry]);

  useEffect(() => {
    onGeometryChangeRef.current = onGeometryChange;
  }, [onGeometryChange]);

  useEffect(() => {
    onGeometryCommitRef.current = onGeometryCommit;
  }, [onGeometryCommit]);

  useEffect(() => {
    fieldsRef.current = fields;
  }, [fields]);

  useEffect(() => {
    onFieldSelectRef.current = onFieldSelect;
  }, [onFieldSelect]);

  useEffect(() => {
    onPolygonCreatedRef.current = onPolygonCreated;
  }, [onPolygonCreated]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const container = containerRef.current;

    const map = new maplibregl.Map({
      container,
      center: [-7.9, 39.5],
      zoom: 6,
      pitch: 0,
      bearing: 0,
      maxPitch: 75,

      canvasContextAttributes: {
        antialias: true,
      },

      style: {
        version: 8,

        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            maxzoom: 19,
            attribution: "© OpenStreetMap contributors",
          },

          satellite: {
            type: "raster",
            tiles: [
              "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            maxzoom: 19,
            attribution: "© Esri",
          },

          topographic: {
            type: "raster",
            tiles: [
              "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            maxzoom: 19,
            attribution: "© Esri, HERE, Garmin, FAO, NOAA, USGS",
          },

          light: {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
              "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
              "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            maxzoom: 20,
            attribution: "© OpenStreetMap contributors © CARTO",
          },
        },

        layers: [
          {
            id: "osm-layer",
            type: "raster",
            source: "osm",
            layout: {
              visibility: "visible",
            },
          },

          {
            id: "satellite-layer",
            type: "raster",
            source: "satellite",
            layout: {
              visibility: "none",
            },
          },

          {
            id: "topographic-layer",
            type: "raster",
            source: "topographic",
            layout: {
              visibility: "none",
            },
          },

          {
            id: "light-layer",
            type: "raster",
            source: "light",
            layout: {
              visibility: "none",
            },
          },
        ],
      },
    });

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      }),
      "top-right"
    );

    map.addControl(
      new maplibregl.FullscreenControl(),
      "top-right"
    );

    map.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 120,
        unit: "metric",
      }),
      "bottom-left"
    );

    map.on("error", (event) => {
      const message =
        event.error instanceof Error
          ? event.error.message
          : String(event.error ?? "");

      const normalizedMessage = message.toLowerCase();

      if (
        normalizedMessage.includes("terrain") ||
        normalizedMessage.includes("raster-dem") ||
        normalizedMessage.includes("terrarium")
      ) {
        terrainAvailableRef.current = false;

        console.error(
          "Não foi possível carregar o relevo 3D:",
          event.error
        );
      }
    });

    map.on("load", () => {
      if (!map.getSource("terrain-dem")) {
        map.addSource("terrain-dem", {
          type: "raster-dem",

          tiles: [
            "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
          ],

          tileSize: 256,
          maxzoom: 15,
          encoding: "terrarium",

          attribution:
            "Terrain Tiles: Tilezen, OpenStreetMap and contributors",
        });
      }

      if (!map.getLayer("terrain-hillshade")) {
        map.addLayer({
          id: "terrain-hillshade",
          type: "hillshade",
          source: "terrain-dem",

          layout: {
            visibility: "none",
          },

          paint: {
            "hillshade-shadow-color": "#3f3a2e",
            "hillshade-highlight-color": "#ffffff",
            "hillshade-accent-color": "#64748b",
            "hillshade-exaggeration": 0.25,
          },
        });
      }

      if (!map.getSource("fields")) {
        map.addSource("fields", {
          type: "geojson",
          data: EMPTY_COLLECTION,
        });
      }

      if (!map.getLayer("fields-fill")) {
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
              "#f59e0b",

              "critical",
              "#ef4444",

              "#16a34a",
            ],

            "fill-opacity": 0.32,
          },
        });
      }

      if (!map.getLayer("fields-line")) {
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
              "#b45309",

              "critical",
              "#b91c1c",

              "#15803d",
            ],

            "line-width": 3,
          },
        });
      }

      if (!map.getLayer("selected-field-glow")) {
        map.addLayer({
          id: "selected-field-glow",
          type: "line",
          source: "fields",

          filter: [
            "==",
            ["get", "id"],
            "",
          ],

          paint: {
            "line-color": "#ffffff",
            "line-width": 10,
            "line-opacity": 0.9,
            "line-blur": 3,
          },
        });
      }

      if (!map.getLayer("selected-field-fill")) {
        map.addLayer({
          id: "selected-field-fill",
          type: "fill",
          source: "fields",

          filter: [
            "==",
            ["get", "id"],
            "",
          ],

          paint: {
            "fill-color": [
              "match",
              ["get", "status"],

              "healthy",
              "#22c55e",

              "attention",
              "#fbbf24",

              "critical",
              "#f87171",

              "#22c55e",
            ],

            "fill-opacity": 0.58,
          },
        });
      }

      if (!map.getLayer("selected-field-line")) {
        map.addLayer({
          id: "selected-field-line",
          type: "line",
          source: "fields",

          filter: [
            "==",
            ["get", "id"],
            "",
          ],

          paint: {
            "line-color": [
              "match",
              ["get", "status"],

              "healthy",
              "#065f46",

              "attention",
              "#92400e",

              "critical",
              "#991b1b",

              "#065f46",
            ],

            "line-width": 5,
          },
        });
      }

      if (!map.getLayer("fields-label")) {
        map.addLayer({
          id: "fields-label",
          type: "symbol",
          source: "fields",

          layout: {
            "text-field": [
              "format",

              ["get", "name"],
              {
                "font-scale": 1.1,
              },

              "\n",
              {},

              ["to-string", ["get", "area"]],
              {
                "font-scale": 0.85,
              },

              " ha",
              {
                "font-scale": 0.85,
              },
            ],

            "text-size": 13,
            "text-anchor": "center",
            "text-allow-overlap": false,
          },

          paint: {
            "text-color": "#064e3b",
            "text-halo-color": "#ffffff",
            "text-halo-width": 2,
            "text-halo-blur": 1,
          },
        });
      }

      if (!map.getSource("draft-field")) {
        map.addSource("draft-field", {
          type: "geojson",
          data: EMPTY_COLLECTION,
        });
      }

      if (!map.getLayer("draft-fill")) {
        map.addLayer({
          id: "draft-fill",
          type: "fill",
          source: "draft-field",

          paint: {
            "fill-color": "#22c55e",
            "fill-opacity": 0.22,
          },
        });
      }

      if (!map.getLayer("draft-line")) {
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
      }

      if (!map.getSource("edit-field")) {
        map.addSource("edit-field", {
          type: "geojson",
          data: EMPTY_COLLECTION,
        });
      }

      if (!map.getLayer("edit-field-fill")) {
        map.addLayer({
          id: "edit-field-fill",
          type: "fill",
          source: "edit-field",
          filter: ["==", ["geometry-type"], "Polygon"],
          paint: {
            "fill-color": "#2563eb",
            "fill-opacity": 0.2,
          },
        });
      }

      if (!map.getLayer("edit-field-line")) {
        map.addLayer({
          id: "edit-field-line",
          type: "line",
          source: "edit-field",
          filter: ["==", ["geometry-type"], "Polygon"],
          paint: {
            "line-color": "#1d4ed8",
            "line-width": 4,
            "line-dasharray": [1.5, 1],
          },
        });
      }

      if (!map.getLayer("edit-midpoints")) {
        map.addLayer({
          id: "edit-midpoints",
          type: "circle",
          source: "edit-field",
          filter: ["==", ["get", "kind"], "midpoint"],
          paint: {
            "circle-radius": 5,
            "circle-color": "#ffffff",
            "circle-stroke-color": "#2563eb",
            "circle-stroke-width": 2,
          },
        });
      }

      if (!map.getLayer("edit-vertices")) {
        map.addLayer({
          id: "edit-vertices",
          type: "circle",
          source: "edit-field",
          filter: ["==", ["get", "kind"], "vertex"],
          paint: {
            "circle-radius": 7,
            "circle-color": "#2563eb",
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 3,
          },
        });
      }

      if (!map.getSource("split-tool")) {
        map.addSource("split-tool", {
          type: "geojson",
          data: EMPTY_COLLECTION,
        });
      }

      if (!map.getLayer("split-preview-fill")) {
        map.addLayer({
          id: "split-preview-fill",
          type: "fill",
          source: "split-tool",
          filter: ["==", ["get", "kind"], "preview"],
          paint: {
            "fill-color": ["match", ["get", "part"], 0, "#2563eb", "#7c3aed"],
            "fill-opacity": 0.38,
          },
        });
      }

      if (!map.getLayer("split-preview-line")) {
        map.addLayer({
          id: "split-preview-line",
          type: "line",
          source: "split-tool",
          filter: ["==", ["get", "kind"], "preview"],
          paint: {
            "line-color": ["match", ["get", "part"], 0, "#1d4ed8", "#6d28d9"],
            "line-width": 4,
          },
        });
      }

      if (!map.getLayer("split-cut-line")) {
        map.addLayer({
          id: "split-cut-line",
          type: "line",
          source: "split-tool",
          filter: ["==", ["get", "kind"], "cut"],
          paint: {
            "line-color": "#dc2626",
            "line-width": 4,
            "line-dasharray": [2, 1],
          },
        });
      }

      if (!map.getLayer("split-cut-points")) {
        map.addLayer({
          id: "split-cut-points",
          type: "circle",
          source: "split-tool",
          filter: ["==", ["get", "kind"], "cut-point"],
          paint: {
            "circle-radius": 6,
            "circle-color": "#dc2626",
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
          },
        });
      }

      if (!map.getSource("measurement")) {
        map.addSource("measurement", {
          type: "geojson",
          data: EMPTY_COLLECTION,
        });
      }

      if (!map.getLayer("measurement-fill")) {
        map.addLayer({
          id: "measurement-fill",
          type: "fill",
          source: "measurement",
          filter: ["==", ["geometry-type"], "Polygon"],
          paint: {
            "fill-color": "#f59e0b",
            "fill-opacity": 0.2,
          },
        });
      }

      if (!map.getLayer("measurement-line")) {
        map.addLayer({
          id: "measurement-line",
          type: "line",
          source: "measurement",
          filter: ["in", ["geometry-type"], ["literal", ["LineString", "Polygon"]]],
          paint: {
            "line-color": "#d97706",
            "line-width": 3,
            "line-dasharray": [2, 1],
          },
        });
      }

      if (!map.getLayer("measurement-points")) {
        map.addLayer({
          id: "measurement-points",
          type: "circle",
          source: "measurement",
          filter: ["==", ["geometry-type"], "Point"],
          paint: {
            "circle-radius": 6,
            "circle-color": "#f59e0b",
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
          },
        });
      }

      map.on("click", "fields-fill", (event) => {
        if (drawingModeRef.current || editGeometryModeRef.current || measurementModeRef.current || splitModeRef.current) {
          return;
        }

        const feature = event.features?.[0];
        const fieldId = feature?.properties?.id;

        if (!fieldId) {
          return;
        }

        const selectedField =
          fieldsRef.current.find(
            (field) => field.id === String(fieldId)
          ) ?? null;

        onFieldSelectRef.current?.(selectedField);
      });

      map.on("click", (event) => {
        if (drawingModeRef.current || editGeometryModeRef.current || measurementModeRef.current || splitModeRef.current) {
          return;
        }

        const visibleFields = map.queryRenderedFeatures(
          event.point,
          {
            layers: ["fields-fill"],
          }
        );

        if (visibleFields.length === 0) {
          onFieldSelectRef.current?.(null);
        }
      });

      map.on("mouseenter", "fields-fill", () => {
        if (!drawingModeRef.current && !editGeometryModeRef.current && !measurementModeRef.current && !splitModeRef.current) {
          map.getCanvas().style.cursor = "pointer";
        }
      });

      map.on("mouseleave", "fields-fill", () => {
        map.getCanvas().style.cursor =
          drawingModeRef.current
            ? "crosshair"
            : editGeometryModeRef.current
              ? "default"
              : "";
      });

      setMapLoaded(true);

      window.setTimeout(() => {
        map.resize();
      }, 100);
    });

    mapRef.current = map;

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    resizeObserver.observe(container);

    resizeObserverRef.current = resizeObserver;

    return () => {
      resizeObserver.disconnect();
      resizeObserverRef.current = null;

      markersRef.current.forEach((marker) => {
        marker.remove();
      });

      markersRef.current = [];

      map.remove();
      mapRef.current = null;
    };
  }, []);


  useEffect(() => {
    window.localStorage.setItem(
      LAYER_PREFERENCES_KEY,
      JSON.stringify(layerPreferences)
    );
  }, [layerPreferences]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) {
      return;
    }

    const setVisibility = (layerId: string, visible: boolean) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
      }
    };

    ["fields-fill", "fields-line", "selected-field-glow", "selected-field-fill", "selected-field-line"].forEach(
      (layerId) => setVisibility(layerId, layerPreferences.fields)
    );
    setVisibility("fields-label", layerPreferences.fields && layerPreferences.labels);
    setVisibility("terrain-hillshade", view3D && layerPreferences.hillshade);
    ["measurement-fill", "measurement-line", "measurement-points"].forEach(
      (layerId) => setVisibility(layerId, layerPreferences.measurements)
    );
    ["draft-fill", "draft-line", "edit-field-fill", "edit-field-line", "edit-midpoints", "edit-vertices"].forEach(
      (layerId) => setVisibility(layerId, layerPreferences.draft)
    );

    if (map.getLayer("fields-fill")) {
      map.setPaintProperty(
        "fields-fill",
        "fill-opacity",
        selectedFieldId ? layerPreferences.fieldsOpacity / 2 : layerPreferences.fieldsOpacity
      );
    }

    if (map.getLayer("terrain-hillshade")) {
      map.setPaintProperty(
        "terrain-hillshade",
        "hillshade-exaggeration",
        layerPreferences.hillshadeOpacity
      );
    }

    markersRef.current.forEach((marker) => {
      marker.getElement().style.display = layerPreferences.farms ? "" : "none";
    });
  }, [layerPreferences, mapLoaded, selectedFieldId, view3D]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) {
      return;
    }

    map.getCanvas().style.cursor = drawingMode
      ? "crosshair"
      : editGeometryMode
        ? "default"
        : "";
  }, [drawingMode, editGeometryMode, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) {
      return;
    }

    const baseLayers = {
      osm: "osm-layer",
      satellite: "satellite-layer",
      topographic: "topographic-layer",
      light: "light-layer",
    } as const;

    Object.entries(baseLayers).forEach(([baseMapId, layerId]) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          "visibility",
          layerPreferences.baseMap === baseMapId ? "visible" : "none"
        );
      }
    });
  }, [layerPreferences.baseMap, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) {
      return;
    }

    if (view3D && terrainAvailableRef.current) {
      try {
        map.setTerrain({
          source: "terrain-dem",
          exaggeration: 1.1,
        });

        if (map.getLayer("terrain-hillshade")) {
          map.setLayoutProperty(
            "terrain-hillshade",
            "visibility",
            "visible"
          );
        }

        map.easeTo({
          pitch: 55,
          bearing: -18,
          duration: 1000,
        });
      } catch (error) {
        terrainAvailableRef.current = false;

        console.error("MAP 3D ERROR:", error);

        map.setTerrain(null);

        if (map.getLayer("terrain-hillshade")) {
          map.setLayoutProperty(
            "terrain-hillshade",
            "visibility",
            "none"
          );
        }

        map.easeTo({
          pitch: 0,
          bearing: 0,
          duration: 800,
        });
      }
    } else {
      map.setTerrain(null);

      if (map.getLayer("terrain-hillshade")) {
        map.setLayoutProperty(
          "terrain-hillshade",
          "visibility",
          "none"
        );
      }

      map.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 800,
      });
    }

    window.setTimeout(() => {
      map.resize();
    }, 1100);
  }, [view3D, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) {
      return;
    }

    markersRef.current.forEach((marker) => {
      marker.remove();
    });

    markersRef.current = [];

    farms.forEach((farm) => {
      const latitude = Number(farm.latitude);
      const longitude = Number(farm.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return;
      }

      const popup = new maplibregl.Popup({
        offset: 28,
      }).setHTML(`
        <div style="
          min-width: 210px;
          font-family: Arial, Helvetica, sans-serif;
        ">
          <h3 style="
            margin: 0;
            color: #166534;
            font-size: 18px;
          ">
            🌾 ${farm.name}
          </h3>

          <p style="margin: 8px 0 0;">
            <strong>${farm.area} ha</strong> • ${farm.crop}
          </p>

          <p style="
            margin: 4px 0 0;
            color: #64748b;
          ">
            ${farm.owner}
          </p>
        </div>
      `);

      const marker = new maplibregl.Marker({
        color: "#15803d",
      })
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map);

      marker.getElement().style.display = layerPreferences.farms ? "" : "none";
      markersRef.current.push(marker);
    });

    if (farms.length > 0) {
      const farm = farms[0];

      const latitude = Number(farm.latitude);
      const longitude = Number(farm.longitude);

      if (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude)
      ) {
        map.flyTo({
          center: [longitude, latitude],
          zoom: 16,
          pitch: view3D ? 55 : 0,
          bearing: view3D ? -18 : 0,
          speed: 1.2,
          curve: 1.3,
        });
      }
    }
  }, [farms, mapLoaded, view3D, layerPreferences.farms]);

  useEffect(() => {
    const map = mapRef.current;

    if (
      !map ||
      !mapLoaded ||
      !map.getSource("fields")
    ) {
      return;
    }

    const features: GeoJSON.Feature<GeoJSON.Polygon>[] =
      fields
        .filter(
          (
            field
          ): field is Field & {
            geometry: PolygonGeometry;
          } => Boolean(field.geometry)
        )
        .map((field) => ({
          type: "Feature",

          properties: {
            id: field.id,
            name: field.name,
            crop: field.crop,
            area: Number(field.area).toFixed(2),
            status: field.status,
          },

          geometry: field.geometry,
        }));

    const source = map.getSource(
      "fields"
    ) as maplibregl.GeoJSONSource;

    source.setData({
      type: "FeatureCollection",
      features,
    });
  }, [fields, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) {
      return;
    }

    const filter: maplibregl.FilterSpecification = [
      "==",
      ["get", "id"],
      selectedFieldId ?? "",
    ];

    const selectedLayers = [
      "selected-field-glow",
      "selected-field-fill",
      "selected-field-line",
    ];

    selectedLayers.forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setFilter(layerId, filter);
      }
    });

    if (map.getLayer("fields-fill")) {
      map.setPaintProperty(
        "fields-fill",
        "fill-opacity",
        selectedFieldId ? layerPreferences.fieldsOpacity / 2 : layerPreferences.fieldsOpacity
      );
    }
  }, [selectedFieldId, mapLoaded, layerPreferences.fieldsOpacity]);

  useEffect(() => {
    const map = mapRef.current;

    if (
      !map ||
      !mapLoaded ||
      !focusFieldId
    ) {
      return;
    }

    const field = fields.find(
      (item) => item.id === focusFieldId
    );

    if (!field?.geometry) {
      return;
    }

    try {
      const polygon = turf.polygon(
        field.geometry.coordinates
      );

      const [west, south, east, north] =
        turf.bbox(polygon);

      if (
        !Number.isFinite(west) ||
        !Number.isFinite(south) ||
        !Number.isFinite(east) ||
        !Number.isFinite(north)
      ) {
        return;
      }

      map.fitBounds(
        [
          [west, south],
          [east, north],
        ],
        {
          padding: {
            top: 90,
            bottom: 90,
            left: 90,
            right: 440,
          },

          maxZoom: 18,
          duration: 1100,
          pitch: view3D ? 45 : 0,
          bearing: view3D ? -15 : 0,
        }
      );

      window.setTimeout(() => {
        map.resize();
      }, 1150);
    } catch (error) {
      console.error("FIELD CENTER ERROR:", error);
    }
  }, [
    focusFieldId,
    fields,
    mapLoaded,
    view3D,
  ]);

  useEffect(() => {
    const map = mapRef.current;

    if (
      !map ||
      !mapLoaded ||
      !map.getSource("draft-field")
    ) {
      return;
    }

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
          coordinates: [
            [...points, points[0]],
          ],
        },
      });
    }

    const source = map.getSource(
      "draft-field"
    ) as maplibregl.GeoJSONSource;

    source.setData({
      type: "FeatureCollection",
      features,
    });
  }, [points, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) {
      return;
    }

    function handleMapClick(
      event: maplibregl.MapMouseEvent
    ) {
      if (splitModeRef.current) {
        setSplitPoints((current) => [
          ...current,
          [event.lngLat.lng, event.lngLat.lat],
        ]);
        return;
      }

      if (measurementModeRef.current) {
        setMeasurementPoints((current) => [
          ...current,
          [event.lngLat.lng, event.lngLat.lat],
        ]);
        return;
      }

      if (!drawingModeRef.current) {
        return;
      }

      setPoints((current) => [
        ...current,
        [
          event.lngLat.lng,
          event.lngLat.lat,
        ],
      ]);
    }

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const source = map.getSource("split-tool") as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    const features: GeoJSON.Feature[] = [];

    if (splitMode && splitFieldGeometry) {
      features.push({
        type: "Feature",
        properties: { kind: "preview", part: -1 },
        geometry: splitFieldGeometry,
      });
    }

    if (splitPoints.length >= 2) {
      features.push({
        type: "Feature",
        properties: { kind: "cut" },
        geometry: { type: "LineString", coordinates: splitPoints },
      });
    }

    splitPoints.forEach((coordinate, index) => {
      features.push({
        type: "Feature",
        properties: { kind: "cut-point", index },
        geometry: { type: "Point", coordinates: coordinate },
      });
    });

    splitPreview?.forEach((geometry, index) => {
      features.push({
        type: "Feature",
        properties: { kind: "preview", part: index },
        geometry,
      });
    });

    source.setData({ type: "FeatureCollection", features });
  }, [mapLoaded, splitMode, splitFieldGeometry, splitPreview, splitPoints]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) {
      return;
    }

    const source = map.getSource("measurement") as maplibregl.GeoJSONSource | undefined;

    if (!source) {
      return;
    }

    const features: GeoJSON.Feature[] = measurementPoints.map((coordinate, index) => ({
      type: "Feature",
      properties: { index },
      geometry: {
        type: "Point",
        coordinates: coordinate,
      },
    }));

    if (measurementMode === "distance" && measurementPoints.length >= 2) {
      features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: measurementPoints,
        },
      });
    }

    if (measurementMode === "area" && measurementPoints.length >= 3) {
      features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [[...measurementPoints, measurementPoints[0]]],
        },
      });
    } else if (measurementMode === "area" && measurementPoints.length >= 2) {
      features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: measurementPoints,
        },
      });
    }

    source.setData({
      type: "FeatureCollection",
      features,
    });
  }, [mapLoaded, measurementMode, measurementPoints]);

  const measurementResult = useMemo(() => {
    if (measurementMode === "distance" && measurementPoints.length >= 2) {
      const line = turf.lineString(measurementPoints);
      const meters = turf.length(line, { units: "kilometers" }) * 1000;

      return meters >= 1000
        ? `${(meters / 1000).toFixed(2)} km`
        : `${meters.toFixed(1)} m`;
    }

    if (measurementMode === "area" && measurementPoints.length >= 3) {
      const polygon = turf.polygon([[...measurementPoints, measurementPoints[0]]]);
      const squareMeters = turf.area(polygon);

      return squareMeters >= 10000
        ? `${(squareMeters / 10000).toFixed(2)} ha`
        : `${squareMeters.toFixed(1)} m²`;
    }

    return "—";
  }, [measurementMode, measurementPoints]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) {
      return;
    }

    const source = map.getSource("edit-field") as maplibregl.GeoJSONSource | undefined;

    if (!source) {
      return;
    }

    const activeMap = map;
    const activeSource = source;

    function buildEditCollection(geometry: PolygonGeometry | null): GeoJSON.FeatureCollection {
      if (!geometry || geometry.coordinates.length === 0) {
        return EMPTY_COLLECTION;
      }

      const closedRing = geometry.coordinates[0] ?? [];
      const ring = closedRing.length > 1
        ? closedRing.slice(0, -1)
        : closedRing;

      const features: GeoJSON.Feature[] = [
        {
          type: "Feature",
          properties: { kind: "polygon" },
          geometry,
        },
      ];

      ring.forEach((coordinate, index) => {
        features.push({
          type: "Feature",
          properties: { kind: "vertex", index },
          geometry: { type: "Point", coordinates: coordinate },
        });

        const next = ring[(index + 1) % ring.length];
        if (next) {
          features.push({
            type: "Feature",
            properties: { kind: "midpoint", index },
            geometry: {
              type: "Point",
              coordinates: [
                (coordinate[0] + next[0]) / 2,
                (coordinate[1] + next[1]) / 2,
              ],
            },
          });
        }
      });

      return { type: "FeatureCollection", features };
    }

    function publishGeometry(ring: number[][]) {
      if (ring.length < 3) {
        return null;
      }

      const closedRing = [...ring, [...ring[0]]];
      const geometry: PolygonGeometry = {
        type: "Polygon",
        coordinates: [closedRing],
      };

      editableGeometryRef.current = geometry;
      activeSource.setData(buildEditCollection(geometry));

      const polygon = turf.polygon(geometry.coordinates);
      const area = turf.area(polygon) / 10000;
      onGeometryChangeRef.current?.(geometry, area);

      return { geometry, area };
    }

    activeSource.setData(
      editGeometryMode
        ? buildEditCollection(editableGeometry)
        : EMPTY_COLLECTION
    );

    if (!editGeometryMode) {
      return;
    }

    function getRing() {
      const coordinates = editableGeometryRef.current?.coordinates[0] ?? [];
      return coordinates.length > 1 ? coordinates.slice(0, -1).map((point) => [...point]) : [];
    }

    function handleVertexMouseDown(event: maplibregl.MapLayerMouseEvent) {
      const index = Number(event.features?.[0]?.properties?.index);
      if (!Number.isInteger(index)) return;
      event.preventDefault();
      draggedVertexRef.current = index;
      activeMap.dragPan.disable();
      activeMap.getCanvas().style.cursor = "grabbing";
    }

    function handleMouseMove(event: maplibregl.MapMouseEvent) {
      const index = draggedVertexRef.current;
      if (index === null) return;
      const ring = getRing();
      if (!ring[index]) return;
      ring[index] = [event.lngLat.lng, event.lngLat.lat];
      publishGeometry(ring);
    }

    function handleMouseUp() {
      if (draggedVertexRef.current === null) return;
      draggedVertexRef.current = null;
      activeMap.dragPan.enable();
      activeMap.getCanvas().style.cursor = "default";

      const geometry = editableGeometryRef.current;

      if (geometry) {
        const polygon = turf.polygon(geometry.coordinates);
        const area = turf.area(polygon) / 10000;
        onGeometryCommitRef.current?.(geometry, area);
      }
    }

    function handleMidpointClick(event: maplibregl.MapLayerMouseEvent) {
      const index = Number(event.features?.[0]?.properties?.index);
      if (!Number.isInteger(index)) return;
      const ring = getRing();
      ring.splice(index + 1, 0, [event.lngLat.lng, event.lngLat.lat]);
      const result = publishGeometry(ring);

      if (result) {
        onGeometryCommitRef.current?.(result.geometry, result.area);
      }
    }

    function handleVertexContextMenu(event: maplibregl.MapLayerMouseEvent) {
      event.preventDefault();
      const index = Number(event.features?.[0]?.properties?.index);
      const ring = getRing();
      if (!Number.isInteger(index) || ring.length <= 3) {
        if (ring.length <= 3) alert("Um talhão precisa de pelo menos três vértices.");
        return;
      }
      ring.splice(index, 1);
      const result = publishGeometry(ring);

      if (result) {
        onGeometryCommitRef.current?.(result.geometry, result.area);
      }
    }

    function handleVertexEnter() { activeMap.getCanvas().style.cursor = "grab"; }
    function handleVertexLeave() { if (draggedVertexRef.current === null) activeMap.getCanvas().style.cursor = "default"; }
    function handleMidpointEnter() { activeMap.getCanvas().style.cursor = "copy"; }
    function handleMidpointLeave() { activeMap.getCanvas().style.cursor = "default"; }

    activeMap.on("mousedown", "edit-vertices", handleVertexMouseDown);
    activeMap.on("mousemove", handleMouseMove);
    activeMap.on("mouseup", handleMouseUp);
    activeMap.on("click", "edit-midpoints", handleMidpointClick);
    activeMap.on("contextmenu", "edit-vertices", handleVertexContextMenu);
    activeMap.on("mouseenter", "edit-vertices", handleVertexEnter);
    activeMap.on("mouseleave", "edit-vertices", handleVertexLeave);
    activeMap.on("mouseenter", "edit-midpoints", handleMidpointEnter);
    activeMap.on("mouseleave", "edit-midpoints", handleMidpointLeave);

    return () => {
      draggedVertexRef.current = null;
      activeMap.dragPan.enable();
      activeMap.off("mousedown", "edit-vertices", handleVertexMouseDown);
      activeMap.off("mousemove", handleMouseMove);
      activeMap.off("mouseup", handleMouseUp);
      activeMap.off("click", "edit-midpoints", handleMidpointClick);
      activeMap.off("contextmenu", "edit-vertices", handleVertexContextMenu);
      activeMap.off("mouseenter", "edit-vertices", handleVertexEnter);
      activeMap.off("mouseleave", "edit-vertices", handleVertexLeave);
      activeMap.off("mouseenter", "edit-midpoints", handleMidpointEnter);
      activeMap.off("mouseleave", "edit-midpoints", handleMidpointLeave);
    };
  }, [editGeometryMode, editableGeometry, mapLoaded]);

  function finishDrawing() {
    if (points.length < 3) {
      alert("Marque pelo menos três pontos no mapa.");
      return;
    }

    const coordinates = [
      ...points,
      points[0],
    ];

    const geometry: PolygonGeometry = {
      type: "Polygon",
      coordinates: [coordinates],
    };

    const polygon = turf.polygon([
      coordinates,
    ]);

    const areaInHectares =
      turf.area(polygon) / 10000;

    if (
      !Number.isFinite(areaInHectares) ||
      areaInHectares <= 0
    ) {
      alert("Não foi possível calcular a área.");
      return;
    }

    onPolygonCreatedRef.current?.(
      geometry,
      areaInHectares
    );

    setPoints([]);
  }

  function undoLastPoint() {
    setPoints((current) =>
      current.slice(0, -1)
    );
  }

  function clearDrawing() {
    setPoints([]);
  }

  function startMeasurement(mode: Exclude<MeasurementMode, null>) {
    setMeasurementMode((current) => {
      const nextMode = current === mode ? null : mode;
      measurementModeRef.current = nextMode;
      return nextMode;
    });
    setMeasurementPoints([]);
    setPoints([]);
  }

  function undoMeasurementPoint() {
    setMeasurementPoints((current) => current.slice(0, -1));
  }

  function clearMeasurement() {
    setMeasurementPoints([]);
  }

  function closeMeasurement() {
    measurementModeRef.current = null;
    setMeasurementMode(null);
    setMeasurementPoints([]);
  }

  function finishSplitLine() {
    if (splitPoints.length < 2) {
      alert("Marque pelo menos dois pontos para definir a linha de corte.");
      return;
    }
    onSplitLineCreatedRef.current?.(splitPoints);
  }

  function undoSplitPoint() {
    setSplitPoints((current) => current.slice(0, -1));
  }

  function clearSplitLine() {
    setSplitPoints([]);
  }

  function cancelSplitMode() {
    setSplitPoints([]);
    onSplitCancel?.();
  }

  function centralizeFarm() {
    const map = mapRef.current;

    if (!map || farms.length === 0) {
      return;
    }

    const farm = farms[0];

    const latitude = Number(farm.latitude);
    const longitude = Number(farm.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    map.flyTo({
      center: [longitude, latitude],
      zoom: 16,
      pitch: view3D ? 55 : 0,
      bearing: view3D ? -18 : 0,
      duration: 1000,
    });
  }

  function toggle3D() {
    if (!terrainAvailableRef.current) {
      alert(
        "O serviço de relevo não está disponível neste momento."
      );

      return;
    }

    setView3D((current) => !current);
  }

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className="h-full w-full"
      />

      <div className="absolute right-14 top-3 z-10 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur">
        <button
          type="button"
          onClick={() =>
            setLayerPreferences((current) => ({ ...current, baseMap: "osm" }))
          }
          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
            layerPreferences.baseMap === "osm"
              ? "bg-green-700 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          🗺️ Mapa
        </button>

        <button
          type="button"
          onClick={() =>
            setLayerPreferences((current) => ({ ...current, baseMap: "satellite" }))
          }
          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
            layerPreferences.baseMap === "satellite"
              ? "bg-green-700 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          🛰️ Satélite
        </button>

        <button
          type="button"
          onClick={() =>
            setLayerPreferences((current) => ({ ...current, baseMap: "topographic" }))
          }
          className={`hidden rounded-lg px-3 py-2 text-xs font-semibold transition xl:block ${
            layerPreferences.baseMap === "topographic"
              ? "bg-green-700 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          ⛰️ Topo
        </button>

        <button
          type="button"
          onClick={() =>
            setLayerPreferences((current) => ({ ...current, baseMap: "light" }))
          }
          className={`hidden rounded-lg px-3 py-2 text-xs font-semibold transition 2xl:block ${
            layerPreferences.baseMap === "light"
              ? "bg-green-700 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          ☀️ Claro
        </button>

        <button
          type="button"
          onClick={toggle3D}
          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
            view3D
              ? "bg-blue-700 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          🌍 {view3D ? "2D" : "3D"}
        </button>

        <button
          type="button"
          onClick={() => startMeasurement("distance")}
          disabled={drawingMode || editGeometryMode || splitMode}
          className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
            measurementMode === "distance"
              ? "bg-amber-500 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Medir distância"
        >
          📏 Distância
        </button>

        <button
          type="button"
          onClick={() => startMeasurement("area")}
          disabled={drawingMode || editGeometryMode || splitMode}
          className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
            measurementMode === "area"
              ? "bg-amber-500 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Medir área"
        >
          📐 Área
        </button>

        <button
          type="button"
          onClick={centralizeFarm}
          className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          title="Centralizar exploração"
        >
          🎯
        </button>
      </div>

      <LayersManager
        open={layersOpen}
        preferences={layerPreferences}
        onOpenChange={setLayersOpen}
        onChange={setLayerPreferences}
        onReset={() => setLayerPreferences(DEFAULT_LAYER_PREFERENCES)}
      />

      {splitMode && (
        <div className="absolute left-4 top-4 z-20 w-80 rounded-2xl border border-red-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900">Dividir talhão</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Clique no mapa para desenhar uma linha que atravesse completamente o talhão.
              </p>
            </div>
            <button type="button" onClick={cancelSplitMode} className="rounded-lg px-2 py-1 text-sm font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700">✕</button>
          </div>
          <div className="mt-3 rounded-xl bg-red-50 px-3 py-2">
            <p className="text-sm font-semibold text-red-800">Pontos da linha: {splitPoints.length}</p>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button type="button" onClick={undoSplitPoint} disabled={splitPoints.length === 0} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40">Desfazer</button>
            <button type="button" onClick={clearSplitLine} disabled={splitPoints.length === 0} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40">Limpar</button>
            <button type="button" onClick={finishSplitLine} disabled={splitPoints.length < 2} className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40">Pré-visualizar</button>
          </div>
        </div>
      )}

      {measurementMode && (
        <div className="absolute left-4 top-4 z-10 w-72 rounded-2xl border border-amber-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900">
                {measurementMode === "distance" ? "Medir distância" : "Medir área"}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Clique no mapa para adicionar pontos à medição.
              </p>
            </div>
            <button
              type="button"
              onClick={closeMeasurement}
              className="rounded-lg px-2 py-1 text-sm font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fechar medição"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-amber-50 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Resultado</p>
              <p className="mt-1 text-lg font-bold text-amber-900">{measurementResult}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Pontos</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{measurementPoints.length}</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={undoMeasurementPoint}
              disabled={measurementPoints.length === 0}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Desfazer ponto
            </button>
            <button
              type="button"
              onClick={clearMeasurement}
              disabled={measurementPoints.length === 0}
              className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Limpar
            </button>
          </div>
        </div>
      )}

      {drawingMode && (
        <div className="absolute left-4 top-4 z-10 w-64 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
          <p className="font-bold text-slate-900">
            Desenhar talhão
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Clique no mapa para marcar os limites do terreno.
          </p>

          <div className="mt-3 rounded-xl bg-green-50 px-3 py-2">
            <p className="text-sm font-semibold text-green-800">
              Pontos marcados: {points.length}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={finishDrawing}
              disabled={points.length < 3}
              className="rounded-xl bg-green-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Concluir
            </button>

            <button
              type="button"
              onClick={undoLastPoint}
              disabled={points.length === 0}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Desfazer
            </button>

            <button
              type="button"
              onClick={clearDrawing}
              disabled={points.length === 0}
              className="col-span-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              Limpar desenho
            </button>
          </div>
        </div>
      )}

      {editGeometryMode && (
        <div className="absolute left-4 top-4 z-10 w-72 rounded-2xl border border-blue-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
          <p className="font-bold text-slate-900">Editar limites</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Arraste os pontos azuis. Clique nos pontos brancos para adicionar um vértice. Use o botão direito num ponto azul para removê-lo.
          </p>
        </div>
      )}

      {view3D && (
        <div className="absolute bottom-7 right-4 z-10 rounded-xl bg-slate-950/80 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur">
          🌍 Relevo 3D ativo
        </div>
      )}
    </div>
  );
}