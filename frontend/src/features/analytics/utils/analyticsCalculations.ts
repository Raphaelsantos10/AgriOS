import type { FieldStatus } from "../../fields/types/field";
import type { MissionPriority, MissionStatus } from "../../missions/types/mission";
import type {
  AnalyticsRawData,
  AnalyticsSummary,
  DistributionItem,
  MonthlyActivityItem,
} from "../types/analytics";

const statusLabels: Record<MissionStatus, string> = {
  new: "Novas",
  in_progress: "Em andamento",
  paused: "Pausadas",
  completed: "Concluídas",
  cancelled: "Canceladas",
};

const priorityLabels: Record<MissionPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
};

const fieldStatusLabels: Record<FieldStatus, string> = {
  healthy: "Saudáveis",
  attention: "Atenção",
  critical: "Críticos",
};

function distribution<T extends string>(
  keys: readonly T[],
  values: T[],
  labels: Record<T, string>,
): DistributionItem<T>[] {
  const total = values.length;
  return keys.map((key) => {
    const count = values.filter((value) => value === key).length;
    return {
      key,
      label: labels[key],
      count,
      percentage: total === 0 ? 0 : (count / total) * 100,
    };
  });
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildMonthlyActivity(raw: AnalyticsRawData): MonthlyActivityItem[] {
  const formatter = new Intl.DateTimeFormat("pt-PT", {
    month: "short",
    year: "2-digit",
  });

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));

    const monthKey = getMonthKey(date);
    const created = raw.missions.filter((mission) => {
      const missionDate = new Date(mission.created_at);
      return getMonthKey(missionDate) === monthKey;
    }).length;
    const completed = raw.missions.filter((mission) => {
      if (!mission.completed_at) return false;
      return getMonthKey(new Date(mission.completed_at)) === monthKey;
    }).length;

    return {
      monthKey,
      label: formatter.format(date).replace(".", ""),
      created,
      completed,
    };
  });
}

export function calculateAnalytics(raw: AnalyticsRawData): AnalyticsSummary {
  const totalArea = raw.fields.reduce((sum, field) => sum + Number(field.area || 0), 0);
  const completedMissions = raw.missions.filter(
    (mission) => mission.status === "completed",
  ).length;
  const activeMissions = raw.missions.filter((mission) =>
    ["new", "in_progress", "paused"].includes(mission.status),
  ).length;
  const now = Date.now();
  const overdueMissions = raw.missions.filter((mission) => {
    if (!mission.end_date || ["completed", "cancelled"].includes(mission.status)) {
      return false;
    }
    return new Date(mission.end_date).getTime() < now;
  }).length;

  const statusWeight: Record<FieldStatus, number> = {
    healthy: 100,
    attention: 60,
    critical: 20,
  };
  const averageFieldHealth =
    raw.fields.length === 0
      ? 0
      : raw.fields.reduce((sum, field) => sum + statusWeight[field.status], 0) /
        raw.fields.length;

  const cropMap = new Map<string, { fieldCount: number; area: number }>();
  raw.fields.forEach((field) => {
    const crop = field.crop?.trim() || "Sem cultura";
    const current = cropMap.get(crop) ?? { fieldCount: 0, area: 0 };
    cropMap.set(crop, {
      fieldCount: current.fieldCount + 1,
      area: current.area + Number(field.area || 0),
    });
  });
  const cropDistribution = Array.from(cropMap.entries())
    .map(([crop, value]) => ({
      crop,
      ...value,
      percentage: totalArea === 0 ? 0 : (value.area / totalArea) * 100,
    }))
    .sort((a, b) => b.area - a.area);

  const farmRanking = raw.farms
    .map((farm) => {
      const farmFields = raw.fields.filter((field) => field.farm_id === farm.id);
      const farmMissions = raw.missions.filter((mission) => mission.farm_id === farm.id);
      const healthScore =
        farmFields.length === 0
          ? 0
          : farmFields.reduce((sum, field) => sum + statusWeight[field.status], 0) /
            farmFields.length;

      return {
        farmId: farm.id,
        farmName: farm.name,
        fieldCount: farmFields.length,
        area: farmFields.reduce((sum, field) => sum + Number(field.area || 0), 0),
        missionCount: farmMissions.length,
        completedMissionCount: farmMissions.filter(
          (mission) => mission.status === "completed",
        ).length,
        healthScore,
      };
    })
    .sort((a, b) => b.area - a.area);

  return {
    totalFarms: raw.farms.length,
    totalFields: raw.fields.length,
    totalArea,
    totalMissions: raw.missions.length,
    activeMissions,
    completedMissions,
    overdueMissions,
    completionRate:
      raw.missions.length === 0 ? 0 : (completedMissions / raw.missions.length) * 100,
    averageFieldHealth,
    missionStatus: distribution(
      ["new", "in_progress", "paused", "completed", "cancelled"] as const,
      raw.missions.map((mission) => mission.status),
      statusLabels,
    ),
    missionPriority: distribution(
      ["low", "medium", "high", "critical"] as const,
      raw.missions.map((mission) => mission.priority),
      priorityLabels,
    ),
    fieldHealth: distribution(
      ["healthy", "attention", "critical"] as const,
      raw.fields.map((field) => field.status),
      fieldStatusLabels,
    ),
    cropDistribution,
    farmRanking,
    monthlyActivity: buildMonthlyActivity(raw),
  };
}
