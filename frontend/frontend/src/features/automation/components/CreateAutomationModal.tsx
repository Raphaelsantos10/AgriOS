import { useState } from "react";
import { X } from "lucide-react";
import type { AutomationRule, TriggerType, ActionType } from "../types/automation";

type Props = { open: boolean; onClose: () => void; onCreate: (rule: AutomationRule) => void };

export default function CreateAutomationModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [metric, setMetric] = useState("Humidade do solo");
  const [threshold, setThreshold] = useState(20);
  const [triggerType, setTriggerType] = useState<TriggerType>("sensor");
  const [actionType, setActionType] = useState<ActionType>("create-work-order");
  if (!open) return null;
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onCreate({ id: crypto.randomUUID(), name: name || "Nova automação", description: "Regra criada no Automation Center.", status: "active", triggerType, metric, operator: "<", threshold, unit: metric === "NDVI" ? "índice" : "%", actionType, actionLabel: actionType === "notify" ? "Notificar responsável" : actionType === "irrigate" ? "Iniciar rega" : actionType === "log" ? "Registar evento" : "Criar ordem de trabalho", fieldName: "Toda a exploração", runCount: 0, createdAt: new Date().toISOString() });
    setName(""); onClose();
  };
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
    <form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-[var(--farpha-surface)] p-6 shadow-2xl">
      <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Criar automação</h2><button type="button" onClick={onClose}><X /></button></div>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-1 text-sm">Nome<input required value={name} onChange={e => setName(e.target.value)} className="rounded-xl border border-[var(--farpha-border)] bg-transparent px-3 py-2" placeholder="Ex.: Rega automática" /></label>
        <div className="grid grid-cols-2 gap-3"><label className="grid gap-1 text-sm">Origem<select value={triggerType} onChange={e => setTriggerType(e.target.value as TriggerType)} className="rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] px-3 py-2"><option value="sensor">Sensor</option><option value="weather">Clima</option><option value="satellite">Satélite</option><option value="schedule">Horário</option></select></label><label className="grid gap-1 text-sm">Métrica<select value={metric} onChange={e => setMetric(e.target.value)} className="rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] px-3 py-2"><option>Humidade do solo</option><option>NDVI</option><option>Temperatura</option></select></label></div>
        <label className="grid gap-1 text-sm">Limite<input type="number" step="0.01" value={threshold} onChange={e => setThreshold(Number(e.target.value))} className="rounded-xl border border-[var(--farpha-border)] bg-transparent px-3 py-2" /></label>
        <label className="grid gap-1 text-sm">Ação<select value={actionType} onChange={e => setActionType(e.target.value as ActionType)} className="rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] px-3 py-2"><option value="create-work-order">Criar ordem de trabalho</option><option value="notify">Notificar responsável</option><option value="irrigate">Iniciar rega</option><option value="log">Registar evento</option></select></label>
      </div>
      <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-xl border border-[var(--farpha-border)] px-4 py-2">Cancelar</button><button className="rounded-xl bg-[var(--farpha-brand-600)] px-4 py-2 font-semibold text-white">Criar regra</button></div>
    </form>
  </div>;
}
