import type { FieldEnvironmentInput } from "../../features/environment/types/environment";
import type { Field } from "../../features/fields/types/field";
import type { IrrigationSystem } from "../../features/irrigation/types/irrigation";
import { calculateIrrigationRecommendation } from "../../features/irrigation/utils/irrigationCalculator";
import type { EngineRecommendation, EngineResult } from "../core/types";

export type IrrigationEngineInput = {
  field: Field;
  environment: FieldEnvironmentInput;
  system: IrrigationSystem | null;
  soilMoisturePercent?: number;
  forecastRainMm?: number;
};

export function evaluateIrrigation(input: IrrigationEngineInput): EngineResult<EngineRecommendation[]> {
  const recommendation = calculateIrrigationRecommendation(
    input.field,
    input.environment,
    input.system,
    input.soilMoisturePercent ?? 30,
    input.forecastRainMm ?? 0,
  );

  if (!recommendation.needsIrrigation) {
    return {
      generatedAt: new Date().toISOString(),
      confidence: recommendation.confidence,
      warnings: recommendation.warnings,
      data: [],
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    confidence: recommendation.confidence,
    warnings: recommendation.warnings,
    data: [
      {
        id: `irrigation-${input.field.id}`,
        category: "irrigation",
        priority: recommendation.priority,
        title: "Rega recomendada",
        description: `${recommendation.estimatedVolumeM3} m³ na janela ${recommendation.bestWindow}${recommendation.recommendedMinutes ? ` durante cerca de ${recommendation.recommendedMinutes} min` : ""}.`,
        reason: recommendation.reasons.join(" "),
        confidence: recommendation.confidence,
        fieldId: input.field.id,
        fieldName: input.field.name,
        actionLabel: "Abrir rega",
      },
    ],
  };
}
