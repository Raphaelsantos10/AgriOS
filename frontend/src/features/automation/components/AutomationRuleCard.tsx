import { Pause, Play, RotateCw, Trash2, Zap } from "lucide-react";
import type { AutomationRule } from "../types/automation";

type Props = {
  rule: AutomationRule;
  onToggle: (id: string) => void;
  onRun: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function AutomationRuleCard({ rule, onToggle, onRun, onDelete }: Props) {
  const active = rule.status === "active";
  return (
    <article className="rounded-2xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="rounded-xl bg-[var(--farpha-brand-100)] p-2 text-[var(--farpha-brand-700)]"><Zap size={19} /></div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{rule.name}</h3><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{active ? "Ativa" : "Pausada"}</span></div>
            <p className="mt-1 text-sm text-[var(--farpha-text-muted)]">{rule.description}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-[var(--farpha-surface-soft)] p-3 text-sm">
        <strong>SE</strong> {rule.metric} {rule.operator} {rule.threshold}{rule.unit === "índice" ? "" : rule.unit} <strong className="ml-2">ENTÃO</strong> {rule.actionLabel}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--farpha-text-muted)]">
        <span>{rule.fieldName} · {rule.runCount} execuções</span>
        <div className="flex gap-2">
          <button onClick={() => onRun(rule.id)} className="rounded-lg border border-[var(--farpha-border)] p-2" title="Executar agora"><RotateCw size={16} /></button>
          <button onClick={() => onToggle(rule.id)} className="rounded-lg border border-[var(--farpha-border)] p-2" title={active ? "Pausar" : "Ativar"}>{active ? <Pause size={16} /> : <Play size={16} />}</button>
          <button onClick={() => onDelete(rule.id)} className="rounded-lg border border-[var(--farpha-border)] p-2 text-red-600" title="Eliminar"><Trash2 size={16} /></button>
        </div>
      </div>
    </article>
  );
}
