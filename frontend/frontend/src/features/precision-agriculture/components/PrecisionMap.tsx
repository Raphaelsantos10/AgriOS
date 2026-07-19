import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { PrecisionLayer } from "../types/precision";
import "maplibre-gl/dist/maplibre-gl.css";

const ndviGeoJson: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { ndvi: 0.72 }, geometry: { type: "Polygon", coordinates: [[[-7.335,41.635],[-7.320,41.635],[-7.320,41.645],[-7.335,41.645],[-7.335,41.635]]] } },
    { type: "Feature", properties: { ndvi: 0.51 }, geometry: { type: "Polygon", coordinates: [[[-7.320,41.635],[-7.305,41.635],[-7.305,41.645],[-7.320,41.645],[-7.320,41.635]]] } },
    { type: "Feature", properties: { ndvi: 0.31 }, geometry: { type: "Polygon", coordinates: [[[-7.335,41.645],[-7.320,41.645],[-7.320,41.655],[-7.335,41.655],[-7.335,41.645]]] } },
    { type: "Feature", properties: { ndvi: 0.14 }, geometry: { type: "Polygon", coordinates: [[[-7.320,41.645],[-7.305,41.645],[-7.305,41.655],[-7.320,41.655],[-7.320,41.645]]] } },
  ],
};

export default function PrecisionMap({ layers }: { layers: PrecisionLayer[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      center: [-7.32, 41.645],
      zoom: 13.6,
      style: {
        version: 8,
        sources: {
          satellite: {
            type: "raster",
            tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
            tileSize: 256,
            attribution: "© Esri",
          },
        },
        layers: [{ id: "satellite", type: "raster", source: "satellite" }],
      },
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    map.on("load", () => {
      map.addSource("precision-zones", { type: "geojson", data: ndviGeoJson });
      map.addLayer({
        id: "ndvi-fill",
        type: "fill",
        source: "precision-zones",
        paint: {
          "fill-color": ["interpolate", ["linear"], ["get", "ndvi"], 0.2, "#b45309", 0.4, "#facc15", 0.6, "#84cc16", 0.8, "#15803d"],
          "fill-opacity": 0.62,
        },
      });
      map.addLayer({ id: "parcel-lines", type: "line", source: "precision-zones", paint: { "line-color": "#ffffff", "line-width": 2 } });
    });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    const ndvi = layers.find((layer) => layer.id === "ndvi");
    const parcels = layers.find((layer) => layer.id === "parcels");
    if (map.getLayer("ndvi-fill") && ndvi) {
      map.setLayoutProperty("ndvi-fill", "visibility", ndvi.enabled ? "visible" : "none");
      map.setPaintProperty("ndvi-fill", "fill-opacity", ndvi.opacity);
    }
    if (map.getLayer("parcel-lines") && parcels) {
      map.setLayoutProperty("parcel-lines", "visibility", parcels.enabled ? "visible" : "none");
      map.setPaintProperty("parcel-lines", "line-opacity", parcels.opacity);
    }
  }, [layers]);

  return <div ref={containerRef} className="h-[520px] min-h-[420px] w-full overflow-hidden rounded-2xl" />;
}
