import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import Button from "../../../design-system/components/Button";
import Input from "../../../design-system/components/Input";
import type { WorkOrderDraft, WorkOrderPriority, WorkOrderType } from "../types/workOrder";

const today = new Date().toISOString().slice(0, 10);

const initialState: WorkOrderDraft = {
  title: "",
  type: "inspection",
  farm: "",
  field: "",
  crop: "",
  priority: "medium",
  status: "planned",
  scheduledDate: today,
  assignedTo: "",
  estimatedCost: 0,
  notes: "",
};

export default function CreateWorkOrderModal({ open, onClose, onCreate, initialDraft }: { open: boolean; onClose: () => void; onCreate: (draft: WorkOrderDraft) => void | Promise<void>; initialDraft?: Partial<WorkOrderDraft> }) {
  const [form, setForm] = useState(() => ({ ...initialState, ...initialDraft }));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.title.trim() || !form.farm.trim() || !form.field.trim() || !form.assignedTo.trim()) {
      setError("Preencha o título, exploração, talhão e responsável.");
      return;
    }
    setBusy(true);
    try {
      await onCreate(form);
      setForm(initialState);
      setError("");
      onClose();
    } catch {
      setError("Não foi possível guardar a ordem. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">Centro de Operações</p><h2 className="text-xl font-extrabold text-slate-900">Nova ordem de trabalho</h2></div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Fechar"><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
          <div className="sm:col-span-2"><Input label="Título *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex.: Rega do Talhão Norte" /></div>
          <label className="block text-sm font-semibold text-slate-800">Tipo<select className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as WorkOrderType })}><option value="inspection">Inspeção</option><option value="irrigation">Rega</option><option value="fertilization">Fertilização</option><option value="spraying">Pulverização</option><option value="pruning">Poda</option><option value="harvest">Colheita</option><option value="planting">Plantação</option><option value="seeding">Sementeira</option><option value="maintenance">Manutenção</option><option value="other">Outro</option></select></label>
          <label className="block text-sm font-semibold text-slate-800">Prioridade<select className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as WorkOrderPriority })}><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option><option value="critical">Crítica</option></select></label>
          <Input label="Exploração *" value={form.farm} onChange={(e) => setForm({ ...form, farm: e.target.value })} />
          <Input label="Talhão *" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} />
          <Input label="Cultura" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} />
          <Input label="Responsável *" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} />
          <Input label="Data prevista" type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
          <Input label="Custo previsto (€)" type="number" min="0" step="0.01" value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: Number(e.target.value) })} />
          <label className="sm:col-span-2 block text-sm font-semibold text-slate-800">Observações<textarea className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
          {error ? <p className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p> : null}
          <div className="flex justify-end gap-3 sm:col-span-2"><Button type="button" variant="secondary" onClick={onClose} disabled={busy}>Cancelar</Button><Button type="submit" loading={busy}>Criar ordem</Button></div>
        </form>
      </div>
    </div>
  );
}
