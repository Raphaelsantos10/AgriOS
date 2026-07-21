import { describe, expect, it } from "vitest";
import { contrastRatio } from "../../features/system/utils/themeContrast";
import { breakpoints, colors, layers, motion, spacing, typography } from "./index";

describe("fundação do Design System FARPHA", () => {
  it("mantém escalas cromáticas completas e ordenadas", () => {
    expect(Object.keys(colors.brand).map(Number)).toEqual([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]);
    for (const scale of Object.values(colors.semantic)) {
      expect(Object.keys(scale).map(Number)).toEqual([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]);
    }
  });

  it("garante contraste AA dos pares semânticos destinados a texto", () => {
    for (const scale of Object.values(colors.semantic)) {
      expect(contrastRatio(scale[700], scale[50])).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrastRatio(colors.brand[700], colors.brand[50])).toBeGreaterThanOrEqual(4.5);
  });

  it("mantém espaçamento em múltiplos de quatro píxeis", () => {
    for (const value of Object.values(spacing)) {
      const pixels = Number.parseFloat(value) * 16;
      expect(pixels % 4).toBe(0);
    }
  });

  it("expõe contratos de tipografia, movimento, breakpoints e camadas", () => {
    expect(typography.size.h1).toBe("2.5rem");
    expect(motion.duration.base).toBe("220ms");
    expect(Object.values(breakpoints)).toEqual([...Object.values(breakpoints)].sort((a, b) => a - b));
    expect(layers.assistant).toBeGreaterThan(layers.modal);
  });
});
