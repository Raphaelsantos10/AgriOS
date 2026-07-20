import { describe, expect, it } from "vitest";
import { buildIcnfWmsUrl, icnfLayers, imageCoordinates } from "./icnfWms";
const bounds = { west: -9.5, south: 37, east: -6.2, north: 42.1 };
describe("ICNF WMS", () => {
  it("define apenas endpoints HTTPS e nomes de camadas confirmados", () => { expect(icnfLayers).toHaveLength(4); expect(icnfLayers.every((item) => item.endpoint.startsWith("https://si.icnf.pt/wms/") && item.layerName.startsWith("BDG:"))).toBe(true); });
  it("constrói GetMap transparente em EPSG:4326", () => { const url = new URL(buildIcnfWmsUrl(icnfLayers[0], bounds)); expect(url.searchParams.get("request")).toBe("GetMap"); expect(url.searchParams.get("srs")).toBe("EPSG:4326"); expect(url.searchParams.get("bbox")).toBe("-9.500000,37.000000,-6.200000,42.100000"); expect(url.searchParams.get("transparent")).toBe("true"); });
  it("ordena os cantos como exige uma fonte image do MapLibre", () => { expect(imageCoordinates(bounds)).toEqual([[-9.5, 42.1], [-6.2, 42.1], [-6.2, 37], [-9.5, 37]]); });
});
