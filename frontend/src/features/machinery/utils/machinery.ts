import type { Machine, MachineCategory } from "../types/machinery";

export const machineCategoryLabels: Record<MachineCategory, string> = { tractor: "Trator", implement: "Alfaia", harvester: "Colhedora", sprayer: "Pulverizador", irrigation: "Equipamento de rega", vehicle: "Veículo", other: "Outro" };
export function getMaintenanceState(machine: Machine, today: string) {
  if ((machine.nextMaintenanceDate && machine.nextMaintenanceDate < today) || (machine.nextMaintenanceHours !== null && machine.currentHours >= machine.nextMaintenanceHours)) return "overdue" as const;
  if (machine.nextMaintenanceDate) {
    const days = Math.ceil((new Date(`${machine.nextMaintenanceDate}T12:00:00`).getTime() - new Date(`${today}T12:00:00`).getTime()) / 86400000);
    if (days <= 30) return "due_soon" as const;
  }
  if (machine.nextMaintenanceHours !== null && machine.nextMaintenanceHours - machine.currentHours <= 25) return "due_soon" as const;
  return "ok" as const;
}

export function summarizeMachinery(machines: Machine[], today: string) {
  return { machines: machines.length, active: machines.filter((machine) => machine.status === "active").length, maintenanceAlerts: machines.filter((machine) => getMaintenanceState(machine, today) !== "ok").length, totalHours: Number(machines.reduce((sum, machine) => sum + machine.currentHours, 0).toFixed(2)), totalFuel: Number(machines.reduce((sum, machine) => sum + machine.fuelConsumedLiters, 0).toFixed(2)), estimatedUsageCost: Number(machines.reduce((sum, machine) => sum + machine.currentHours * machine.hourlyCost, 0).toFixed(2)) };
}

const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
export function buildMachineryCsv(machines: Machine[], today: string, generatedAt: string) {
  const maintenanceLabels = { overdue: "Manutenção vencida", due_soon: "Manutenção próxima", ok: "Em dia" };
  const rows = machines.map((machine) => [machine.id, machine.name, machineCategoryLabels[machine.category], machine.brand, machine.model, machine.registration, machine.status, machine.currentHours, machine.fuelConsumedLiters, machine.hourlyCost, Number((machine.currentHours * machine.hourlyCost).toFixed(2)), machine.lastMaintenanceDate || "Não informada", machine.nextMaintenanceDate || "Não informada", machine.nextMaintenanceHours ?? "Não informada", maintenanceLabels[getMaintenanceState(machine, today)], machine.notes, generatedAt]);
  return [["ID", "Máquina", "Categoria", "Marca", "Modelo", "Matrícula/Identificação", "Estado", "Horas", "Combustível (l)", "Custo/hora (€)", "Custo estimado (€)", "Última manutenção", "Próxima manutenção", "Próxima manutenção (horas)", "Alerta", "Observações", "Exportado em"], ...rows].map((row) => row.map(escapeCsv).join(";")).join("\r\n");
}
export function downloadMachineryCsv(machines: Machine[], today: string, generatedAt: string) { const blob = new Blob([`\uFEFF${buildMachineryCsv(machines, today, generatedAt)}`], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "farpha-maquinas.csv"; anchor.click(); URL.revokeObjectURL(url); }
