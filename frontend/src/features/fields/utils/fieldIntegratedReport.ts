import type { FieldEnvironmentProfile } from "../../environment/types/environment";
import type { FireRiskAssessment } from "../../fire/types/fire";
import type { Farm } from "../../farms/types/farm";
import type { IrrigationEvent, IrrigationSystem } from "../../irrigation/types/irrigation";
import type { Field } from "../types/field";

export type FieldIntegratedReportInput = {
  farm: Farm;
  field: Field;
  environment: FieldEnvironmentProfile | null;
  irrigationSystem: IrrigationSystem | null;
  irrigationEvents: IrrigationEvent[];
  fireAssessment: FireRiskAssessment | null;
  generatedAt: string;
};

const statusLabels: Record<Field["status"], string> = {
  healthy: "Saudável",
  attention: "Atenção",
  critical: "Crítico",
};

const yesNo = (value: boolean) => (value ? "Sim" : "Não");
const available = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === "" ? "Não disponível" : value;
const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

export function buildFieldIntegratedReportCsv(input: FieldIntegratedReportInput) {
  const { farm, field, environment, irrigationSystem, irrigationEvents, fireAssessment } = input;
  const ring = field.geometry?.coordinates[0] ?? [];
  const vertices = ring.length > 1 ? ring.length - 1 : ring.length;
  const totalVolume = irrigationEvents.reduce((sum, event) => sum + event.volume_m3, 0);
  const totalMinutes = irrigationEvents.reduce((sum, event) => sum + event.duration_minutes, 0);
  const latestEvent = irrigationEvents[0];

  const rows: Array<[string, string, string | number]> = [
    ["Identificação", "Aplicação", "FARPHA 2.1.0"],
    ["Identificação", "Exploração", farm.name],
    ["Identificação", "Proprietário", farm.owner || "Não disponível"],
    ["Talhão", "Nome", field.name],
    ["Talhão", "Cultura", field.crop || "Não definida"],
    ["Talhão", "Estado", statusLabels[field.status]],
    ["Geometria", "Área (ha)", Number(field.area) || 0],
    ["Geometria", "Polígono disponível", yesNo(Boolean(field.geometry))],
    ["Geometria", "Vértices", vertices],
    ["Ambiente", "Perfil disponível", yesNo(Boolean(environment))],
    ["Ambiente", "Altitude (m)", available(environment?.altitude_m)],
    ["Ambiente", "Declive (%)", available(environment?.slope_percent)],
    ["Ambiente", "pH do solo", available(environment?.soil_ph)],
    ["Ambiente", "Água disponível", environment ? yesNo(environment.water_available) : "Não disponível"],
    ["Ambiente", "Confiança (%)", available(environment?.data_confidence)],
    ["Rega", "Sistema disponível", yesNo(Boolean(irrigationSystem))],
    ["Rega", "Sistema", available(irrigationSystem?.name)],
    ["Rega", "Ativo", irrigationSystem ? yesNo(irrigationSystem.active) : "Não disponível"],
    ["Rega", "Eficiência (%)", available(irrigationSystem?.efficiency_percent)],
    ["Histórico de rega", "Eventos considerados", irrigationEvents.length],
    ["Histórico de rega", "Duração total (min)", totalMinutes],
    ["Histórico de rega", "Volume total (m³)", Number(totalVolume.toFixed(3))],
    ["Histórico de rega", "Última rega", available(latestEvent?.started_at)],
    ["Incêndio", "Avaliação disponível", yesNo(Boolean(fireAssessment))],
    ["Incêndio", "Nível de risco", available(fireAssessment?.risk_level)],
    ["Incêndio", "Pontuação", available(fireAssessment?.risk_score)],
    ["Incêndio", "Confiança (%)", available(fireAssessment?.confidence)],
    ["Relatório", "Gerado em", input.generatedAt],
  ];

  return [["Secção", "Campo", "Valor"], ...rows]
    .map((row) => row.map(escapeCsv).join(";"))
    .join("\r\n");
}

export function downloadFieldIntegratedReport(input: FieldIntegratedReportInput) {
  const csv = `\uFEFF${buildFieldIntegratedReportCsv(input)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeName = input.field.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "talhao";

  anchor.href = url;
  anchor.download = `farpha-relatorio-integrado-${safeName}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
