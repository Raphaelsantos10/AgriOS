import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

interface Props {
  latitude: number;
  longitude: number;
  onLocationChange: (
    latitude: number,
    longitude: number
  ) => void;
}

type MapMode = "map" | "satellite";

export default function LocationPickerMap({
  latitude,
  longitude,
  onLocationChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  /*
   * Guarda apenas as coordenadas recebidas
   * quando o componente é criado.
   */
  const initialLocationRef = useRef({
    latitude: Number(latitude),
    longitude: Number(longitude),
  });

  /*
   * Mantém sempre a versão atual da função
   * sem recriar o mapa.
   */
  const onLocationChangeRef = useRef(onLocationChange);

  const [mapMode, setMapMode] =
    useState<MapMode>("satellite");

  const [mapLoaded, setMapLoaded] =
    useState(false);

  /*
   * Atualiza a referência da função.
   */
  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  /*
   * CRIAR MAPA UMA ÚNICA VEZ
   */
  useEffect(() => {
    if (
      !containerRef.current ||
      mapRef.current
    ) {
      return;
    }

    const initialLatitude =
      initialLocationRef.current.latitude;

    const initialLongitude =
      initialLocationRef.current.longitude;

    const safeLatitude = Number.isFinite(initialLatitude)
      ? initialLatitude
      : 41.1496;

    const safeLongitude = Number.isFinite(initialLongitude)
      ? initialLongitude
      : -8.6109;

    const map = new maplibregl.Map({
      container: containerRef.current,

      center: [
        safeLongitude,
        safeLatitude,
      ],

      zoom: 17,

      style: {
        version: 8,

        sources: {
          osm: {
            type: "raster",

            tiles: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],

            tileSize: 256,

            attribution:
              "© OpenStreetMap contributors",
          },

          satellite: {
            type: "raster",

            tiles: [
              "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],

            tileSize: 256,

            attribution: "© Esri",
          },
        },

        layers: [
          {
            id: "osm-layer",
            type: "raster",
            source: "osm",

            layout: {
              visibility: "none",
            },
          },

          {
            id: "satellite-layer",
            type: "raster",
            source: "satellite",

            layout: {
              visibility: "visible",
            },
          },
        ],
      },
    });

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
      }),
      "top-right"
    );

    const marker = new maplibregl.Marker({
      color: "#15803d",
      draggable: true,
    })
      .setLngLat([
        safeLongitude,
        safeLatitude,
      ])
      .addTo(map);

    marker.on("dragend", () => {
      const position = marker.getLngLat();

      onLocationChangeRef.current(
        position.lat,
        position.lng
      );
    });

    map.on("click", (event) => {
      marker.setLngLat(event.lngLat);

      onLocationChangeRef.current(
        event.lngLat.lat,
        event.lngLat.lng
      );
    });

    map.on("load", () => {
      setMapLoaded(true);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      marker.remove();
      map.remove();

      markerRef.current = null;
      mapRef.current = null;
    };
  }, []);

  /*
   * ATUALIZAR MARCADOR QUANDO AS
   * COORDENADAS DO FORMULÁRIO MUDAREM
   */
  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;

    if (
      !map ||
      !marker ||
      !mapLoaded
    ) {
      return;
    }

    const newLatitude = Number(latitude);
    const newLongitude = Number(longitude);

    if (
      !Number.isFinite(newLatitude) ||
      !Number.isFinite(newLongitude)
    ) {
      return;
    }

    marker.setLngLat([
      newLongitude,
      newLatitude,
    ]);

    map.easeTo({
      center: [
        newLongitude,
        newLatitude,
      ],

      zoom: Math.max(
        map.getZoom(),
        17
      ),

      duration: 700,
    });
  }, [latitude, longitude, mapLoaded]);

  /*
   * ALTERNAR MAPA / SATÉLITE
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
        mapMode === "map"
          ? "visible"
          : "none"
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

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200">
      <div
        ref={containerRef}
        className="h-72 w-full"
      />

      <div className="absolute left-3 top-3 z-10 flex rounded-xl bg-white p-1 shadow-lg">
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
          onClick={() => setMapMode("satellite")}
          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
            mapMode === "satellite"
              ? "bg-green-700 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          🛰️ Satélite
        </button>
      </div>

      <div className="absolute bottom-3 left-3 right-3 z-10 rounded-xl bg-white/95 px-4 py-3 text-center text-xs font-medium text-slate-700 shadow-lg backdrop-blur">
        Clique no mapa ou arraste o marcador verde para ajustar a localização.
      </div>
    </div>
  );
}