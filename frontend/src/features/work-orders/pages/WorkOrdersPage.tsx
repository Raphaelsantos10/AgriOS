import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, CircleDollarSign, Clock3, CloudUpload, Download, Plus, Search, Trash2, Wrench } from "lucide-react";
import { Button, Card, DataTable, FilterBar, Input, PageHeader, Select, type DataColumn } from "../../../design-system";
import OperationalDataSourceBadge from "../../../components/OperationalDataSourceBadge";
import { useAuth } from "../../auth/AuthContext";
import { resolveOperationalDataSource } from "../../shared/operationalDataSource";
import CreateWorkOrderModal from "../components/CreateWorkOrderModal";
import { PriorityLabel, StatusBadge } from "../components/WorkOrderBadge";
import { workOrderService } from "../services/workOrderService";
import { downloadWorkOrderAgendaCsv } from "../utils/workOrderAgendaExport";
import type { LucideIcon } from "lucide-react";
import type { WorkOrder, WorkOrderDraft, WorkOrderStatus } from "../types/workOrder";

const statusOptions: Array<{ value: "all" | WorkOrderStatus; label: string }> = [
  { value: "all", label: "Todos os estados" }, { value: "draft", label: "Rascunho" }, { value: "planned", label: "Planeada" }, { value: "in_progress", label: "Em execução" }, { value: "completed", label: "Concluída" }, { value: "cancelled", label: "Cancelada" },
];

export default function WorkOrdersPage() {
  const { mode } = useAuth();
  const source = resolveOperationalDataSource(mode);
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | WorkOrderStatus>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [localPending, setLocalPending] = useState(() => source === "supabase" ? workOrderService.localCount() : 0);

  const loadOrders = useCallback(async () => {
    setLoading(true); setError("");
    try { setOrders(await workOrderService.list(source)); }
    catch { setError("Não foi possível carregar as ordens. Confirme a migração da Sprint 110 e a ligação ao Supabase."); }
    finally { setLoading(false); }
  }, [source]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadOrders(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadOrders]);

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
    { id: "actions", header: "Ação", cell: order => <div className="flex items-center gap-2"><select aria-label={`Alterar estado de ${order.id}`} value={order.status} onChange={e => void changeStatus(order.id, e.target.value as WorkOrderStatus)} className="h-9 rounded-lg border border-[var(--farpha-border)] bg-[var(--farpha-surface)] px-2 text-xs font-semibold"><option value="draft">Rascunho</option><option value="planned">Planeada</option><option value="in_progress">Em execução</option><option value="completed">Concluída</option><option value="cancelled">Cancelada</option></select><button type="button" onClick={() => void removeOrder(order.id)} aria-label={`Apagar ${order.id}`} className="rounded-lg p-2 text-[var(--farpha-danger-700)] hover:bg-[var(--farpha-danger-50)]"><Trash2 size={16}/></button></div> },
  ];

  async function addOrder(draft: WorkOrderDraft) {
    setError("");
    try {
      const created = await workOrderService.create(source, draft);
      setOrders((current) => [created, ...current]);
    }
    catch { setError("A ordem não foi guardada. Confirme a sessão, a migração e as políticas RLS."); throw new Error("work_order_create_failed"); }
  }
  async function changeStatus(id: string, next: WorkOrderStatus) {
    setError("");
    try {
      const updated = await workOrderService.updateStatus(source, id, next);
      if (updated) setOrders((current) => current.map((order) => order.id === id ? updated : order));
    } catch { setError("Não foi possível alterar o estado da ordem."); }
  }
  async function removeOrder(id: string) {
    if (!window.confirm("Apagar esta tarefa da agenda?")) return;
    try { await workOrderService.remove(source, id); setOrders((current) => current.filter((order) => order.id !== id)); }
    catch { setError("Não foi possível apagar a ordem."); }
  }
  async function importLocalOrders() {
    setImporting(true); setError("");
    try { await workOrderService.migrateLocalToSupabase(); setLocalPending(0); await loadOrders(); }
    catch { setError("A importação local não terminou. Os dados permaneceram neste dispositivo e pode tentar novamente."); }
    finally { setImporting(false); }
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHeader eyebrow="Operações agrícolas" title="Ordens de Trabalho" description="Planeie, distribua e acompanhe tarefas de campo num único centro operacional." actions={<><OperationalDataSourceBadge source={source}/>{localPending > 0 ? <Button variant="secondary" loading={importing} onClick={() => void importLocalOrders()}><CloudUpload size={18}/> Importar {localPending} locais</Button> : null}<Button variant="secondary" onClick={() => downloadWorkOrderAgendaCsv(orders, new Date().toISOString())}><Download size={18}/> Exportar agenda CSV</Button><Button onClick={() => setModalOpen(true)}><Plus size={18}/> Nova ordem</Button></>}/>
      {error ? <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">{error} <button type="button" onClick={() => void loadOrders()} className="ml-2 underline">Tentar novamente</button></div> : null}
      {loading ? <div className="rounded-2xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-5 text-sm font-semibold text-[var(--farpha-text-muted)]">A carregar ordens de trabalho…</div> : null}

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

        <DataTable rows={filtered} columns={columns} rowKey={order => order.id} caption="Ordens de trabalho" emptyTitle="Nenhuma ordem encontrada" emptyDescription="Ajuste os filtros ou crie uma nova ordem." mobileCard={order => <div className="space-y-3"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-extrabold text-[var(--farpha-brand-700)]">{order.id}</p><h3 className="font-extrabold">{order.title}</h3></div><StatusBadge status={order.status}/></div><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-[var(--farpha-text-muted)]">Exploração</p><p className="font-semibold">{order.farm}</p></div><div><p className="text-xs text-[var(--farpha-text-muted)]">Talhão</p><p className="font-semibold">{order.field}</p></div><div><p className="text-xs text-[var(--farpha-text-muted)]">Data</p><p className="font-semibold">{new Date(`${order.scheduledDate}T12:00:00`).toLocaleDateString("pt-PT")}</p></div><div><p className="text-xs text-[var(--farpha-text-muted)]">Prioridade</p><PriorityLabel priority={order.priority}/></div></div><select aria-label={`Alterar estado de ${order.id}`} value={order.status} onChange={e => void changeStatus(order.id, e.target.value as WorkOrderStatus)} className="h-10 w-full rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] px-3 text-sm font-semibold"><option value="draft">Rascunho</option><option value="planned">Planeada</option><option value="in_progress">Em execução</option><option value="completed">Concluída</option><option value="cancelled">Cancelada</option></select></div>}/>
      </Card>

      <CreateWorkOrderModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={addOrder} />
    </div>
  );
}
