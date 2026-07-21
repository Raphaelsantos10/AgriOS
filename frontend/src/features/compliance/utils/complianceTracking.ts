import type { ComplianceObligation, ObligationTracking, TrackingStatus } from "../types/compliance";

export function createTracking(item: ComplianceObligation): ObligationTracking {
  return { obligationId: item.id, status: item.status === "not_applicable" ? "not_applicable" : "pending", dueDate: "", responsible: "", notes: "", confirmedAt: "", updatedAt: "" };
}

export function trackingFor(item: ComplianceObligation, stored: Record<string, ObligationTracking>): ObligationTracking {
  return stored[item.id] ?? createTracking(item);
}

export function changeTrackingStatus(item: ObligationTracking, status: TrackingStatus, now = new Date().toISOString()): ObligationTracking {
  return { ...item, status, confirmedAt: status === "completed" ? now : "" };
}

export function isTrackingOverdue(item: ObligationTracking, today: string): boolean {
  return Boolean(item.dueDate && item.dueDate < today && item.status !== "completed" && item.status !== "not_applicable");
}

export function countTracking(items: ObligationTracking[], today: string) {
  return {
    pending: items.filter((item) => item.status === "pending").length,
    inProgress: items.filter((item) => item.status === "in_progress").length,
    completed: items.filter((item) => item.status === "completed").length,
    overdue: items.filter((item) => isTrackingOverdue(item, today)).length,
  };
}
