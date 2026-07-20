export type WeatherDay = { date: string; weatherCode: number; temperatureMax: number; temperatureMin: number; precipitationMm: number; precipitationProbability: number; windGustKmh: number; evapotranspirationMm: number };
export type WeatherForecast = { latitude: number; longitude: number; timezone: string; generatedAt: string; days: WeatherDay[]; source: "Open-Meteo" };
export type WeatherAlertSeverity = "critical" | "warning" | "info";
export type WeatherAlert = { id: string; date: string; severity: WeatherAlertSeverity; title: string; recommendation: string };
