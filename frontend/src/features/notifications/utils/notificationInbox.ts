import type { UnifiedAlert } from "../../../core/alerts";

export function unreadAlerts(alerts: UnifiedAlert[], readIds: string[]) {
  const read = new Set(readIds);
  return alerts.filter((alert) => !read.has(alert.id) && !read.has(alertFingerprint(alert)));
}

export function markAlertRead(readIds: string[], alertId: string) {
  return Array.from(new Set([...readIds, alertId]));
}

export function alertFingerprint(alert: UnifiedAlert) {
  return `${alert.id}:${alert.title}:${alert.description}:${alert.severity}`;
}

export function visibleAlerts(alerts: UnifiedAlert[], dismissed: string[]) {
  const hidden = new Set(dismissed);
  return alerts.filter((alert) => !hidden.has(alertFingerprint(alert)));
}

export function relativeNotificationTime(iso: string, now = Date.now()) {
  const difference = Math.max(0, now - Date.parse(iso));
  const minutes = Math.floor(difference / 60_000);
  if (minutes < 1) return "Agora";
  if (minutes < 60) return `Há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours} h`;
  return `Há ${Math.floor(hours / 24)} d`;
}

export function resolveAlertPath(alert: UnifiedAlert) {
  if (alert.actionPath) return alert.actionPath;
  if (alert.source === "weather") return "/clima";
  if (alert.source === "sensor") return "/centro-operacoes";
  return "/centro-operacoes";
}
