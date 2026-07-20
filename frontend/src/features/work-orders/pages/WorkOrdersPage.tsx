import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, CircleDollarSign, Clock3, Download, Plus, Search, SlidersHorizontal, Trash2, Wrench } from "lucide-react";
import Button from "../../../design-system/components/Button";
import Card from "../../../design-system/components/Card";
import CreateWorkOrderModal from "../components/CreateWorkOrderModal";
import { PriorityLabel, StatusBadge } from "../components/WorkOrderBadge";
import { createWorkOrder, deleteWorkOrder, listWorkOrders, updateWorkOrderStatus } from "../services/workOrderStorage";
import { downloadWorkOrderAgendaCsv } from "../utils/workOrderAgendaExport";
import type { LucideIcon } from "lucide-react";
import type { WorkOrder, WorkOrderDraft, WorkOrderStatus } from "../types/workOrder";

const statusOptions: Array<{ value: "all" | WorkOrderStatus; label: string }> = [
  { value: "all", label: "Todos os estados" }, { value: "draft", label: "Rascunho" }, { value: "planned", label: "Planeada" }, { value: "in_progress", label: "Em execução" }, { value: "completed", label: "Concluída" }, { value: "cancelled", label: "Cancelada" },
];

export default function WorkOrdersPage() {
  const [orders, setOrders] = useState<WorkOrder[]>(() => listWorkOrders());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | WorkOrderStatus>("all");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => orders.filter((order) => {
    const matchesStatus = status === "all" || order.status === status;
    const haystack = `${order.id} ${order.title} ${order.farm} ${order.field} ${order.assignedTo}`.toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  }), [orders, query, status]);

  const metrics = {
    open: orders.filter((o) => o.status === "planned" || o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
    urgent: orders.filter((o) => o.priority === "critical" && o.status !== "completed").length,
    cost: orders.reduce((sum, order) => sum + order.estimatedCost, 0),
  };

  function addOrder(draft: WorkOrderDraft) { setOrders((current) => [createWorkOrder(draft), ...current]); }
  function changeStatus(id: string, next: WorkOrderStatus) { setOrders(updateWorkOrderStatus(id, next)); }
  function removeOrder(id: string) { if (window.confirm("Apagar esta tarefa da agenda?")) setOrders(deleteWorkOrder(id)); }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-700">Operações agrícolas</p><h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Ordens de Trabalho</h1><p className="mt-2 max-w-2xl text-sm text-slate-600">Planeie, distribua e acompanhe tarefas de campo num único centro operacional.</p></div>
        <div className="flex flex-wrap gap-3"><Button variant="secondary" onClick={() => downloadWorkOrderAgendaCsv(orders, new Date().toISOString())}><Download size={18} /> Exportar agenda CSV</Button><Button onClick={() => setModalOpen(true)}><Plus size={18} /> Nova ordem</Button></div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {([
          ["Ordens abertas", metrics.open, Clock3, "Em planeamento ou execução"],
          ["Concluídas", metrics.completed, CheckCircle2, "Histórico operacional"],
          ["Prioridade crítica", metrics.urgent, Wrench, "Exigem atenção imediata"],
          ["Custo previsto", `${metrics.cost.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}`, CircleDollarSign, "Total das ordens"],
        ] as Array<[string, string | number, LucideIcon, string]>).map(([label, value, Icon, help]) => <Card key={String(label)} className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-slate-500">{label as string}</p><p className="mt-2 text-3xl font-black text-slate-950">{value as string | number}</p><p className="mt-1 text-xs text-slate-500">{help as string}</p></div><span className="rounded-2xl bg-emerald-50 p-3 text-emerald-700"><Icon size={21} /></span></div></Card>)}
      </section>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar ordem, exploração, talhão…" className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-600"><SlidersHorizontal size={17} /><select value={status} onChange={(e) => setStatus(e.target.value as "all" | WorkOrderStatus)} className="h-11 rounded-xl border border-slate-200 bg-white px-3">{statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[980px] text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr>{["Ordem", "Exploração / Talhão", "Data", "Responsável", "Prioridade", "Estado", "Ação"].map((h) => <th key={h} className="px-5 py-3 font-extrabold">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((order) => <tr key={order.id} className="hover:bg-emerald-50/35"><td className="px-5 py-4"><p className="text-xs font-bold text-emerald-700">{order.id}</p><p className="mt-1 font-bold text-slate-900">{order.title}</p><p className="text-xs text-slate-500">{order.type}</p></td><td className="px-5 py-4"><p className="font-semibold text-slate-800">{order.farm}</p><p className="text-sm text-slate-500">{order.field}</p></td><td className="px-5 py-4 text-sm text-slate-700"><CalendarDays className="mr-2 inline" size={16} />{new Date(`${order.scheduledDate}T12:00:00`).toLocaleDateString("pt-PT")}</td><td className="px-5 py-4 text-sm font-semibold text-slate-700">{order.assignedTo}</td><td className="px-5 py-4"><PriorityLabel priority={order.priority} /></td><td className="px-5 py-4"><StatusBadge status={order.status} /></td><td className="px-5 py-4"><div className="flex items-center gap-2"><select aria-label={`Alterar estado de ${order.id}`} value={order.status} onChange={(e) => changeStatus(order.id, e.target.value as WorkOrderStatus)} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold"><option value="draft">Rascunho</option><option value="planned">Planeada</option><option value="in_progress">Em execução</option><option value="completed">Concluída</option><option value="cancelled">Cancelada</option></select><button type="button" onClick={() => removeOrder(order.id)} aria-label={`Apagar ${order.id}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16}/></button></div></td></tr>)}</tbody></table>
        </div>

        <div className="divide-y divide-slate-100 lg:hidden">{filtered.map((order) => <article key={order.id} className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-extrabold text-emerald-700">{order.id}</p><h3 className="font-extrabold text-slate-900">{order.title}</h3></div><StatusBadge status={order.status} /></div><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-slate-500">Exploração</p><p className="font-semibold">{order.farm}</p></div><div><p className="text-xs text-slate-500">Talhão</p><p className="font-semibold">{order.field}</p></div><div><p className="text-xs text-slate-500">Data</p><p className="font-semibold">{new Date(`${order.scheduledDate}T12:00:00`).toLocaleDateString("pt-PT")}</p></div><div><p className="text-xs text-slate-500">Prioridade</p><PriorityLabel priority={order.priority} /></div></div><select value={order.status} onChange={(e) => changeStatus(order.id, e.target.value as WorkOrderStatus)} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold"><option value="draft">Rascunho</option><option value="planned">Planeada</option><option value="in_progress">Em execução</option><option value="completed">Concluída</option><option value="cancelled">Cancelada</option></select></article>)}</div>
        {filtered.length === 0 ? <div className="py-16 text-center"><p className="font-bold text-slate-800">Nenhuma ordem encontrada</p><p className="mt-1 text-sm text-slate-500">Ajuste os filtros ou crie uma nova ordem.</p></div> : null}
      </Card>

      <CreateWorkOrderModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={addOrder} />
    </div>
  );
}
