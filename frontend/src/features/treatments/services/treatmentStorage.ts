import type { AgriculturalTreatment, AgriculturalTreatmentDraft } from "../types/treatment";
import { addCalendarDays } from "../utils/treatmentCompliance";

const STORAGE_KEY = "farpha.agricultural-treatments.v1";
export function listTreatments(): AgriculturalTreatment[] { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as AgriculturalTreatment[]; } catch { localStorage.setItem(STORAGE_KEY, "[]"); return []; } }
function persist(records: AgriculturalTreatment[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
export function createTreatment(draft: AgriculturalTreatmentDraft): AgriculturalTreatment { const record: AgriculturalTreatment = { ...draft, id: `TRT-${Date.now().toString(36).toUpperCase()}`, harvestAllowedFrom: draft.kind === "plant_protection" ? addCalendarDays(draft.date, draft.safetyIntervalDays) : "", createdAt: new Date().toISOString() }; persist([record, ...listTreatments()]); return record; }
export function deleteTreatment(id: string) { const records = listTreatments().filter((item) => item.id !== id); persist(records); return records; }
