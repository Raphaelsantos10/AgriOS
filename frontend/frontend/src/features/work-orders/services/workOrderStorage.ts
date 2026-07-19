import type { WorkOrder, WorkOrderDraft, WorkOrderStatus } from "../types/workOrder";

const STORAGE_KEY = "farpha.work-orders.v1";

const seedOrders: WorkOrder[] = [
  {
    id: "WO-0245",
    title: "Rega do Talhão Norte",
    type: "irrigation",
    farm: "Quinta do Souto",
    field: "Talhão Norte",
    crop: "Castanheiro",
    priority: "high",
    status: "planned",
    scheduledDate: new Date().toISOString().slice(0, 10),
    assignedTo: "João Martins",
    estimatedCost: 85,
    notes: "Confirmar humidade do solo antes de iniciar.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "WO-0246",
    title: "Inspeção fitossanitária",
    type: "inspection",
    farm: "Quinta do Souto",
    field: "Talhão Sul",
    crop: "Oliveira",
    priority: "medium",
    status: "in_progress",
    scheduledDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    assignedTo: "Ana Silva",
    estimatedCost: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "WO-0247",
    title: "Manutenção do sistema de rega",
    type: "maintenance",
    farm: "Herdade da Serra",
    field: "Talhão 3",
    priority: "critical",
    status: "draft",
    scheduledDate: new Date(Date.now() + 172800000).toISOString().slice(0, 10),
    assignedTo: "Equipa Técnica",
    estimatedCost: 260,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function listWorkOrders(): WorkOrder[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedOrders));
    return seedOrders;
  }
  try {
    return JSON.parse(raw) as WorkOrder[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedOrders));
    return seedOrders;
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
    id: `WO-${String(orders.length + 248).padStart(4, "0")}`,
    createdAt: now,
    updatedAt: now,
  };
  persist([order, ...orders]);
  return order;
}

export function updateWorkOrderStatus(id: string, status: WorkOrderStatus): WorkOrder[] {
  const orders = listWorkOrders().map((order) =>
    order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order,
  );
  persist(orders);
  return orders;
}
