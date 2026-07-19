import type { Crop } from "../../crops/types/crop";

export type SuitabilityFactor = {
  id: string;
  label: string;
  score: number;
  weight: number;
  known: boolean;
  detail: string;
};

export type CropSuitabilityResult = {
  crop: Crop;
  score: number;
  scoreWithIrrigation: number;
  confidence: number;
  factors: SuitabilityFactor[];
  strengths: string[];
  warnings: string[];
};
