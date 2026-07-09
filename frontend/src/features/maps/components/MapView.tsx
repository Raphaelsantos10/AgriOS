import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { Farm } from "../../farms/types/farm";

import "maplibre-gl/dist/maplibre-gl.css";

interface Props {
  farms: Farm[];
}

export default function MapView({ farms }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Inicializa o mapa apenas uma vez
  useEffect(() => {
    if (!container.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: container.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-7.9, 39.5], // Portugal
      zoom: 6,
    });

    map.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Atualiza marcadores sempre que as explorações mudam
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove marcadores antigos
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    farms.forEach((farm) => {
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
      }).setHTML(`
        <div style="
          min-width:240px;
          font-family:Arial,Helvetica,sans-serif;
        ">

          <h2 style="
            margin:0;
            color:#166534;
            font-size:20px;
            font-weight:bold;
          ">
            🌾 ${farm.name}
          </h2>

          <hr style="margin:10px 0">

          <p style="margin:6px 0;">
            👤 <strong>Proprietário</strong><br>
            ${farm.owner}
          </p>

          <p style="margin:6px 0;">
            🌱 <strong>Cultura</strong><br>
            ${farm.crop}
          </p>

          <p style="margin:6px 0;">
            📐 <strong>Área</strong><br>
            ${farm.area} ha
          </p>

          <p style="margin:6px 0;">
            📍 <strong>Coordenadas</strong><br>
            ${farm.latitude.toFixed(5)},
            ${farm.longitude.toFixed(5)}
          </p>

          <button
            style="
              margin-top:14px;
              width:100%;
              background:#16a34a;
              color:white;
              border:none;
              border-radius:10px;
              padding:12px;
              cursor:pointer;
              font-size:15px;
              font-weight:bold;
            "
          >
            🌾 Abrir Exploração
          </button>

        </div>
      `);

      const marker = new maplibregl.Marker({
        color: "#16a34a",
      })
        .setLngLat([
          farm.longitude,
          farm.latitude,
        ])
        .setPopup(popup)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });

    // Centraliza no último marcador criado
    if (farms.length > 0) {
      const lastFarm = farms[farms.length - 1];

      mapRef.current.flyTo({
        center: [
          lastFarm.longitude,
          lastFarm.latitude,
        ],
        zoom: 13,
        speed: 1.4,
        curve: 1.3,
      });
    }
  }, [farms]);

  return (
    <div
      ref={container}
      className="h-full w-full"
    />
  );
}