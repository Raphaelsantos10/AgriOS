export type FireRiskLevel = "low" | "moderate" | "high" | "very_high" | "extreme";

export type FireRiskInput = {
  temperatureC: number | null;
  humidityPercent: number | null;
  windSpeedKmh: number | null;
  slopePercent: number | null;
  vegetationDrynessPercent: number | null;
  fuelLoad: "low" | "moderate" | "high" | "very_high";
  nearbyFireDistanceKm: number | null;
  windTowardProperty: boolean;
};

export type FireRiskFactor = {
  label: string;
  score: number;
  explanation: string;
};

export type FireRiskAssessmentResult = {
  score: number;
  level: FireRiskLevel;
  factors: FireRiskFactor[];
  recommendations: string[];
  confidence: number;
};
