export type InventoryCategory = "fertilizer" | "seed" | "phytosanitary" | "amendment" | "other";

export type InventoryProduct = {
  id: string;
  name: string;
  category: InventoryCategory;
  unit: string;
  currentStock: number;
  minimumStock: number;
  unitCost: number;
  supplier: string;
  batch: string;
  expiryDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type InventoryProductDraft = Omit<InventoryProduct, "id" | "createdAt" | "updatedAt">;
export type InventoryMovementType = "entry" | "exit";
