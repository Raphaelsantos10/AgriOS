import { useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Farm } from "../../farms/types/farm";
import type { Field } from "../../fields/types/field";
import type {
  Mission,
  MissionChecklistItem,
  MissionInput,
  MissionPriority,
  MissionStatus,
} from "../types/mission";

interface Props {
  open: boolean;
  mission: Mission | null;
  farms: Farm[];
  fields: Field[];
  onClose: () => void;
  onSave: (input: MissionInput, existing?: Mission) => Promise<void>;
}

function toLocalInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function createChecklistItem(label = ""): MissionChecklistItem {
  return {
    id: crypto.randomUUID(),
    label,
    completed: false,
  };
}

export default function MissionDrawer(props: Props) {
  if (!props.open) return null;
  return <MissionDrawerContent key={props.mission?.id ?? "new"} {...props} />;
}

function MissionDrawerContent({ mission, farms, fields, onClose, onSave }: Props) {
  const [title, setTitle] = useState(mission?.title ?? "");
  const [description, setDescription] = useState(mission?.description ?? "");
  const [farmId, setFarmId] = useState(mission?.farm_id ?? farms[0]?.id ?? "");
  const [fieldId, setFieldId] = useState(mission?.field_id ?? "");
  const [priority, setPriority] = useState<MissionPriority>(mission?.priority ?? "medium");
  const [status, setStatus] = useState<MissionStatus>(mission?.status ?? "new");
  const [assignedTo, setAssignedTo] = useState(mission?.assigned_to ?? "");
  const [startDate, setStartDate] = useState(toLocalInput(mission?.start_date ?? null));
  const [endDate, setEndDate] = useState(toLocalInput(mission?.end_date ?? null));
  const [notes, setNotes] = useState(mission?.notes ?? "");
  const [checklist, setChecklist] = useState<MissionChecklistItem[]>(
    mission?.checklist?.length ? mission.checklist : [createChecklistItem()],
  );
  const [saving, setSaving] = useState(false);

  const availableFields = useMemo(
    () => fields.filter((field) => field.farm_id === farmId),
    [farmId, fields],
  );

  function updateChecklist(id: string, changes: Partial<MissionChecklistItem>) {
    setChecklist((items) =>
      items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }

  async function handleSave() {
    if (!title.trim()) {
      alert("Indique o título da missão.");
      return;
    }
    if (!farmId) {
      alert("Selecione uma exploração.");
      return;
    }

    const cleanChecklist = checklist.filter((item) => item.label.trim());

    try {
      setSaving(true);
      await onSave(
        {
          farm_id: farmId,
          field_id: fieldId || null,
          title: title.trim(),
          description: description.trim() || null,
          priority,
          status,
          assigned_to: assignedTo.trim() || null,
          start_date: startDate ? new Date(startDate).toISOString() : null,
          end_date: endDate ? new Date(endDate).toISOString() : null,
          completed_at: status === "completed" ? mission?.completed_at ?? new Date().toISOString() : null,
          latitude: mission?.latitude ?? null,
          longitude: mission?.longitude ?? null,
          notes: notes.trim() || null,
          checklist: cleanChecklist,
        },
        mission ?? undefined,
      );
      onClose();
    } catch (error) {
      console.error("MISSION SAVE ERROR:", error);
      alert("Não foi possível guardar a missão.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-9999 bg-black/50">
      <div className="absolute right-0 top-0 flex h-screen w-full max-w-2xl flex-col bg-slate-50 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {mission ? "Editar missão" : "Nova missão"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Planeie uma operação ligada à exploração ou a um talhão.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Título *</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Descrição</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700">Exploração *</span>
              <select value={farmId} onChange={(e) => { setFarmId(e.target.value); setFieldId(""); }} className="w-full rounded-xl border border-slate-200 px-4 py-3">
                <option value="">Selecionar</option>
                {farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700">Talhão</span>
              <select value={fieldId} onChange={(e) => setFieldId(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3">
                <option value="">Toda a exploração</option>
                {availableFields.map((field) => <option key={field.id} value={field.id}>{field.name}</option>)}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700">Prioridade</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value as MissionPriority)} className="w-full rounded-xl border border-slate-200 px-4 py-3">
                <option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option><option value="critical">Crítica</option>
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700">Estado</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as MissionStatus)} className="w-full rounded-xl border border-slate-200 px-4 py-3">
                <option value="new">Nova</option><option value="in_progress">Em andamento</option><option value="paused">Pausada</option><option value="completed">Concluída</option><option value="cancelled">Cancelada</option>
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700">Responsável</span>
              <input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label><span className="mb-2 block text-sm font-bold text-slate-700">Início</span><input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
            <label><span className="mb-2 block text-sm font-bold text-slate-700">Fim previsto</span><input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div><h3 className="font-bold text-slate-900">Checklist</h3><p className="text-sm text-slate-500">Etapas necessárias para concluir a missão.</p></div>
              <button type="button" onClick={() => setChecklist((items) => [...items, createChecklistItem()])} className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-sm font-bold text-green-700"><Plus size={16} />Adicionar</button>
            </div>
            <div className="mt-4 space-y-3">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <input type="checkbox" checked={item.completed} onChange={(e) => updateChecklist(item.id, { completed: e.target.checked })} />
                  <input value={item.label} onChange={(e) => updateChecklist(item.id, { label: e.target.value })} placeholder="Ex.: Preparar máquina" className="flex-1 rounded-xl border border-slate-200 px-3 py-2" />
                  <button type="button" onClick={() => setChecklist((items) => items.filter((entry) => entry.id !== item.id))} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"><Trash2 size={17} /></button>
                </div>
              ))}
            </div>
          </section>

          <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Notas</span><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 bg-white p-5">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700">Cancelar</button>
          <button type="button" disabled={saving} onClick={handleSave} className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800 disabled:opacity-50">{saving ? "A guardar..." : "Guardar missão"}</button>
        </footer>
      </div>
    </div>
  );
}
