import type { FireRiskLevel } from "../../../engines/fire/types";

export interface FireRiskAssessment {
  id: string;
  field_id: string;
  farm_id: string;
  temperature_c: number | null;
  humidity_percent: number | null;
  wind_speed_kmh: number | null;
  vegetation_dryness_percent: number | null;
  fuel_load: "low" | "moderate" | "high" | "very_high";
  nearby_fire_distance_km: number | null;
  wind_toward_property: boolean;
  risk_score: number;
  risk_level: FireRiskLevel;
  confidence: number;
  notes: string;
  created_at?: string;
}

export type FireRiskAssessmentInput = Omit<FireRiskAssessment, "id" | "created_at">;
