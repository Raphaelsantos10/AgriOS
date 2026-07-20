import type { Farm } from "../types/farm";
import type { Field } from "../../fields/types/field";
import type { FieldModuleCoverage } from "./farmOverview";

export type AlertSeverity = "critical" | "warning" | "info";
export type AgriculturalAlert = {
  id: string;
  fieldId: string;
  fieldName: string;
  category: "Talhão" | "Incêndio" | "Rega" | "Ambiente" | "Clima";
  severity: AlertSeverity;
  title: string;
  action: string;
  source: "Supabase" | "Diagnóstico calculado";
};

export function buildAgriculturalAlerts(fields: Field[], coverage: FieldModuleCoverage[]) {
  const byField = new Map(coverage.map((item) => [item.fieldId, item]));
  const alerts: AgriculturalAlert[] = [];

  fields.forEach((field) => {
    const item = byField.get(field.id);
    if (field.status === "critical") alerts.push({
      id: `${field.id}-critical`, fieldId: field.id, fieldName: field.name, category: "Talhão", severity: "critical",
      title: "Talhão em estado crítico", action: "Inspecionar o talhão e registar a intervenção prioritária.", source: "Supabase",
    });
    if (field.status === "attention") alerts.push({
      id: `${field.id}-attention`, fieldId: field.id, fieldName: field.name, category: "Talhão", severity: "warning",
      title: "Talhão requer atenção", action: "Rever os indicadores e acompanhar a evolução.", source: "Supabase",
    });
    if (item?.fireRiskLevel === "high" || item?.fireRiskLevel === "very_high" || item?.fireRiskLevel === "critical") alerts.push({
      id: `${field.id}-fire`, fieldId: field.id, fieldName: field.name, category: "Incêndio", severity: "critical",
      title: `Risco de incêndio ${item.fireRiskLevel}`, action: "Aplicar o plano preventivo e seguir as indicações das autoridades.", source: "Supabase",
    });
    if (!item?.irrigation) alerts.push({
      id: `${field.id}-irrigation-missing`, fieldId: field.id, fieldName: field.name, category: "Rega", severity: "warning",
      title: "Sistema de rega não configurado", action: "Configurar a rega para permitir recomendações operacionais.", source: "Diagnóstico calculado",
    });
    else if (item.irrigationActive === false) alerts.push({
      id: `${field.id}-irrigation-inactive`, fieldId: field.id, fieldName: field.name, category: "Rega", severity: "warning",
      title: "Sistema de rega inativo", action: "Confirmar se a desativação é intencional.", source: "Supabase",
    });
    if (item?.reservoirLevelPercent !== null && item?.reservoirLevelPercent !== undefined && item.reservoirLevelPercent <= 20) alerts.push({
      id: `${field.id}-reservoir`, fieldId: field.id, fieldName: field.name, category: "Rega", severity: "critical",
      title: `Reservatório em ${item.reservoirLevelPercent}%`, action: "Verificar o abastecimento antes da próxima rega.", source: "Supabase",
    });
    if (!item?.environment) alerts.push({
      id: `${field.id}-environment`, fieldId: field.id, fieldName: field.name, category: "Ambiente", severity: "warning",
      title: "Perfil ambiental incompleto", action: "Preencher solo, relevo, água e riscos do talhão.", source: "Diagnóstico calculado",
    });
    else if (item.climateComplete === false) alerts.push({
      id: `${field.id}-climate`, fieldId: field.id, fieldName: field.name, category: "Clima", severity: "info",
      title: "Dados climáticos incompletos", action: "Completar chuva, humidade e temperaturas no perfil ambiental.", source: "Diagnóstico calculado",
    });
    if (!item?.fireAssessment) alerts.push({
      id: `${field.id}-fire-missing`, fieldId: field.id, fieldName: field.name, category: "Incêndio", severity: "info",
      title: "Risco de incêndio ainda não avaliado", action: "Executar uma avaliação antes do período de maior risco.", source: "Diagnóstico calculado",
    });
  });

  const order: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };
  return alerts.sort((a, b) => order[a.severity] - order[b.severity] || a.fieldName.localeCompare(b.fieldName));
}

const severityLabels: Record<AlertSeverity, string> = { critical: "Crítico", warning: "Atenção", info: "Informativo" };
const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`;

export function buildAgriculturalAlertsCsv(farm: Farm, alerts: AgriculturalAlert[], generatedAt: string) {
  const rows = alerts.length ? alerts.map((alert) => [
    farm.name, alert.fieldName, alert.category, severityLabels[alert.severity], alert.title, alert.action, alert.source, generatedAt,
  ]) : [[farm.name, "—", "Exploração", "Informativo", "Sem alertas ativos", "Continuar a monitorização.", "Diagnóstico calculado", generatedAt]];
  return [["Exploração", "Talhão", "Categoria", "Severidade", "Alerta", "Ação recomendada", "Origem", "Gerado em"], ...rows]
    .map((row) => row.map(escapeCsv).join(";"))
    .join("\r\n");
}

export function downloadAgriculturalAlertsCsv(farm: Farm, alerts: AgriculturalAlert[], generatedAt: string) {
  const blob = new Blob([`\uFEFF${buildAgriculturalAlertsCsv(farm, alerts, generatedAt)}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeName = farm.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "exploracao";
  anchor.href = url;
  anchor.download = `farpha-alertas-${safeName}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
