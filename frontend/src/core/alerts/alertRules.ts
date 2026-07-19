import type { SatelliteObservation } from "../../features/precision-agriculture/types/precision";
import type { WorkOrder } from "../../features/work-orders/types/workOrder";
import type { UnifiedAlert } from "./alertTypes";

export function alertsFromSatellite(observations: SatelliteObservation[]): UnifiedAlert[] {
  return observations
    .filter((item) => item.status !== "healthy")
    .map((item) => ({
      id: `sat-${item.id}`,
      title: item.status === "critical" ? "Vigor vegetativo crítico" : "Redução de vigor detetada",
      description: `${item.fieldName}: ${item.index.toUpperCase()} médio de ${item.averageValue.toFixed(2)}.`,
      severity: item.status === "critical" ? "critical" : "warning",
      source: "satellite",
      field: item.fieldName,
      createdAt: item.capturedAt,
      actionLabel: "Abrir precisão",
      actionPath: "/precisao",
    }));
}

export function alertsFromWorkOrders(orders: WorkOrder[]): UnifiedAlert[] {
  const now = new Date();
  return orders.flatMap((order) => {
    const scheduled = new Date(`${order.scheduledDate}T12:00:00`);
    const overdue = scheduled.getTime() < now.getTime() && order.status !== "completed" && order.status !== "cancelled";
    if (!overdue && order.priority !== "critical") return [];
    return [{
      id: `wo-${order.id}`,
      title: overdue ? "Ordem de trabalho em atraso" : "Ordem crítica por executar",
      description: `${order.title} · ${order.field}`,
      severity: order.priority === "critical" || overdue ? "critical" : "warning",
      source: "work-order",
      field: order.field,
      farm: order.farm,
      createdAt: order.updatedAt,
      actionLabel: "Ver ordem",
      actionPath: "/ordens",
    } satisfies UnifiedAlert];
  });
}

export const operationalSeedAlerts: UnifiedAlert[] = [
  {
    id: "weather-frost-24h",
    title: "Risco de geada nas próximas 24h",
    description: "Temperaturas mínimas previstas abaixo de 1 °C entre 04:00 e 07:00.",
    severity: "critical",
    source: "weather",
    farm: "Quinta do Souto",
    createdAt: new Date().toISOString(),
    actionLabel: "Ver previsão",
  },
  {
    id: "sensor-battery-low",
    title: "Sensores com bateria baixa",
    description: "Dois sensores de humidade estão abaixo de 15% de bateria.",
    severity: "warning",
    source: "sensor",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    actionLabel: "Planear manutenção",
  },
  {
    id: "satellite-image-ready",
    title: "Nova imagem de satélite disponível",
    description: "Cobertura de nuvens de 8%; imagem pronta para análise.",
    severity: "info",
    source: "satellite",
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    actionLabel: "Analisar imagem",
    actionPath: "/precisao",
  },
];
