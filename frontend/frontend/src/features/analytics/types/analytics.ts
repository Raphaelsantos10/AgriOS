import type { Farm } from "../../farms/types/farm";
import type { Field, FieldStatus } from "../../fields/types/field";
import type {
  Mission,
  MissionPriority,
  MissionStatus,
} from "../../missions/types/mission";

export interface AnalyticsRawData {
  farms: Farm[];
  fields: Field[];
  missions: Mission[];
}

export interface DistributionItem<T extends string = string> {
  key: T;
  label: string;
  count: number;
  percentage: number;
}

export interface CropDistributionItem {
  crop: string;
  fieldCount: number;
  area: number;
  percentage: number;
}

export interface FarmRankingItem {
  farmId: string;
  farmName: string;
  fieldCount: number;
  area: number;
  missionCount: number;
  completedMissionCount: number;
  healthScore: number;
}

export interface MonthlyActivityItem {
  monthKey: string;
  label: string;
  created: number;
  completed: number;
}

export interface AnalyticsSummary {
  totalFarms: number;
  totalFields: number;
  totalArea: number;
  totalMissions: number;
  activeMissions: number;
  completedMissions: number;
  overdueMissions: number;
  completionRate: number;
  averageFieldHealth: number;
  missionStatus: DistributionItem<MissionStatus>[];
  missionPriority: DistributionItem<MissionPriority>[];
  fieldHealth: DistributionItem<FieldStatus>[];
  cropDistribution: CropDistributionItem[];
  farmRanking: FarmRankingItem[];
  monthlyActivity: MonthlyActivityItem[];
}
