import { describe, expect, it } from "vitest";
import { canOfferInstall, getPwaCapability, offlineAvailabilityMessage } from "./pwa";
describe("PWA capability", () => {
  it("reconhece execução instalada em diferentes plataformas", () => { expect(getPwaCapability({ hasServiceWorker: true, displayModeStandalone: true, online: true }).standalone).toBe(true); expect(getPwaCapability({ hasServiceWorker: true, displayModeStandalone: false, navigatorStandalone: true, online: true }).standalone).toBe(true); });
  it("só oferece instalação quando existe prompt e não está instalada", () => { expect(canOfferInstall({ serviceWorker: true, standalone: false, online: true }, true)).toBe(true); expect(canOfferInstall({ serviceWorker: true, standalone: true, online: true }, true)).toBe(false); });
  it("explica corretamente o alcance do modo offline", () => { expect(offlineAvailabilityMessage({ serviceWorker: true, standalone: false, online: false })).toContain("páginas já visitadas"); expect(offlineAvailabilityMessage({ serviceWorker: false, standalone: false, online: false })).toContain("não suporta"); });
});
