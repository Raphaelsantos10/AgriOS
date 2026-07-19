export type AutomationStatus = "active" | "paused" | "draft";
export type TriggerType = "sensor" | "weather" | "satellite" | "schedule" | "work-order";
export type ActionType = "create-work-order" | "notify" | "irrigate" | "log";

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  status: AutomationStatus;
  triggerType: TriggerType;
  metric: string;
  operator: "<" | ">" | "=" | "<=" | ">=";
  threshold: number;
  unit: string;
  actionType: ActionType;
  actionLabel: string;
  fieldName: string;
  lastRunAt?: string;
  runCount: number;
  createdAt: string;
}

export interface AutomationRun {
  id: string;
  ruleId: string;
  ruleName: string;
  status: "success" | "skipped" | "failed";
  message: string;
  executedAt: string;
}
