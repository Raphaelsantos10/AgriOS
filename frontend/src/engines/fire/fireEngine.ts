import type { EngineRecommendation, EngineResult } from "../core/types";
import { calculateFireRisk } from "./fireRiskCalculator";
import type { FireRiskInput } from "./types";

export function evaluateFireRisk(
  input: FireRiskInput,
  fieldId?: string,
  fieldName?: string,
): EngineResult<EngineRecommendation[]> {
  const assessment = calculateFireRisk(input);
  const recommendations: EngineRecommendation[] = [];

  if (assessment.level !== "low") {
    const priority = assessment.level === "extreme"
      ? "critical"
      : assessment.level === "very_high" || assessment.level === "high"
        ? "high"
        : "moderate";

    recommendations.push({
      id: `fire-engine-${fieldId ?? "unknown"}-${assessment.score}`,
      category: "risk",
      priority,
      title: `Risco de incêndio ${assessment.level === "very_high" ? "muito elevado" : assessment.level === "high" ? "elevado" : assessment.level === "moderate" ? "moderado" : assessment.level === "extreme" ? "extremo" : "baixo"}`,
      description: `Índice calculado: ${assessment.score}/100. ${assessment.recommendations[0] ?? "Rever medidas preventivas."}`,
      reason: assessment.factors
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((factor) => factor.explanation)
        .join(" "),
      confidence: assessment.confidence,
      fieldId,
      fieldName,
      actionLabel: "Abrir Fire Intelligence",
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    confidence: assessment.confidence,
    warnings: input.nearbyFireDistanceKm !== null && input.nearbyFireDistanceKm <= 10
      ? ["Uma ocorrência próxima deve ser confirmada em fontes oficiais."]
      : [],
    data: recommendations,
  };
}
