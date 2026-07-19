import type { WorkOrderPriority, WorkOrderStatus } from "../types/workOrder";

const statusLabels: Record<WorkOrderStatus, string> = {
  draft: "Rascunho",
  planned: "Planeada",
  in_progress: "Em execução",
  completed: "Concluída",
  cancelled: "Cancelada",
};

const statusStyles: Record<WorkOrderStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  planned: "bg-blue-50 text-blue-700",
  in_progress: "bg-amber-50 text-amber-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
};

const priorityLabels: Record<WorkOrderPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
};

const priorityStyles: Record<WorkOrderPriority, string> = {
  low: "text-slate-500",
  medium: "text-blue-600",
  high: "text-amber-600",
  critical: "text-rose-600",
};

export function StatusBadge({ status }: { status: WorkOrderStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[status]}`}>{statusLabels[status]}</span>;
}

export function PriorityLabel({ priority }: { priority: WorkOrderPriority }) {
  return <span className={`text-xs font-bold ${priorityStyles[priority]}`}>{priorityLabels[priority]}</span>;
}
