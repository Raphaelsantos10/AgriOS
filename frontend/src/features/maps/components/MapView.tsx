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
  onPolygonCreated?: (
    geometry: PolygonGeometry,
    area: number
  ) => void;
}

type MapMode = "map" | "satellite";

export default function MapView({
  farms,
  fields = [],
  drawingMode = false,
  onPolygonCreated,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  /*
   * Mantém o valor atual de drawingMode disponível
   * dentro dos eventos do MapLibre sem recriar o mapa.
   */
  const drawingModeRef = useRef(drawingMode);

  const [points, setPoints] = useState<[number, number][]>([]);
  const [mapMode, setMapMode] = useState<MapMode>("map");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [view3D, setView3D] = useState(false);

  /*
   * Atualiza apenas a referência.
   * Não provoca renderizações adicionais.
   */
  useEffect(() => {
    drawingModeRef.current = drawingMode;
  }, [drawingMode]);

  /*
   * CRIAR MAPA
   */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      center: [-7.9, 39.5],
      zoom: 6,
      pitch: 0,
      bearing: 0,
      maxPitch: 85,

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

    map.on("load", () => {
      /*
       * RELEVO 3D
       */
      if (!map.getSource("terrain-dem")) {
        map.addSource("terrain-dem", {
          type: "raster-dem",
          url: "https://tiles.mapterhorn.com/tilejson.json",
          tileSize: 512,
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
            "hillshade-shadow-color": "#473b24",
            "hillshade-highlight-color": "#ffffff",
            "hillshade-exaggeration": 0.35,
          },
        });
      }

      /*
       * EDIFÍCIOS 3D
       */
      if (!map.getSource("openfreemap-buildings")) {
        map.addSource("openfreemap-buildings", {
          type: "vector",
          url: "https://tiles.openfreemap.org/planet",
        });
      }

      if (!map.getLayer("3d-buildings")) {
        map.addLayer({
          id: "3d-buildings",
          type: "fill-extrusion",
          source: "openfreemap-buildings",
          "source-layer": "building",
          minzoom: 15,

          layout: {
            visibility: "none",
          },

          filter: ["!=", ["get", "hide_3d"], true],

          paint: {
            "fill-extrusion-color": [
              "interpolate",
              ["linear"],
              ["coalesce", ["get", "render_height"], 0],
              0,
              "#d6d3d1",
              50,
              "#a8a29e",
              150,
              "#78716c",
            ],

            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              16,
              [
                "coalesce",
                ["get", "render_height"],
                6,
              ],
            ],

            "fill-extrusion-base": [
              "coalesce",
              ["get", "render_min_height"],
              0,
            ],

            "fill-extrusion-opacity": 0.82,
          },
        });
      }

      /*
       * TALHÕES GUARDADOS
       */
      if (!map.getSource("fields")) {
        map.addSource("fields", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
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
              "#facc15",

              "critical",
              "#ef4444",

              "#16a34a",
            ],

            "fill-opacity": 0.36,
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
              "#ca8a04",

              "critical",
              "#b91c1c",

              "#15803d",
            ],

            "line-width": 3,
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

      /*
       * TALHÃO EM DESENHO
       */
      if (!map.getSource("draft-field")) {
        map.addSource("draft-field", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
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

      /*
       * POPUP DO TALHÃO
       */
      map.on("click", "fields-fill", (event) => {
        if (drawingModeRef.current) {
          return;
        }

        const feature = event.features?.[0];

        if (!feature) {
          return;
        }

        const name =
          feature.properties?.name ?? "Talhão";

        const crop =
          feature.properties?.crop ?? "Sem cultura";

        const area = Number(
          feature.properties?.area ?? 0
        );

        const status =
          feature.properties?.status ?? "healthy";

        const statusLabel =
          status === "healthy"
            ? "Saudável"
            : status === "attention"
              ? "Atenção"
              : "Crítico";

        new maplibregl.Popup({
          closeButton: true,
          offset: 12,
        })
          .setLngLat(event.lngLat)
          .setHTML(`
            <div style="
              min-width: 220px;
              font-family: Arial, Helvetica, sans-serif;
              padding: 4px;
            ">
              <h3 style="
                margin: 0 0 10px;
                color: #166534;
                font-size: 18px;
                font-weight: 700;
              ">
                🌱 ${name}
              </h3>

              <div style="
                border-top: 1px solid #e2e8f0;
                padding-top: 10px;
              ">
                <p style="margin: 6px 0;">
                  🌾 <strong>Cultura:</strong> ${crop}
                </p>

                <p style="margin: 6px 0;">
                  📐 <strong>Área:</strong> ${area.toFixed(2)} ha
                </p>

                <p style="margin: 6px 0;">
                  📊 <strong>Estado:</strong> ${statusLabel}
                </p>
              </div>
            </div>
          `)
          .addTo(map);
      });

      map.on("mouseenter", "fields-fill", () => {
        if (!drawingModeRef.current) {
          map.getCanvas().style.cursor = "pointer";
        }
      });

      map.on("mouseleave", "fields-fill", () => {
        map.getCanvas().style.cursor = drawingModeRef.current
          ? "crosshair"
          : "";
      });

      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => {
        marker.remove();
      });

      markersRef.current = [];

      map.remove();
      mapRef.current = null;
    };
  }, []);

  /*
   * ALTERAR CURSOR NO MODO DESENHO
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) {
      return;
    }

    map.getCanvas().style.cursor = drawingMode
      ? "crosshair"
      : "";
  }, [drawingMode, mapLoaded]);

  /*
   * ALTERAR MAPA / SATÉLITE
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) {
      return;
    }

    if (map.getLayer("osm-layer")) {
      map.setLayoutProperty(
        "osm-layer",
        "visibility",
        mapMode === "map" ? "visible" : "none"
      );
    }

    if (map.getLayer("satellite-layer")) {
      map.setLayoutProperty(
        "satellite-layer",
        "visibility",
        mapMode === "satellite"
          ? "visible"
          : "none"
      );
    }
  }, [mapMode, mapLoaded]);

  /*
   * ATIVAR / DESATIVAR 3D
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) {
      return;
    }

    if (view3D) {
      map.setTerrain({
        source: "terrain-dem",
        exaggeration: 1.25,
      });

      if (map.getLayer("terrain-hillshade")) {
        map.setLayoutProperty(
          "terrain-hillshade",
          "visibility",
          "visible"
        );
      }

      if (map.getLayer("3d-buildings")) {
        map.setLayoutProperty(
          "3d-buildings",
          "visibility",
          "visible"
        );
      }

      map.easeTo({
        pitch: 62,
        bearing: -22,
        duration: 1200,
      });
    } else {
      map.setTerrain(null);

      if (map.getLayer("terrain-hillshade")) {
        map.setLayoutProperty(
          "terrain-hillshade",
          "visibility",
          "none"
        );
      }

      if (map.getLayer("3d-buildings")) {
        map.setLayoutProperty(
          "3d-buildings",
          "visibility",
          "none"
        );
      }

      map.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 900,
      });
    }
  }, [view3D, mapLoaded]);

  /*
   * MARCADORES DAS EXPLORAÇÕES
   */
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
          pitch: view3D ? 62 : 0,
          bearing: view3D ? -22 : 0,
          speed: 1.2,
          curve: 1.3,
        });
      }
    }
  }, [farms, mapLoaded, view3D]);

  /*
   * MOSTRAR TALHÕES GUARDADOS
   */
  useEffect(() => {
    const map = mapRef.current;

    if (
      !map ||
      !mapLoaded ||
      !map.getSource("fields")
    ) {
      return;
    }

    const features: GeoJSON.Feature<
      GeoJSON.Polygon
    >[] = fields
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
          area: Number(field.area),
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

  /*
   * MOSTRAR POLÍGONO EM DESENHO
   */
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

  /*
   * CLIQUES PARA DESENHAR
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !mapLoaded) {
      return;
    }

    function handleMapClick(
      event: maplibregl.MapMouseEvent
    ) {
      if (!drawingModeRef.current) {
        return;
      }

      setPoints((current) => [
        ...current,
        [event.lngLat.lng, event.lngLat.lat],
      ]);
    }

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [mapLoaded]);

  function finishDrawing() {
    if (points.length < 3) {
      alert(
        "Marque pelo menos três pontos no mapa."
      );
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
      alert(
        "Não foi possível calcular a área. Tente desenhar novamente."
      );
      return;
    }

    onPolygonCreated?.(
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

  function centralizeMap() {
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
      pitch: view3D ? 62 : 0,
      bearing: view3D ? -22 : 0,
      duration: 1000,
    });
  }

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className="h-full w-full"
      />

      {/* SELETOR MAPA */}
      <div className="absolute right-14 top-3 z-10 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur">
        <button
          type="button"
          onClick={() => setMapMode("map")}
          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
            mapMode === "map"
              ? "bg-green-700 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          🗺️ Mapa
        </button>

        <button
          type="button"
          onClick={() =>
            setMapMode("satellite")
          }
          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
            mapMode === "satellite"
              ? "bg-green-700 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          🛰️ Satélite
        </button>

        <button
          type="button"
          onClick={() =>
            setView3D((current) => !current)
          }
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
          onClick={centralizeMap}
          className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          title="Centralizar exploração"
        >
          🎯
        </button>
      </div>

      {/* PAINEL DE DESENHO */}
      {drawingMode && (
        <div className="absolute left-4 top-4 z-10 w-64 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
          <p className="font-bold text-slate-900">
            Desenhar talhão
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Clique no mapa para marcar os limites do
            terreno.
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

      {/* INDICADOR 3D */}
      {view3D && (
        <div className="absolute bottom-7 right-4 z-10 rounded-xl bg-slate-950/80 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur">
          🌍 Relevo 3D ativo
        </div>
      )}
    </div>
  );
}