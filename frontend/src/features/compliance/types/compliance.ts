export type ComplianceProfile = {
  holderName: string;
  municipality: string;
  professionalActivity: boolean;
  receivesSupport: boolean;
  sellsProduction: boolean;
  usesProfessionalPlantProtection: boolean;
  capturesWater: boolean;
  hasLivestock: boolean;
  hasWorkers: boolean;
  integratedProduction: boolean;
  updatedAt: string;
};

export type ObligationStatus = "applicable" | "review" | "not_applicable";

export type ComplianceObligation = {
  id: string;
  area: string;
  title: string;
  description: string;
  authority: string;
  sourceUrl: string;
  sourceCheckedAt: string;
  status: ObligationStatus;
  reason: string;
};

export type ComplianceSummary = Record<ObligationStatus, number>;

export type TrackingStatus = "pending" | "in_progress" | "completed" | "not_applicable";

export type ObligationTracking = {
  obligationId: string;
  status: TrackingStatus;
  dueDate: string;
  responsible: string;
  notes: string;
  confirmedAt: string;
  updatedAt: string;
};
