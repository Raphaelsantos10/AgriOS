export type IntelligencePriority = "critical" | "high" | "moderate" | "low";
export type IntelligenceCategory =
  | "irrigation"
  | "disease"
  | "nutrition"
  | "harvest"
  | "satellite"
  | "operations";

export type IntelligenceRecommendation = {
  id: string;
  title: string;
  summary: string;
  reason: string;
  action: string;
  category: IntelligenceCategory;
  priority: IntelligencePriority;
  confidence: number;
  fieldName: string;
  estimatedImpact: string;
  dueLabel: string;
  createdAt: string;
};

export type IntelligenceSnapshot = {
  generatedAt: string;
  confidence: number;
  decisionsToday: number;
  predictedSavings: number;
  yieldForecastTonnes: number;
  yieldConfidence: number;
  recommendations: IntelligenceRecommendation[];
  diseaseRisks: Array<{ name: string; probability: number; fieldName: string }>;
  irrigationPlan: Array<{ fieldName: string; start: string; durationMinutes: number; volumeM3: number }>;
};
