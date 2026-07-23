import { describe, expect, it } from "vitest";

import { isCaptureSizeValid, minimumCaptureDimensions } from "./lib/documentation-media-rules.mjs";

describe("dimensões das capturas documentais", () => {
  it("aceita a viewport mobile FARPHA", () => {
    expect(isCaptureSizeValid("public-home-mobile.png", 390, 844)).toBe(true);
    expect(minimumCaptureDimensions("public-home-mobile.png").profile).toBe("mobile");
  });

  it("rejeita uma captura mobile cortada", () => {
    expect(isCaptureSizeValid("public-home-mobile.png", 390, 500)).toBe(false);
  });

  it("mantém o mínimo de desktop", () => {
    expect(isCaptureSizeValid("maturity-diagnostics.png", 1_440, 960)).toBe(true);
    expect(isCaptureSizeValid("maturity-diagnostics.png", 1_062, 97)).toBe(false);
  });
});
