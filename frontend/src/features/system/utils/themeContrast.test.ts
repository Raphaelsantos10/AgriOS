import { describe, expect, it } from "vitest";
import { contrastRatio, passesNormalText, relativeLuminance } from "./themeContrast";

describe("contraste dos temas FARPHA", () => {
  it("mantém texto principal legível no tema claro", () => expect(passesNormalText("#17251c", "#ffffff")).toBe(true));
  it("mantém texto principal legível no tema escuro", () => expect(passesNormalText("#eef7f1", "#101c14")).toBe(true));
  it("calcula limites WCAG e rejeita cores inválidas", () => { expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21); expect(() => relativeLuminance("verde")).toThrow(); });
});
