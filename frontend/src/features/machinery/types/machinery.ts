export type MachineCategory = "tractor" | "implement" | "harvester" | "sprayer" | "irrigation" | "vehicle" | "other";
export type MachineStatus = "active" | "maintenance" | "inactive";

export type Machine = {
  id: string;
  name: string;
  category: MachineCategory;
  brand: string;
  model: string;
  registration: string;
  status: MachineStatus;
  currentHours: number;
  fuelConsumedLiters: number;
  hourlyCost: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  nextMaintenanceHours: number | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type MachineDraft = Omit<Machine, "id" | "createdAt" | "updatedAt">;
