import type {
  MissionPriority,
  MissionStatus,
} from "../types/mission";

const statusLabels: Record<MissionStatus, string> = {
  new: "Nova",
  in_progress: "Em andamento",
  paused: "Pausada",
  completed: "Concluída",
  cancelled: "Cancelada",
};

const statusClasses: Record<MissionStatus, string> = {
  new: "bg-slate-100 text-slate-700",
  in_progress: "bg-blue-100 text-blue-700",
  paused: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-rose-100 text-rose-700",
};

const priorityLabels: Record<MissionPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
};

const priorityClasses: Record<MissionPriority, string> = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

export function MissionStatusBadge({ status }: { status: MissionStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function MissionPriorityBadge({ priority }: { priority: MissionPriority }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${priorityClasses[priority]}`}>
      {priorityLabels[priority]}
    </span>
  );
}
