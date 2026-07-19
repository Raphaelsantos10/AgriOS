import type { EnginePriority, EngineRecommendation, EngineResult } from "../core/types";

const priorityRank: Record<EnginePriority, number> = {
  critical: 4,
  high: 3,
  moderate: 2,
  low: 1,
};

export function combineRecommendations(
  results: Array<EngineResult<EngineRecommendation[]>>,
  limit = 6,
): EngineResult<EngineRecommendation[]> {
  const recommendations = results
    .flatMap((result) => result.data)
    .sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority] || b.confidence - a.confidence)
    .slice(0, limit);

  const confidenceValues = results.map((result) => result.confidence).filter((value) => value > 0);
  const confidence = confidenceValues.length
    ? Math.round(confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length)
    : 0;

  return {
    generatedAt: new Date().toISOString(),
    confidence,
    warnings: results.flatMap((result) => result.warnings),
    data: recommendations,
  };
}
