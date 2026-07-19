export type CropCategory =
  | "fruit_tree"
  | "vineyard"
  | "cereal"
  | "horticulture"
  | "forest"
  | "aromatic"
  | "other";

export type CropSourceType = "catalog" | "custom";

export type CropProfile = {
  min?: number;
  max?: number;
  unit?: string;
  notes?: string;
};

export type Crop = {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string | null;
  category: CropCategory;
  aliases: string[];
  recommendedRegions: string[];
  description: string | null;
  climateProfile: Record<string, CropProfile | string | number | boolean>;
  soilProfile: Record<string, CropProfile | string | number | boolean>;
  waterProfile: Record<string, CropProfile | string | number | boolean>;
  frostTolerance: "low" | "medium" | "high" | null;
  heatTolerance: "low" | "medium" | "high" | null;
  sourceType: CropSourceType;
  createdAt: string;
};

export type CreateCustomCropInput = {
  commonName: string;
  scientificName?: string;
  category: CropCategory;
  region?: string;
  description?: string;
};

export const cropCategoryLabels: Record<CropCategory, string> = {
  fruit_tree: "Fruteiras",
  vineyard: "Vinha",
  cereal: "Cereais",
  horticulture: "Hortícolas",
  forest: "Florestais",
  aromatic: "Aromáticas",
  other: "Outras",
};
