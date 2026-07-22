import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, CircleDollarSign, Clock3, Download, Plus, Search, Trash2, Wrench } from "lucide-react";
import { Button, Card, DataTable, FilterBar, Input, PageHeader, Select, type DataColumn } from "../../../design-system";
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

  const columns: DataColumn<WorkOrder>[] = [
    { id: "order", header: "Ordem", cell: order => <div><p className="text-xs font-bold text-[var(--farpha-brand-700)]">{order.id}</p><p className="mt-1 font-bold">{order.title}</p><p className="text-xs text-[var(--farpha-text-muted)]">{order.type}</p></div> },
    { id: "farm", header: "Exploração / Talhão", cell: order => <div><p className="font-semibold">{order.farm}</p><p className="text-sm text-[var(--farpha-text-muted)]">{order.field}</p></div> },
    { id: "date", header: "Data", cell: order => <span className="text-sm"><CalendarDays className="mr-2 inline" size={16}/>{new Date(`${order.scheduledDate}T12:00:00`).toLocaleDateString("pt-PT")}</span> },
    { id: "owner", header: "Responsável", cell: order => <span className="text-sm font-semibold">{order.assignedTo}</span> },
    { id: "priority", header: "Prioridade", cell: order => <PriorityLabel priority={order.priority}/> },
    { id: "status", header: "Estado", cell: order => <StatusBadge status={order.status}/> },
    { id: "actions", header: "Ação", cell: order => <div className="flex items-center gap-2"><select aria-label={`Alterar estado de ${order.id}`} value={order.status} onChange={e => changeStatus(order.id, e.target.value as WorkOrderStatus)} className="h-9 rounded-lg border border-[var(--farpha-border)] bg-[var(--farpha-surface)] px-2 text-xs font-semibold"><option value="draft">Rascunho</option><option value="planned">Planeada</option><option value="in_progress">Em execução</option><option value="completed">Concluída</option><option value="cancelled">Cancelada</option></select><button type="button" onClick={() => removeOrder(order.id)} aria-label={`Apagar ${order.id}`} className="rounded-lg p-2 text-[var(--farpha-danger-700)] hover:bg-[var(--farpha-danger-50)]"><Trash2 size={16}/></button></div> },
  ];

  function addOrder(draft: WorkOrderDraft) { setOrders((current) => [createWorkOrder(draft), ...current]); }
  function changeStatus(id: string, next: WorkOrderStatus) { setOrders(updateWorkOrderStatus(id, next)); }
  function removeOrder(id: string) { if (window.confirm("Apagar esta tarefa da agenda?")) setOrders(deleteWorkOrder(id)); }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHeader eyebrow="Operações agrícolas" title="Ordens de Trabalho" description="Planeie, distribua e acompanhe tarefas de campo num único centro operacional." actions={<><Button variant="secondary" onClick={() => downloadWorkOrderAgendaCsv(orders, new Date().toISOString())}><Download size={18}/> Exportar agenda CSV</Button><Button onClick={() => setModalOpen(true)}><Plus size={18}/> Nova ordem</Button></>}/>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {([
          ["Ordens abertas", metrics.open, Clock3, "Em planeamento ou execução"],
          ["Concluídas", metrics.completed, CheckCircle2, "Histórico operacional"],
          ["Prioridade crítica", metrics.urgent, Wrench, "Exigem atenção imediata"],
          ["Custo previsto", `${metrics.cost.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}`, CircleDollarSign, "Total das ordens"],
        ] as Array<[string, string | number, LucideIcon, string]>).map(([label, value, Icon, help]) => <Card key={String(label)} className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-slate-500">{label as string}</p><p className="mt-2 text-3xl font-black text-slate-950">{value as string | number}</p><p className="mt-1 text-xs text-slate-500">{help as string}</p></div><span className="rounded-2xl bg-emerald-50 p-3 text-emerald-700"><Icon size={21} /></span></div></Card>)}
      </section>

      <Card className="overflow-hidden">
        <div className="border-b border-[var(--farpha-border)] p-4"><FilterBar results={filtered.length}><Input aria-label="Pesquisar ordens" value={query} onChange={e => setQuery(e.target.value)} leadingIcon={<Search size={18}/>} placeholder="Ordem, exploração ou talhão…"/><Select aria-label="Filtrar por estado" value={status} onChange={e => setStatus(e.target.value as "all" | WorkOrderStatus)}>{statusOptions.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</Select></FilterBar></div>

        <DataTable rows={filtered} columns={columns} rowKey={order => order.id} caption="Ordens de trabalho" emptyTitle="Nenhuma ordem encontrada" emptyDescription="Ajuste os filtros ou crie uma nova ordem." mobileCard={order => <div className="space-y-3"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-extrabold text-[var(--farpha-brand-700)]">{order.id}</p><h3 className="font-extrabold">{order.title}</h3></div><StatusBadge status={order.status}/></div><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-[var(--farpha-text-muted)]">Exploração</p><p className="font-semibold">{order.farm}</p></div><div><p className="text-xs text-[var(--farpha-text-muted)]">Talhão</p><p className="font-semibold">{order.field}</p></div><div><p className="text-xs text-[var(--farpha-text-muted)]">Data</p><p className="font-semibold">{new Date(`${order.scheduledDate}T12:00:00`).toLocaleDateString("pt-PT")}</p></div><div><p className="text-xs text-[var(--farpha-text-muted)]">Prioridade</p><PriorityLabel priority={order.priority}/></div></div><select aria-label={`Alterar estado de ${order.id}`} value={order.status} onChange={e => changeStatus(order.id, e.target.value as WorkOrderStatus)} className="h-10 w-full rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] px-3 text-sm font-semibold"><option value="draft">Rascunho</option><option value="planned">Planeada</option><option value="in_progress">Em execução</option><option value="completed">Concluída</option><option value="cancelled">Cancelada</option></select></div>}/>
      </Card>

      <CreateWorkOrderModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={addOrder} />
    </div>
  );
}
