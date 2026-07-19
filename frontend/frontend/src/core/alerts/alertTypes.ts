export type AlertSeverity = "critical" | "warning" | "info" | "success";
export type AlertSource = "satellite" | "irrigation" | "weather" | "sensor" | "work-order" | "fire" | "ai";

export type UnifiedAlert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  source: AlertSource;
  field?: string;
  farm?: string;
  createdAt: string;
  actionLabel?: string;
  actionPath?: string;
};

export type OperationTimelineEvent = {
  id: string;
  title: string;
  description: string;
  source: AlertSource;
  status: "completed" | "running" | "scheduled" | "attention";
  occurredAt: string;
};

export type FarmHealthScore = {
  total: number;
  vegetation: number;
  water: number;
  operations: number;
  risk: number;
  trend: number;
};
