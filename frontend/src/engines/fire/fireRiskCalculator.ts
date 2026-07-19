import type {
  FireRiskAssessmentResult,
  FireRiskFactor,
  FireRiskInput,
  FireRiskLevel,
} from "./types";

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function scoreTemperature(value: number | null) {
  if (value === null) return 0;
  if (value >= 40) return 100;
  if (value >= 35) return 82;
  if (value >= 30) return 62;
  if (value >= 25) return 38;
  return 15;
}

function scoreHumidity(value: number | null) {
  if (value === null) return 0;
  if (value <= 15) return 100;
  if (value <= 25) return 82;
  if (value <= 35) return 62;
  if (value <= 50) return 38;
  return 12;
}

function scoreWind(value: number | null) {
  if (value === null) return 0;
  if (value >= 50) return 100;
  if (value >= 35) return 82;
  if (value >= 20) return 58;
  if (value >= 10) return 32;
  return 10;
}

function scoreSlope(value: number | null) {
  if (value === null) return 0;
  if (value >= 35) return 90;
  if (value >= 20) return 65;
  if (value >= 10) return 38;
  return 12;
}

function scoreFuelLoad(value: FireRiskInput["fuelLoad"]) {
  return { low: 18, moderate: 45, high: 72, very_high: 95 }[value];
}

function levelFromScore(score: number): FireRiskLevel {
  if (score >= 86) return "extreme";
  if (score >= 71) return "very_high";
  if (score >= 51) return "high";
  if (score >= 31) return "moderate";
  return "low";
}

export function calculateFireRisk(input: FireRiskInput): FireRiskAssessmentResult {
  const factors: FireRiskFactor[] = [];
  const weighted: Array<{ score: number; weight: number }> = [];

  const add = (label: string, score: number, weight: number, explanation: string) => {
    factors.push({ label, score, explanation });
    weighted.push({ score, weight });
  };

  if (input.temperatureC !== null) {
    add("Temperatura", scoreTemperature(input.temperatureC), 0.18, `${input.temperatureC.toFixed(1)} °C registados.`);
  }
  if (input.humidityPercent !== null) {
    add("Humidade", scoreHumidity(input.humidityPercent), 0.2, `${input.humidityPercent.toFixed(0)}% de humidade relativa.`);
  }
  if (input.windSpeedKmh !== null) {
    add("Vento", scoreWind(input.windSpeedKmh), 0.2, `${input.windSpeedKmh.toFixed(0)} km/h de velocidade do vento.`);
  }
  if (input.slopePercent !== null) {
    add("Declive", scoreSlope(input.slopePercent), 0.08, `${input.slopePercent.toFixed(0)}% de declive médio.`);
  }
  if (input.vegetationDrynessPercent !== null) {
    add("Secura da vegetação", clamp(input.vegetationDrynessPercent), 0.18, `${input.vegetationDrynessPercent.toFixed(0)}% de secura estimada.`);
  }

  add("Carga combustível", scoreFuelLoad(input.fuelLoad), 0.16, `Carga vegetal classificada como ${input.fuelLoad.replace("_", " ")}.`);

  const baseWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  let score = baseWeight
    ? weighted.reduce((sum, item) => sum + item.score * item.weight, 0) / baseWeight
    : 0;

  if (input.nearbyFireDistanceKm !== null) {
    const proximityBoost = input.nearbyFireDistanceKm <= 2 ? 30 : input.nearbyFireDistanceKm <= 5 ? 22 : input.nearbyFireDistanceKm <= 10 ? 12 : 4;
    score += proximityBoost;
    factors.push({
      label: "Incêndio próximo",
      score: clamp(proximityBoost * 3),
      explanation: `Ocorrência indicada a ${input.nearbyFireDistanceKm.toFixed(1)} km.`,
    });
  }

  if (input.windTowardProperty) {
    score += 12;
    factors.push({
      label: "Direção do vento",
      score: 90,
      explanation: "O vento foi indicado como favorável à aproximação do fogo.",
    });
  }

  score = Math.round(clamp(score));
  const level = levelFromScore(score);
  const recommendations = [
    "Manter acessos e pontos de água desobstruídos.",
    "Evitar operações que produzam chama, faíscas ou calor nas horas críticas.",
  ];

  if (level === "high" || level === "very_high" || level === "extreme") {
    recommendations.push("Confirmar o nível dos reservatórios e a disponibilidade das bombas.");
    recommendations.push("Rever faixas de gestão de combustível e contactos de emergência.");
  }
  if (input.nearbyFireDistanceKm !== null && input.nearbyFireDistanceKm <= 10) {
    recommendations.unshift("Acompanhar exclusivamente as instruções oficiais da Proteção Civil.");
  }

  const knownValues = [
    input.temperatureC,
    input.humidityPercent,
    input.windSpeedKmh,
    input.slopePercent,
    input.vegetationDrynessPercent,
  ].filter((value) => value !== null).length;
  const confidence = Math.min(95, 35 + knownValues * 10 + (input.nearbyFireDistanceKm !== null ? 5 : 0));

  return { score, level, factors, recommendations, confidence };
}
