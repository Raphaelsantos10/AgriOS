import type { UnifiedAlert } from "../../../core/alerts";

export function unreadAlerts(alerts: UnifiedAlert[], readIds: string[]) {
  const read = new Set(readIds);
  return alerts.filter((alert) => !read.has(alert.id));
}

export function markAlertRead(readIds: string[], alertId: string) {
  return Array.from(new Set([...readIds, alertId]));
}

export function resolveAlertPath(alert: UnifiedAlert) {
  if (alert.actionPath) return alert.actionPath;
  if (alert.source === "weather") return "/clima";
  if (alert.source === "sensor") return "/centro-operacoes";
  return "/centro-operacoes";
}
