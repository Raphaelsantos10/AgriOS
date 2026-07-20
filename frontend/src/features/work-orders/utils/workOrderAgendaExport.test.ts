import { describe, expect, it } from "vitest";
import type { WorkOrder } from "../types/workOrder";
import { buildWorkOrderAgendaCsv } from "./workOrderAgendaExport";

const order = {
  id: "WO-1", title: 'Inspeção "Norte"', type: "inspection", farm: "Quinta", field: "Norte",
  crop: "Vinha", priority: "critical", status: "in_progress", scheduledDate: "2026-07-21",
  assignedTo: "Ana", estimatedCost: 25, notes: "Verificar alerta", createdAt: "", updatedAt: "",
} as WorkOrder;

describe("buildWorkOrderAgendaCsv", () => {
  it("exporta prazo, responsável, prioridade e estado legíveis", () => {
    const csv = buildWorkOrderAgendaCsv([order], "2026-07-20");
    expect(csv).toContain('"Crítica";"Em execução";"2026-07-21";"Ana"');
    expect(csv).toContain('"Inspeção ""Norte"""');
  });

  it("gera somente o cabeçalho quando a agenda está vazia", () => {
    const csv = buildWorkOrderAgendaCsv([], "2026-07-20");
    expect(csv.split("\r\n")).toHaveLength(1);
    expect(csv).toContain('"Responsável"');
  });
});
