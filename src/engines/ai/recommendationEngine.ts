import type { IntelligenceRecommendation } from "../../features/intelligence/types/intelligence";

const weight = { critical: 4, high: 3, moderate: 2, low: 1 } as const;

export function rankRecommendations(recommendations: IntelligenceRecommendation[]) {
  return [...recommendations].sort((a, b) => {
    const priorityDelta = weight[b.priority] - weight[a.priority];
    return priorityDelta || b.confidence - a.confidence;
  });
}

export function calculateOpportunityScore(recommendations: IntelligenceRecommendation[]) {
  if (!recommendations.length) return 100;
  const penalty = recommendations.reduce((total, item) => total + weight[item.priority] * (item.confidence / 100), 0);
  return Math.max(0, Math.round(100 - penalty * 4.2));
}
