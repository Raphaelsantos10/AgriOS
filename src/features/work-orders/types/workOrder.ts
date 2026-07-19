export type WorkOrderStatus = "draft" | "planned" | "in_progress" | "completed" | "cancelled";
export type WorkOrderPriority = "low" | "medium" | "high" | "critical";
export type WorkOrderType = "planting" | "seeding" | "irrigation" | "fertilization" | "spraying" | "pruning" | "harvest" | "inspection" | "maintenance" | "other";

export type WorkOrder = {
  id: string;
  title: string;
  type: WorkOrderType;
  farm: string;
  field: string;
  crop?: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  scheduledDate: string;
  assignedTo: string;
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkOrderDraft = Omit<WorkOrder, "id" | "createdAt" | "updatedAt">;
