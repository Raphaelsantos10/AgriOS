import type { WorkOrder } from "../types/workOrder";

const statusLabels = { draft: "Rascunho", planned: "Planeada", in_progress: "Em execução", completed: "Concluída", cancelled: "Cancelada" } as const;
const priorityLabels = { low: "Baixa", medium: "Média", high: "Alta", critical: "Crítica" } as const;
const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

export function buildWorkOrderAgendaCsv(orders: WorkOrder[], generatedAt: string) {
  const rows = orders.map((order) => [
    order.id, order.title, order.farm, order.field, order.crop || "Não definida", order.type,
    priorityLabels[order.priority], statusLabels[order.status], order.scheduledDate,
    order.assignedTo, order.estimatedCost, order.actualCost ?? "Não informado", order.notes || "", generatedAt,
  ]);
  return [["ID", "Tarefa", "Exploração", "Talhão", "Cultura", "Tipo", "Prioridade", "Estado", "Prazo", "Responsável", "Custo previsto (€)", "Custo real (€)", "Observações", "Exportado em"], ...rows]
    .map((row) => row.map(escapeCsv).join(";"))
    .join("\r\n");
}

export function downloadWorkOrderAgendaCsv(orders: WorkOrder[], generatedAt: string) {
  const blob = new Blob([`\uFEFF${buildWorkOrderAgendaCsv(orders, generatedAt)}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "farpha-agenda-operacional.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}
