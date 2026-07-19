import type { Crop } from "../../features/crops/types/crop";
import type { FieldEnvironmentInput } from "../../features/environment/types/environment";
import { calculateCropSuitability } from "../../features/suitability/utils/calculateSuitability";
import type { EngineRecommendation, EngineResult } from "../core/types";

export function evaluateCrops(
  crops: Crop[],
  environment: FieldEnvironmentInput | null,
  fieldId?: string,
  fieldName?: string,
): EngineResult<EngineRecommendation[]> {
  if (!environment || crops.length === 0) {
    return {
      generatedAt: new Date().toISOString(),
      confidence: 0,
      warnings: ["Não existem dados suficientes para avaliar culturas."],
      data: [],
    };
  }

  const ranked = crops
    .map((crop) => calculateCropSuitability(crop, environment))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const data = ranked.map<EngineRecommendation>((result, index) => ({
    id: `crop-${fieldId ?? "unknown"}-${result.crop.id}`,
    category: "crop",
    priority: index === 0 && result.score >= 80 ? "low" : "moderate",
    title: `${result.crop.commonName}: ${result.score}% de compatibilidade`,
    description:
      result.scoreWithIrrigation > result.score + 5
        ? `Com rega, a compatibilidade pode subir para ${result.scoreWithIrrigation}%.`
        : result.strengths[0] ?? "Compatibilidade calculada com os dados ambientais disponíveis.",
    reason: result.warnings[0] ?? result.strengths[0] ?? "Comparação entre requisitos da cultura e perfil do talhão.",
    confidence: result.confidence,
    fieldId,
    fieldName,
    actionLabel: "Ver análise",
  }));

  return {
    generatedAt: new Date().toISOString(),
    confidence: ranked.length ? Math.round(ranked.reduce((sum, item) => sum + item.confidence, 0) / ranked.length) : 0,
    warnings: [],
    data,
  };
}
