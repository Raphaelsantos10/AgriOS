import { describe, expect, it } from "vitest";
import type { WeatherDay } from "../types/weather";
import { buildWeatherAlerts, buildWeatherCsv, weatherCodeLabel } from "./weatherAlerts";
const base = { date: "2026-07-21", weatherCode: 0, temperatureMax: 25, temperatureMin: 12, precipitationMm: 0, precipitationProbability: 10, windGustKmh: 20, evapotranspirationMm: 2 };
describe("weather alerts", () => {
  it("deteta geada, chuva forte, vento e calor com gravidade", () => { const days = [{ ...base, temperatureMin: -1, temperatureMax: 41, precipitationMm: 55, windGustKmh: 95 }] as WeatherDay[]; const alerts = buildWeatherAlerts(days); expect(alerts).toHaveLength(4); expect(alerts.every((alert) => alert.severity === "critical")).toBe(true); });
  it("sinaliza procura hídrica sem afirmar necessidade automática de rega", () => { const alerts = buildWeatherAlerts([{ ...base, evapotranspirationMm: 5, precipitationMm: 0.2 }]); expect(alerts[0]).toMatchObject({ severity: "info" }); expect(alerts[0].recommendation).toContain("humidade do solo"); });
  it("traduz o código meteorológico e exporta fonte e localização", () => { expect(weatherCodeLabel(80)).toBe("Aguaceiros"); const csv = buildWeatherCsv([base], "Quinta Norte", "2026-07-20"); expect(csv).toContain('"Quinta Norte"'); expect(csv).toContain('"Open-Meteo"'); });
});
