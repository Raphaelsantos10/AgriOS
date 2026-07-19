import { latestByField } from "../../features/precision-agriculture/utils/precisionAnalytics";
import type { SatelliteObservation } from "../../features/precision-agriculture/types/precision";
import type { WorkOrder } from "../../features/work-orders/types/workOrder";
import { alertsFromSatellite, alertsFromWorkOrders, operationalSeedAlerts } from "./alertRules";
import type { FarmHealthScore, OperationTimelineEvent, UnifiedAlert } from "./alertTypes";

const severityWeight = { critical: 4, warning: 3, info: 2, success: 1 } as const;

export function buildUnifiedAlerts(observations: SatelliteObservation[], orders: WorkOrder[]): UnifiedAlert[] {
  const latest = latestByField(observations.filter((item) => item.index === "ndvi"));
  return [...operationalSeedAlerts, ...alertsFromSatellite(latest), ...alertsFromWorkOrders(orders)]
    .sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity] || Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function buildTimeline(orders: WorkOrder[]): OperationTimelineEvent[] {
  const orderEvents: OperationTimelineEvent[] = orders.slice(0, 5).map((order) => ({
    id: `timeline-${order.id}`,
    title: order.title,
    description: `${order.field} · ${order.assignedTo}`,
    source: "work-order",
    status: order.status === "completed" ? "completed" : order.status === "in_progress" ? "running" : order.priority === "critical" ? "attention" : "scheduled",
    occurredAt: order.updatedAt,
  }));

  const systemEvents: OperationTimelineEvent[] = [
    { id: "timeline-sat", title: "Imagem Sentinel processada", description: "NDVI, NDRE e NDMI atualizados", source: "satellite", status: "completed", occurredAt: new Date(Date.now() - 35 * 60 * 1000).toISOString() },
    { id: "timeline-sensor", title: "Leitura de solo recebida", description: "Humidade média: 58%", source: "sensor", status: "completed", occurredAt: new Date(Date.now() - 70 * 60 * 1000).toISOString() },
    { id: "timeline-ai", title: "FARPHA recalculou prioridades", description: "3 recomendações operacionais", source: "ai", status: "running", occurredAt: new Date(Date.now() - 95 * 60 * 1000).toISOString() },
  ];

  return [...systemEvents, ...orderEvents].sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt)).slice(0, 7);
}

export function calculateFarmHealth(observations: SatelliteObservation[], orders: WorkOrder[], alerts: UnifiedAlert[]): FarmHealthScore {
  const latest = latestByField(observations.filter((item) => item.index === "ndvi"));
  const vegetation = latest.length ? Math.round((latest.reduce((sum, item) => sum + item.averageValue, 0) / latest.length) * 100) : 75;
  const completed = orders.filter((item) => item.status === "completed").length;
  const operations = orders.length ? Math.round(62 + (completed / orders.length) * 38) : 80;
  const critical = alerts.filter((item) => item.severity === "critical").length;
  const warning = alerts.filter((item) => item.severity === "warning").length;
  const risk = Math.max(35, 100 - critical * 13 - warning * 6);
  const water = 78;
  const total = Math.round(vegetation * 0.34 + water * 0.24 + operations * 0.22 + risk * 0.20);
  return { total, vegetation, water, operations, risk, trend: total >= 80 ? 3.2 : -1.4 };
}
