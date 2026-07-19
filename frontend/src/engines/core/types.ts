export type EnginePriority = "low" | "moderate" | "high" | "critical";

export type EngineRecommendationCategory =
  | "environment"
  | "crop"
  | "irrigation"
  | "risk"
  | "data_quality";

export type EngineRecommendation = {
  id: string;
  category: EngineRecommendationCategory;
  priority: EnginePriority;
  title: string;
  description: string;
  reason: string;
  confidence: number;
  fieldId?: string;
  fieldName?: string;
  actionLabel?: string;
};

export type EngineResult<T> = {
  generatedAt: string;
  confidence: number;
  data: T;
  warnings: string[];
};
