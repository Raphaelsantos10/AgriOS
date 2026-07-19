import { CheckCircle2, ExternalLink, Pause, Play, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Farm } from "../../farms/types/farm";
import type { Field } from "../../fields/types/field";
import type { Mission, MissionStatus } from "../types/mission";
import { MissionPriorityBadge, MissionStatusBadge } from "./MissionStatusBadge";

interface Props {
  mission: Mission | null;
  farm?: Farm;
  field?: Field;
  onClose: () => void;
  onEdit: (mission: Mission) => void;
  onStatusChange: (mission: Mission, status: MissionStatus) => Promise<void>;
  onDelete: (mission: Mission) => Promise<void>;
}

export default function MissionDetailsPanel({ mission, farm, field, onClose, onEdit, onStatusChange, onDelete }: Props) {
  const navigate = useNavigate();
  if (!mission) return null;

  return (
    <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl">
      <header className="flex items-start justify-between border-b border-slate-200 p-5">
        <div><p className="text-sm font-bold text-green-700">Centro de Missões</p><h2 className="mt-1 text-2xl font-bold text-slate-900">{mission.title}</h2></div>
        <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100"><X /></button>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <div className="flex flex-wrap gap-2"><MissionPriorityBadge priority={mission.priority} /><MissionStatusBadge status={mission.status} /></div>
        <p className="text-slate-600">{mission.description || "Sem descrição."}</p>

        <section className="rounded-2xl bg-slate-50 p-4">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Exploração</dt><dd className="font-bold text-slate-900">{farm?.name ?? "-"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Talhão</dt><dd className="font-bold text-slate-900">{field?.name ?? "Toda a exploração"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Responsável</dt><dd className="font-bold text-slate-900">{mission.assigned_to ?? "-"}</dd></div>
          </dl>
        </section>

        {field && (
          <button type="button" onClick={() => navigate(`/exploracoes/${mission.farm_id}`)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 font-bold text-green-700 hover:bg-green-100">
            <ExternalLink size={18} />Abrir talhão no mapa
          </button>
        )}

        <section>
          <h3 className="font-bold text-slate-900">Checklist</h3>
          <div className="mt-3 space-y-2">
            {mission.checklist.length === 0 ? <p className="text-sm text-slate-500">Sem itens.</p> : mission.checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                <CheckCircle2 size={18} className={item.completed ? "text-green-600" : "text-slate-300"} />
                <span className={item.completed ? "text-slate-500 line-through" : "text-slate-700"}>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {mission.notes && <section><h3 className="font-bold text-slate-900">Notas</h3><p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{mission.notes}</p></section>}
      </div>

      <footer className="space-y-3 border-t border-slate-200 p-5">
        <div className="grid grid-cols-2 gap-3">
          {mission.status !== "in_progress" && mission.status !== "completed" && (
            <button type="button" onClick={() => onStatusChange(mission, "in_progress")} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white"><Play size={17} />Iniciar</button>
          )}
          {mission.status === "in_progress" && (
            <button type="button" onClick={() => onStatusChange(mission, "paused")} className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-bold text-white"><Pause size={17} />Pausar</button>
          )}
          {mission.status !== "completed" && (
            <button type="button" onClick={() => onStatusChange(mission, "completed")} className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-bold text-white"><CheckCircle2 size={17} />Concluir</button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => onEdit(mission)} className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-700">Editar</button>
          <button type="button" onClick={() => onDelete(mission)} className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-3 font-bold text-rose-700"><Trash2 size={17} />Eliminar</button>
        </div>
      </footer>
    </aside>
  );
}
