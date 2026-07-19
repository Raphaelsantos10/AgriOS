export type IrrigationMethod =
  | "drip"
  | "sprinkler"
  | "micro_sprinkler"
  | "pivot"
  | "furrow"
  | "manual"
  | "other";

export type WaterSourceType =
  | "well"
  | "spring"
  | "reservoir"
  | "pond"
  | "network"
  | "river"
  | "other";

export type IrrigationPriority = "low" | "moderate" | "high" | "critical";

export interface IrrigationSystem {
  id: string;
  field_id: string;
  farm_id: string;
  name: string;
  method: IrrigationMethod;
  water_source: WaterSourceType;
  flow_l_min: number | null;
  pressure_bar: number | null;
  reservoir_capacity_m3: number | null;
  reservoir_level_percent: number | null;
  efficiency_percent: number;
  active: boolean;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export type IrrigationSystemInput = Omit<
  IrrigationSystem,
  "id" | "created_at" | "updated_at"
>;

export interface IrrigationEvent {
  id: string;
  system_id: string;
  field_id: string;
  farm_id: string;
  started_at: string;
  duration_minutes: number;
  volume_m3: number;
  source: "manual" | "scheduled" | "recommendation";
  notes: string;
  created_at?: string;
}

export type IrrigationEventInput = Omit<IrrigationEvent, "id" | "created_at">;

export interface IrrigationRecommendation {
  priority: IrrigationPriority;
  needsIrrigation: boolean;
  recommendedMinutes: number;
  estimatedVolumeM3: number;
  estimatedWaterNeedMm: number;
  bestWindow: string;
  confidence: number;
  reasons: string[];
  warnings: string[];
}
