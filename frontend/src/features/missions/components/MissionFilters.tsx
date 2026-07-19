import { Search } from "lucide-react";
import type { MissionPriority, MissionStatus } from "../types/mission";

interface Props {
  search: string;
  status: MissionStatus | "all";
  priority: MissionPriority | "all";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: MissionStatus | "all") => void;
  onPriorityChange: (value: MissionPriority | "all") => void;
}

export default function MissionFilters({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_220px_220px]">
      <label className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Pesquisar missão..."
          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />
      </label>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as MissionStatus | "all")}
        className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
      >
        <option value="all">Todos os estados</option>
        <option value="new">Nova</option>
        <option value="in_progress">Em andamento</option>
        <option value="paused">Pausada</option>
        <option value="completed">Concluída</option>
        <option value="cancelled">Cancelada</option>
      </select>

      <select
        value={priority}
        onChange={(event) => onPriorityChange(event.target.value as MissionPriority | "all")}
        className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
      >
        <option value="all">Todas as prioridades</option>
        <option value="low">Baixa</option>
        <option value="medium">Média</option>
        <option value="high">Alta</option>
        <option value="critical">Crítica</option>
      </select>
    </div>
  );
}
