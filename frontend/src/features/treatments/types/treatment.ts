export type TreatmentKind = "plant_protection" | "fertilization";

export type AgriculturalTreatment = {
  id: string;
  kind: TreatmentKind;
  date: string;
  farm: string;
  field: string;
  crop: string;
  areaHectares: number;
  applicator: string;
  applicatorCard: string;
  applicatorCardExpiry: string;
  productName: string;
  inventoryProductId: string;
  authorizationNumber: string;
  dose: number;
  doseUnit: string;
  totalQuantity: number;
  equipment: string;
  machineId: string;
  equipmentInspectionExpiry: string;
  weather: string;
  safetyIntervalDays: number;
  harvestAllowedFrom: string;
  notes: string;
  createdAt: string;
};

export type AgriculturalTreatmentDraft = Omit<AgriculturalTreatment, "id" | "harvestAllowedFrom" | "createdAt">;
