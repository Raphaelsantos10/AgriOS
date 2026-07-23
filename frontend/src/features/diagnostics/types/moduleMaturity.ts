export type ModuleMaturityStatus = "real" | "partial" | "demonstrative" | "planned";
export type ModulePersistence = "supabase" | "external-api" | "local" | "mixed" | "none";
export type ModuleValidation = "automated" | "partial" | "manual";

export type ModuleMaturity = {
  id: string;
  label: string;
  route: string | null;
  status: ModuleMaturityStatus;
  persistence: ModulePersistence;
  validation: ModuleValidation;
  source: string;
  evidence: string;
  limitation: string;
  nextStep: string;
};
