import type { FieldEnvironmentProfile } from "../../features/environment/types/environment";
import type { EngineRecommendation, EngineResult } from "../core/types";

const requiredKeys: Array<keyof FieldEnvironmentProfile> = [
  "altitude_m",
  "soil_texture",
  "soil_ph",
  "drainage",
  "water_available",
  "annual_rainfall_mm",
  "min_temperature_c",
  "max_temperature_c",
  "chill_hours",
  "frost_risk",
  "fire_risk",
];

export function evaluateEnvironment(
  profile: FieldEnvironmentProfile | null,
  fieldId?: string,
  fieldName?: string,
): EngineResult<EngineRecommendation[]> {
  if (!profile) {
    return {
      generatedAt: new Date().toISOString(),
      confidence: 20,
      warnings: ["Perfil ambiental inexistente."],
      data: [
        {
          id: `environment-missing-${fieldId ?? "unknown"}`,
          category: "data_quality",
          priority: "high",
          title: "Perfil ambiental por preencher",
          description: "Complete os dados do solo, clima e água para ativar recomendações mais precisas.",
          reason: "Sem perfil ambiental, os restantes motores trabalham com baixa confiança.",
          confidence: 20,
          fieldId,
          fieldName,
          actionLabel: "Preencher perfil",
        },
      ],
    };
  }

  const known = requiredKeys.filter((key) => {
    const value = profile[key];
    return value !== null && value !== undefined && value !== "unknown";
  }).length;
  const completeness = Math.round((known / requiredKeys.length) * 100);
  const recommendations: EngineRecommendation[] = [];

  if (completeness < 70) {
    recommendations.push({
      id: `environment-incomplete-${profile.field_id}`,
      category: "data_quality",
      priority: completeness < 45 ? "high" : "moderate",
      title: "Perfil ambiental incompleto",
      description: `Apenas ${completeness}% dos dados essenciais estão preenchidos.`,
      reason: "Mais dados aumentam a qualidade das análises de culturas, rega e riscos.",
      confidence: completeness,
      fieldId: profile.field_id,
      fieldName,
      actionLabel: "Completar dados",
    });
  }

  if (profile.fire_risk === "high" || profile.fire_risk === "very_high") {
    recommendations.push({
      id: `fire-risk-${profile.field_id}`,
      category: "risk",
      priority: profile.fire_risk === "very_high" ? "critical" : "high",
      title: "Risco de incêndio exige atenção",
      description: "Reveja pontos de água, acessos e operações que possam gerar faíscas.",
      reason: `O perfil ambiental indica risco ${profile.fire_risk === "very_high" ? "muito elevado" : "elevado"}.`,
      confidence: Math.max(60, profile.data_confidence),
      fieldId: profile.field_id,
      fieldName,
      actionLabel: "Ver medidas preventivas",
    });
  }

  if (profile.frost_risk === "high" || profile.frost_risk === "very_high") {
    recommendations.push({
      id: `frost-risk-${profile.field_id}`,
      category: "risk",
      priority: "high",
      title: "Risco de geada relevante",
      description: "Considere variedades resistentes e medidas de proteção durante fases sensíveis.",
      reason: "O risco de geada registado pode limitar culturas de floração precoce.",
      confidence: Math.max(55, profile.data_confidence),
      fieldId: profile.field_id,
      fieldName,
      actionLabel: "Analisar culturas",
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    confidence: Math.max(completeness, profile.data_confidence),
    warnings: completeness < 50 ? ["A análise ambiental tem poucos dados confirmados."] : [],
    data: recommendations,
  };
}
