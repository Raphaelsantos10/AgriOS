import type { FieldEnvironmentInput } from "../types/environment";

export function calculateEnvironmentConfidence(profile: FieldEnvironmentInput) {
  const measurableValues = [
    profile.altitude_m,
    profile.slope_percent,
    profile.soil_ph,
    profile.organic_matter_percent,
    profile.annual_rainfall_mm,
    profile.average_humidity_percent,
    profile.min_temperature_c,
    profile.max_temperature_c,
    profile.chill_hours,
  ];

  const completedMeasurements = measurableValues.filter(
    (value) => value !== null && Number.isFinite(value),
  ).length;

  const categoricalValues = [
    profile.exposure,
    profile.soil_texture,
    profile.drainage,
    profile.frost_risk,
    profile.fire_risk,
    profile.wind_exposure,
  ];

  const completedCategories = categoricalValues.filter(
    (value) => value !== "unknown",
  ).length;

  const irrigationBonus = profile.water_available ? 8 : 0;
  const notesBonus = profile.notes.trim().length >= 20 ? 4 : 0;
  const total = completedMeasurements * 5 + completedCategories * 6 + irrigationBonus + notesBonus;

  return Math.max(5, Math.min(100, total));
}

export function getEnvironmentReadiness(profile: FieldEnvironmentInput) {
  const confidence = calculateEnvironmentConfidence(profile);
  if (confidence >= 80) return "Perfil robusto para análises de aptidão";
  if (confidence >= 55) return "Perfil suficiente para uma estimativa preliminar";
  return "Adicione dados de solo e clima para aumentar a confiança";
}
