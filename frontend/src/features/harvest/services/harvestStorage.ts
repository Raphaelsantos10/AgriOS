import type { HarvestDraft, HarvestRecord } from "../types/harvest";
const STORAGE_KEY = "farpha.harvest.v1";
export function listHarvestRecords(): HarvestRecord[] { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return []; try { return JSON.parse(raw) as HarvestRecord[]; } catch { localStorage.setItem(STORAGE_KEY, "[]"); return []; } }
function persist(records: HarvestRecord[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
export function createHarvestRecord(draft: HarvestDraft) { const record: HarvestRecord = { ...draft, id: `COL-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString() }; persist([record, ...listHarvestRecords()]); return record; }
export function deleteHarvestRecord(id: string) { const records = listHarvestRecords().filter((record) => record.id !== id); persist(records); return records; }
