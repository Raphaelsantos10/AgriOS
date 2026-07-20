import type { WeatherForecast } from "../types/weather";
export type CachedWeatherForecast = { forecast: WeatherForecast; locationLabel: string; farmId: string; savedAt: string };
const STORAGE_KEY = "farpha.weather.latest.v1";
export function readWeatherCache(): CachedWeatherForecast | null { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return null; try { return JSON.parse(raw) as CachedWeatherForecast; } catch { localStorage.removeItem(STORAGE_KEY); return null; } }
export function saveWeatherCache(forecast: WeatherForecast, locationLabel: string, farmId: string) { const cached = { forecast, locationLabel, farmId, savedAt: new Date().toISOString() }; localStorage.setItem(STORAGE_KEY, JSON.stringify(cached)); return cached; }
