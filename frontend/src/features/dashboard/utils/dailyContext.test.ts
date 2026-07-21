import { describe, expect, it } from "vitest";
import { formatDashboardDate, greetingForHour, weatherCodeLabel } from "./dailyContext";

describe("contexto diário do painel", () => {
  it("adapta a saudação à manhã, tarde e noite", () => { expect(greetingForHour(8)).toBe("Bom dia"); expect(greetingForHour(15)).toBe("Boa tarde"); expect(greetingForHour(22)).toBe("Boa noite"); });
  it("traduz os códigos meteorológicos principais", () => { expect(weatherCodeLabel(0)).toBe("Céu limpo"); expect(weatherCodeLabel(61)).toBe("Chuva"); expect(weatherCodeLabel(95)).toBe("Trovoada"); });
  it("formata a data em português e rejeita horas inválidas", () => { expect(formatDashboardDate(new Date("2026-07-21T12:00:00Z"))).toContain("2026"); expect(() => greetingForHour(24)).toThrow(); });
});
