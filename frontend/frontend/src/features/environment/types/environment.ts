export type SoilTexture =
  | "sandy"
  | "loamy_sand"
  | "loam"
  | "silt_loam"
  | "clay_loam"
  | "clay"
  | "unknown";

export type DrainageLevel = "poor" | "moderate" | "good" | "excellent" | "unknown";
export type ExposureDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW" | "flat" | "unknown";
export type RiskLevel = "low" | "moderate" | "high" | "very_high" | "unknown";
export type IrrigationType = "none" | "drip" | "sprinkler" | "pivot" | "furrow" | "manual" | "other";

export interface FieldEnvironmentProfile {
  id: string;
  field_id: string;
  farm_id: string;
  altitude_m: number | null;
  slope_percent: number | null;
  exposure: ExposureDirection;
  soil_texture: SoilTexture;
  soil_ph: number | null;
  organic_matter_percent: number | null;
  drainage: DrainageLevel;
  water_available: boolean;
  irrigation_type: IrrigationType;
  annual_rainfall_mm: number | null;
  average_humidity_percent: number | null;
  min_temperature_c: number | null;
  max_temperature_c: number | null;
  chill_hours: number | null;
  frost_risk: RiskLevel;
  fire_risk: RiskLevel;
  wind_exposure: RiskLevel;
  data_confidence: number;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export type FieldEnvironmentInput = Omit<FieldEnvironmentProfile, "id" | "created_at" | "updated_at">;
