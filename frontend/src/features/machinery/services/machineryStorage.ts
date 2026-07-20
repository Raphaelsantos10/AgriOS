import type { Machine, MachineDraft } from "../types/machinery";

const STORAGE_KEY = "farpha.machinery.v1";
export function listMachines(): Machine[] {
  const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return [];
  try { return JSON.parse(raw) as Machine[]; } catch { localStorage.setItem(STORAGE_KEY, "[]"); return []; }
}
function persist(machines: Machine[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(machines)); }

export function createMachine(draft: MachineDraft) {
  const now = new Date().toISOString(); const machine: Machine = { ...draft, id: `MAQ-${Date.now().toString(36).toUpperCase()}`, createdAt: now, updatedAt: now };
  persist([machine, ...listMachines()]); return machine;
}

export function registerMachineUsage(id: string, hours: number, fuelLiters: number) {
  if (!Number.isFinite(hours) || hours <= 0 || !Number.isFinite(fuelLiters) || fuelLiters < 0) throw new Error("Informe horas e combustível válidos.");
  const machines = listMachines().map((machine) => machine.id === id ? { ...machine, currentHours: Number((machine.currentHours + hours).toFixed(2)), fuelConsumedLiters: Number((machine.fuelConsumedLiters + fuelLiters).toFixed(2)), updatedAt: new Date().toISOString() } : machine);
  persist(machines); return machines;
}

export function completeMachineMaintenance(id: string, today: string, nextDate: string, nextHours: number | null) {
  const machines = listMachines().map((machine) => machine.id === id ? { ...machine, status: "active" as const, lastMaintenanceDate: today, nextMaintenanceDate: nextDate, nextMaintenanceHours: nextHours, updatedAt: new Date().toISOString() } : machine);
  persist(machines); return machines;
}

export function deleteMachine(id: string) { const machines = listMachines().filter((machine) => machine.id !== id); persist(machines); return machines; }
