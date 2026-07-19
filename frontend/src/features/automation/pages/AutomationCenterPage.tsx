import { useMemo, useState } from "react";
import { Activity, CheckCircle2, Plus, Workflow } from "lucide-react";
import { executeAutomation } from "../../../core/automation";
import AutomationRuleCard from "../components/AutomationRuleCard";
import CreateAutomationModal from "../components/CreateAutomationModal";
import { loadAutomationRules, loadAutomationRuns, saveAutomationRules, saveAutomationRuns } from "../services/automationStorage";
import type { AutomationRule, AutomationRun } from "../types/automation";

export default function AutomationCenterPage() {
  const [rules, setRules] = useState(loadAutomationRules);
  const [runs, setRuns] = useState(loadAutomationRuns);
  const [modalOpen, setModalOpen] = useState(false);
  const persistRules = (next: AutomationRule[]) => { setRules(next); saveAutomationRules(next); };
  const persistRuns = (next: AutomationRun[]) => { setRuns(next); saveAutomationRuns(next); };
  const runRule = (id: string) => {
    const rule = rules.find(item => item.id === id); if (!rule) return;
    const run = executeAutomation(rule); persistRuns([run, ...runs]);
    persistRules(rules.map(item => item.id === id ? { ...item, lastRunAt: run.executedAt, runCount: item.runCount + (run.status === "success" ? 1 : 0) } : item));
  };
  const stats = useMemo(() => ({ active: rules.filter(r => r.status === "active").length, executions: rules.reduce((sum, r) => sum + r.runCount, 0), success: runs.filter(r => r.status === "success").length }), [rules, runs]);
  return <div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--farpha-brand-600)]">FARPHA Enterprise</p><h1 className="mt-1 text-2xl font-bold md:text-3xl">Automation Center</h1><p className="mt-2 max-w-2xl text-[var(--farpha-text-muted)]">Transforme dados de sensores, clima e satélite em ações operacionais automáticas.</p></div><button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-[var(--farpha-brand-600)] px-4 py-2.5 font-semibold text-white"><Plus size={18}/>Nova automação</button></header>
    <section className="grid gap-4 sm:grid-cols-3">{[[Workflow,"Regras ativas",stats.active],[Activity,"Execuções",stats.executions],[CheckCircle2,"Sucessos recentes",stats.success]].map(([Icon,label,value]) => { const I = Icon as typeof Workflow; return <div key={String(label)} className="rounded-2xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-5"><I size={20} className="text-[var(--farpha-brand-600)]"/><p className="mt-3 text-sm text-[var(--farpha-text-muted)]">{label as string}</p><strong className="text-2xl">{value as number}</strong></div>})}</section>
    <section><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Regras configuradas</h2><span className="text-sm text-[var(--farpha-text-muted)]">{rules.length} regras</span></div><div className="grid gap-4 xl:grid-cols-2">{rules.map(rule => <AutomationRuleCard key={rule.id} rule={rule} onRun={runRule} onToggle={id => persistRules(rules.map(r => r.id === id ? {...r,status:r.status === "active" ? "paused" : "active"} : r))} onDelete={id => persistRules(rules.filter(r => r.id !== id))}/>)}</div></section>
    <section className="rounded-2xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-5"><h2 className="text-lg font-semibold">Histórico de execuções</h2><div className="mt-4 divide-y divide-[var(--farpha-border)]">{runs.length === 0 ? <p className="py-6 text-sm text-[var(--farpha-text-muted)]">Execute uma regra para gerar o primeiro registo.</p> : runs.slice(0,8).map(run => <div key={run.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><div><p className="font-medium">{run.ruleName}</p><p className="text-sm text-[var(--farpha-text-muted)]">{run.message}</p></div><div className="text-right"><span className={`rounded-full px-2 py-1 text-xs font-medium ${run.status === "success" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{run.status === "success" ? "Executada" : "Ignorada"}</span><p className="mt-1 text-xs text-[var(--farpha-text-muted)]">{new Date(run.executedAt).toLocaleString("pt-PT")}</p></div></div>)}</div></section>
    <CreateAutomationModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={rule => persistRules([rule,...rules])}/>
  </div>;
}
