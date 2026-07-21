import { useMemo } from "react";
import { buildTimeline, buildUnifiedAlerts, calculateFarmHealth } from "../../../core/alerts";
import { satelliteObservations } from "../../precision-agriculture/data/precisionMockData";
import { listWorkOrders } from "../../work-orders/services/workOrderStorage";

export function useOperationsCenter(refreshToken = 0) {
  return useMemo(() => {
    void refreshToken;
    const workOrders = listWorkOrders();
    const alerts = buildUnifiedAlerts(satelliteObservations, workOrders);
    const timeline = buildTimeline(workOrders);
    const health = calculateFarmHealth(satelliteObservations, workOrders, alerts);
    return {
      alerts,
      timeline,
      health,
      workOrders,
      criticalCount: alerts.filter((item) => item.severity === "critical").length,
      activeOrders: workOrders.filter((item) => item.status === "planned" || item.status === "in_progress").length,
    };
  }, [refreshToken]);
}
