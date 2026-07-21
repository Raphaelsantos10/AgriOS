import type { AgriculturalTreatment, AgriculturalTreatmentDraft } from "../types/treatment";

export function addCalendarDays(date: string, days: number): string {
  if (!date) return ""; const value = new Date(`${date}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + Math.max(0, Math.trunc(days))); return value.toISOString().slice(0, 10);
}

export function assessTreatment(draft: AgriculturalTreatmentDraft, today: string) {
  const errors: string[] = []; const warnings: string[] = [];
  if (!draft.date || !draft.farm.trim() || !draft.field.trim() || !draft.crop.trim()) errors.push("Data, exploração, talhão e cultura são obrigatórios.");
  if (!draft.applicator.trim() || !draft.productName.trim()) errors.push("Aplicador e produto são obrigatórios.");
  if (!(draft.areaHectares > 0) || !(draft.dose > 0) || !draft.doseUnit.trim() || !(draft.totalQuantity > 0)) errors.push("Área, dose, unidade e quantidade total devem ser válidas.");
  if (draft.kind === "plant_protection") {
    if (!draft.applicatorCard.trim()) errors.push("Indique o cartão ou habilitação do aplicador.");
    if (!draft.authorizationNumber.trim()) errors.push("Indique o número de autorização do produto.");
    if (!draft.equipment.trim()) errors.push("Indique o equipamento de aplicação.");
    if (!draft.weather.trim()) errors.push("Registe as condições observadas durante a aplicação.");
    if (draft.safetyIntervalDays < 0 || !Number.isFinite(draft.safetyIntervalDays)) errors.push("O intervalo de segurança deve ser zero ou superior.");
    if (draft.applicatorCardExpiry && draft.applicatorCardExpiry < today) warnings.push("A habilitação do aplicador aparece expirada; confirme antes da aplicação.");
    if (!draft.applicatorCardExpiry) warnings.push("Validade da habilitação do aplicador não indicada.");
    if (draft.equipmentInspectionExpiry && draft.equipmentInspectionExpiry < today) warnings.push("A inspeção do equipamento aparece expirada; confirme antes da aplicação.");
    if (!draft.equipmentInspectionExpiry) warnings.push("Validade da inspeção do equipamento não indicada.");
  }
  return { valid: errors.length === 0, errors, warnings };
}

export function harvestRestriction(record: Pick<AgriculturalTreatment, "kind" | "harvestAllowedFrom">, today: string): "active" | "elapsed" | "not_applicable" {
  if (record.kind !== "plant_protection" || !record.harvestAllowedFrom) return "not_applicable";
  return today < record.harvestAllowedFrom ? "active" : "elapsed";
}

export function summarizeTreatments(records: AgriculturalTreatment[], today: string) {
  return { total: records.length, plantProtection: records.filter((item) => item.kind === "plant_protection").length, fertilization: records.filter((item) => item.kind === "fertilization").length, activeRestrictions: records.filter((item) => harvestRestriction(item, today) === "active").length };
}
