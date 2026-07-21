import { useEffect, useMemo, useState } from "react";
import type { Farm } from "../../farms/types/farm";
import { fetchWeatherForecast } from "../../weather/services/weatherService";
import type { WeatherDay } from "../../weather/types/weather";
import { formatDashboardDate, greetingForHour, weatherCodeLabel } from "../utils/dailyContext";

export function useDailyOverview(farm?: Farm) {
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<WeatherDay | null>(null);
  const [weatherError, setWeatherError] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 30_000); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    if (!farm) return;
    const controller = new AbortController();
    queueMicrotask(() => { if (!controller.signal.aborted) { setWeatherLoading(true); setWeatherError(""); } });
    void fetchWeatherForecast(Number(farm.latitude), Number(farm.longitude), controller.signal)
      .then((forecast) => setWeather(forecast.days[0] ?? null))
      .catch((error: unknown) => { if (!controller.signal.aborted) setWeatherError(error instanceof Error ? error.message : "Previsão indisponível"); })
      .finally(() => { if (!controller.signal.aborted) setWeatherLoading(false); });
    return () => controller.abort();
  }, [farm]);

  return useMemo(() => ({
    greeting: greetingForHour(now.getHours()),
    date: formatDashboardDate(now),
    time: new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(now),
    weather,
    weatherLabel: weather ? weatherCodeLabel(weather.weatherCode) : "",
    weatherError,
    weatherLoading,
  }), [now, weather, weatherError, weatherLoading]);
}
