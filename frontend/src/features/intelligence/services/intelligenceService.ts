import { intelligenceSnapshotSeed } from "../data/intelligenceMockData";
import type { IntelligenceSnapshot } from "../types/intelligence";

const STORAGE_KEY = "farpha:intelligence:dismissed";

export async function loadIntelligenceSnapshot(): Promise<IntelligenceSnapshot> {
  await new Promise((resolve) => window.setTimeout(resolve, 350));
  const dismissed = new Set<string>(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
  return {
    ...intelligenceSnapshotSeed,
    generatedAt: new Date().toISOString(),
    recommendations: intelligenceSnapshotSeed.recommendations.filter((item) => !dismissed.has(item.id)),
  };
}

export function dismissRecommendation(id: string) {
  const dismissed = new Set<string>(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
  dismissed.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissed]));
}
