import type { FieldDiaryDraft, FieldDiaryEntry } from "../types/fieldDiary";

const STORAGE_KEY = "farpha.field-diary.v1";
export function listFieldDiaryEntries(): FieldDiaryEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return [];
  try { return JSON.parse(raw) as FieldDiaryEntry[]; } catch { localStorage.setItem(STORAGE_KEY, "[]"); return []; }
}
function persist(entries: FieldDiaryEntry[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }
export function createFieldDiaryEntry(draft: FieldDiaryDraft) { const entry: FieldDiaryEntry = { ...draft, id: `DIA-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString() }; persist([entry, ...listFieldDiaryEntries()]); return entry; }
export function deleteFieldDiaryEntry(id: string) { const entries = listFieldDiaryEntries().filter((entry) => entry.id !== id); persist(entries); return entries; }
