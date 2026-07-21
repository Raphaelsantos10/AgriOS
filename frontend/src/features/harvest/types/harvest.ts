export type HarvestQuantityUnit = "kg" | "t";
export type HarvestQuality = "premium" | "first" | "second" | "industrial" | "unclassified";

export type HarvestRecord = {
  id: string;
  campaign: string;
  farm: string;
  field: string;
  crop: string;
  harvestDate: string;
  harvestedAreaHa: number;
  grossQuantity: number;
  marketableQuantity: number;
  unit: HarvestQuantityUnit;
  quality: HarvestQuality;
  destination: string;
  notes: string;
  lotCode?: string;
  hygieneChecked?: boolean;
  containersClean?: boolean;
  contaminationIncident?: boolean;
  incidentNotes?: string;
  safetyStatus?: "pending" | "released" | "blocked";
  releasedBy?: string;
  safetyEvidenceReference?: string;
  createdAt: string;
};

export type HarvestDraft = Omit<HarvestRecord, "id" | "createdAt">;
