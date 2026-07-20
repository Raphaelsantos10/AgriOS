export type AgriculturalCostCategory = "labor" | "water" | "fuel" | "product" | "machine" | "other";

export type AgriculturalCost = {
  id: string;
  farm: string;
  field: string;
  category: AgriculturalCostCategory;
  description: string;
  date: string;
  quantity: number;
  unit: string;
  unitCost: number;
  notes: string;
  createdAt: string;
};

export type AgriculturalCostDraft = Omit<AgriculturalCost, "id" | "createdAt">;
