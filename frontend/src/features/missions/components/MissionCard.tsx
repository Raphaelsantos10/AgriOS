import { CalendarDays, CheckCircle2, MapPinned, UserRound } from "lucide-react";
import type { Farm } from "../../farms/types/farm";
import type { Field } from "../../fields/types/field";
import type { Mission } from "../types/mission";
import { MissionPriorityBadge, MissionStatusBadge } from "./MissionStatusBadge";

interface Props {
  mission: Mission;
  farm?: Farm;
  field?: Field;
  onOpen: (mission: Mission) => void;
}

function formatDate(value: string | null) {
  if (!value) return "Sem data";
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function MissionCard({ mission, farm, field, onOpen }: Props) {
  const completed = mission.checklist.filter((item) => item.completed).length;
  const total = mission.checklist.length;

  return (
    <button
      type="button"
      onClick={() => onOpen(mission)}
      className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{mission.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {mission.description || "Sem descrição."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <MissionPriorityBadge priority={mission.priority} />
          <MissionStatusBadge status={mission.status} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <MapPinned size={16} className="text-green-700" />
          {farm?.name ?? "Exploração não encontrada"}
          {field ? ` • ${field.name}` : ""}
        </span>
        <span className="flex items-center gap-2">
          <UserRound size={16} className="text-green-700" />
          {mission.assigned_to || "Sem responsável"}
        </span>
        <span className="flex items-center gap-2">
          <CalendarDays size={16} className="text-green-700" />
          {formatDate(mission.start_date)}
        </span>
        <span className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-700" />
          Checklist {completed}/{total}
        </span>
      </div>
    </button>
  );
}
