import type { WeatherForecast } from "../types/weather";

type OpenMeteoResponse = { latitude: number; longitude: number; timezone: string; daily?: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_sum: number[]; precipitation_probability_max: number[]; wind_gusts_10m_max: number[]; et0_fao_evapotranspiration: number[] } };

export async function fetchWeatherForecast(latitude: number, longitude: number, signal?: AbortSignal): Promise<WeatherForecast> {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) throw new Error("Coordenadas inválidas.");
  const daily = "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_gusts_10m_max,et0_fao_evapotranspiration";
  const url = new URL("https://api.open-meteo.com/v1/forecast"); url.search = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), daily, timezone: "auto", forecast_days: "7" }).toString();
  const response = await fetch(url, { signal }); if (!response.ok) throw new Error(`Serviço meteorológico indisponível (${response.status}).`); const data = await response.json() as OpenMeteoResponse; if (!data.daily?.time?.length) throw new Error("A previsão não devolveu dados diários.");
  return { latitude: data.latitude, longitude: data.longitude, timezone: data.timezone, generatedAt: new Date().toISOString(), source: "Open-Meteo", days: data.daily.time.map((date, index) => ({ date, weatherCode: data.daily!.weather_code[index] ?? 0, temperatureMax: data.daily!.temperature_2m_max[index] ?? 0, temperatureMin: data.daily!.temperature_2m_min[index] ?? 0, precipitationMm: data.daily!.precipitation_sum[index] ?? 0, precipitationProbability: data.daily!.precipitation_probability_max[index] ?? 0, windGustKmh: data.daily!.wind_gusts_10m_max[index] ?? 0, evapotranspirationMm: data.daily!.et0_fao_evapotranspiration[index] ?? 0 })) };
}
