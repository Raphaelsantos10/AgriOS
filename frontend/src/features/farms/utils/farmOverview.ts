import type { Farm } from "../types/farm";
import type { Field } from "../../fields/types/field";

export type FieldModuleCoverage = {
  fieldId: string;
  environment: boolean;
  irrigation: boolean;
  fireAssessment: boolean;
  fireRiskLevel: string | null;
};

export type FarmOverview = {
  totalFields: number;
  totalArea: number;
  healthy: number;
  attention: number;
  critical: number;
  environmentConfigured: number;
  irrigationConfigured: number;
  fireAssessed: number;
  highFireRisk: number;
  priorities: string[];
};

export function buildFarmOverview(fields: Field[], coverage: FieldModuleCoverage[]): FarmOverview {
  const byField = new Map(coverage.map((item) => [item.fieldId, item]));
  const environmentConfigured = coverage.filter((item) => item.environment).length;
  const irrigationConfigured = coverage.filter((item) => item.irrigation).length;
  const fireAssessed = coverage.filter((item) => item.fireAssessment).length;
  const highFireRisk = coverage.filter((item) =>
    item.fireRiskLevel === "high" || item.fireRiskLevel === "very_high" || item.fireRiskLevel === "critical"
  ).length;
  const critical = fields.filter((field) => field.status === "critical").length;
  const attention = fields.filter((field) => field.status === "attention").length;
  const priorities: string[] = [];

  if (critical) priorities.push(`${critical} talhão(ões) em estado crítico`);
  if (highFireRisk) priorities.push(`${highFireRisk} talhão(ões) com risco elevado de incêndio`);
  const missingEnvironment = fields.filter((field) => !byField.get(field.id)?.environment).length;
  if (missingEnvironment) priorities.push(`${missingEnvironment} talhão(ões) sem perfil ambiental`);
  const missingIrrigation = fields.filter((field) => !byField.get(field.id)?.irrigation).length;
  if (missingIrrigation) priorities.push(`${missingIrrigation} talhão(ões) sem sistema de rega`);
  if (!priorities.length && fields.length) priorities.push("Exploração sem prioridades críticas identificadas");
  if (!fields.length) priorities.push("Cadastre o primeiro talhão para iniciar o diagnóstico");

  return {
    totalFields: fields.length,
    totalArea: Number(fields.reduce((sum, field) => sum + (Number(field.area) || 0), 0).toFixed(2)),
    healthy: fields.filter((field) => field.status === "healthy").length,
    attention,
    critical,
    environmentConfigured,
    irrigationConfigured,
    fireAssessed,
    highFireRisk,
    priorities,
  };
}

const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
const coverageLabel = (configured: boolean) => configured ? "Funcional — dados reais" : "Parcial — sem dados";

export function buildFarmOverviewCsv(
  farm: Farm,
  fields: Field[],
  coverage: FieldModuleCoverage[],
  generatedAt: string
) {
  const summary = buildFarmOverview(fields, coverage);
  const byField = new Map(coverage.map((item) => [item.fieldId, item]));
  const rows: Array<Array<string | number>> = [
    ["Resumo", "Exploração", farm.name, "Funcional — dados reais"],
    ["Resumo", "Talhões", summary.totalFields, "Funcional — dados reais"],
    ["Resumo", "Área total dos talhões (ha)", summary.totalArea, "Calculado"],
    ["Resumo", "Talhões críticos", summary.critical, "Calculado"],
    ["Resumo", "Gerado em", generatedAt, "Calculado"],
  ];

  fields.forEach((field) => {
    const item = byField.get(field.id);
    rows.push(
      [field.name, "Cadastro e geometria", field.geometry ? "Disponível" : "Sem geometria", field.geometry ? "Funcional — dados reais" : "Parcial — sem dados"],
      [field.name, "Perfil ambiental", item?.environment ? "Disponível" : "Não disponível", coverageLabel(Boolean(item?.environment))],
      [field.name, "Sistema de rega", item?.irrigation ? "Disponível" : "Não disponível", coverageLabel(Boolean(item?.irrigation))],
      [field.name, "Avaliação de incêndio", item?.fireAssessment ? item.fireRiskLevel || "Disponível" : "Não disponível", coverageLabel(Boolean(item?.fireAssessment))],
    );
  });

  summary.priorities.forEach((priority) => rows.push(["Prioridade", priority, "Ação recomendada", "Calculado"]));
  return [["Talhão/Secção", "Indicador", "Valor", "Classificação"], ...rows]
    .map((row) => row.map(escapeCsv).join(";"))
    .join("\r\n");
}

export function downloadFarmOverviewCsv(
  farm: Farm,
  fields: Field[],
  coverage: FieldModuleCoverage[],
  generatedAt: string
) {
  const csv = `\uFEFF${buildFarmOverviewCsv(farm, fields, coverage, generatedAt)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeName = farm.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "exploracao";
  anchor.href = url;
  anchor.download = `farpha-diagnostico-${safeName}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
