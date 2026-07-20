import type { WorkOrder, WorkOrderDraft, WorkOrderStatus } from "../types/workOrder";

const STORAGE_KEY = "farpha.work-orders.v1";

const legacyDemoIds = new Set(["WO-0245", "WO-0246", "WO-0247"]);

export function listWorkOrders(): WorkOrder[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as WorkOrder[];
    const orders = parsed.filter((order) => !legacyDemoIds.has(order.id));
    if (orders.length !== parsed.length) persist(orders);
    return orders;
  } catch {
    persist([]);
    return [];
  }
}

function persist(orders: WorkOrder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function createWorkOrder(input: WorkOrderDraft): WorkOrder {
  const orders = listWorkOrders();
  const now = new Date().toISOString();
  const order: WorkOrder = {
    ...input,
    id: `WO-${Date.now().toString(36).toUpperCase()}`,
    createdAt: now,
    updatedAt: now,
  };
  persist([order, ...orders]);
  return order;
}

export function deleteWorkOrder(id: string): WorkOrder[] {
  const orders = listWorkOrders().filter((order) => order.id !== id);
  persist(orders);
  return orders;
}

export function updateWorkOrderStatus(id: string, status: WorkOrderStatus): WorkOrder[] {
  const orders = listWorkOrders().map((order) =>
    order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order,
  );
  persist(orders);
  return orders;
}
