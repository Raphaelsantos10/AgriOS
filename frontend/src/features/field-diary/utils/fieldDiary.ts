import type { FieldDiaryActivity, FieldDiaryEntry } from "../types/fieldDiary";

export const diaryActivityLabels: Record<FieldDiaryActivity, string> = { soil_preparation: "Preparação do solo", inspection: "Inspeção", planting: "Plantação", irrigation: "Rega", fertilization: "Fertilização", spraying: "Pulverização", pruning: "Poda", harvest: "Colheita", maintenance: "Manutenção", observation: "Observação", other: "Outra" };
export function sortFieldDiary(entries: FieldDiaryEntry[]) { return [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)); }
export function summarizeFieldDiary(entries: FieldDiaryEntry[]) { return { entries: entries.length, fields: new Set(entries.map((entry) => `${entry.farm}::${entry.field}`)).size, photos: entries.filter((entry) => Boolean(entry.photoDataUrl)).length, latestDate: sortFieldDiary(entries)[0]?.date ?? null }; }
const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
export function buildFieldDiaryCsv(entries: FieldDiaryEntry[], generatedAt: string) { const rows = sortFieldDiary(entries).map((entry) => [entry.id, entry.date, entry.farm, entry.field, entry.crop || "Não definida", diaryActivityLabels[entry.activity], entry.title, entry.responsible, entry.product ?? "", entry.quantity ?? "", entry.unit ?? "", entry.equipment ?? "", entry.complianceObligationId ?? "", entry.evidenceReference ?? "", entry.weather, entry.notes, entry.photoName || "Sem fotografia", generatedAt]); return [["ID", "Data", "Exploração", "Talhão", "Cultura", "Atividade", "Título", "Responsável", "Produto/insumo", "Quantidade", "Unidade", "Equipamento", "Obrigação", "Evidência", "Condições", "Observações", "Fotografia", "Exportado em"], ...rows].map((row) => row.map(escapeCsv).join(";")).join("\r\n"); }
export function downloadFieldDiaryCsv(entries: FieldDiaryEntry[], generatedAt: string) { const blob = new Blob([`\uFEFF${buildFieldDiaryCsv(entries, generatedAt)}`], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "farpha-diario-talhao.csv"; anchor.click(); URL.revokeObjectURL(url); }

export type DiaryComplianceAssessment = { complete: boolean; missing: string[] };
export function assessDiaryCompliance(entry: Pick<FieldDiaryEntry, "activity" | "farm" | "field" | "date" | "title" | "responsible" | "complianceObligationId" | "product" | "quantity" | "unit" | "equipment">): DiaryComplianceAssessment {
  const missing: string[] = [];
  if (!entry.farm.trim()) missing.push("exploração"); if (!entry.field.trim()) missing.push("talhão"); if (!entry.date) missing.push("data"); if (!entry.title.trim()) missing.push("título"); if (!entry.responsible.trim()) missing.push("responsável"); if (!entry.complianceObligationId) missing.push("obrigação associada");
  if (["fertilization", "spraying"].includes(entry.activity)) { if (!entry.product?.trim()) missing.push("produto/insumo"); if (!entry.quantity?.trim()) missing.push("quantidade"); if (!entry.unit?.trim()) missing.push("unidade"); }
  if (entry.activity === "spraying" && !entry.equipment?.trim()) missing.push("equipamento");
  return { complete: missing.length === 0, missing };
}
