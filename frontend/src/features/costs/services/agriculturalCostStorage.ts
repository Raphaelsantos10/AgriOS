import type { AgriculturalCost, AgriculturalCostDraft } from "../types/agriculturalCost";

const STORAGE_KEY = "farpha.agricultural-costs.v1";

export function listAgriculturalCosts(): AgriculturalCost[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as AgriculturalCost[]; }
  catch { localStorage.setItem(STORAGE_KEY, "[]"); return []; }
}

function persist(costs: AgriculturalCost[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(costs)); }

export function clearLocalAgriculturalCosts() { localStorage.removeItem(STORAGE_KEY); }

export function createAgriculturalCost(draft: AgriculturalCostDraft) {
  const cost: AgriculturalCost = { ...draft, id: `CST-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString() };
  persist([cost, ...listAgriculturalCosts()]);
  return cost;
}

export function deleteAgriculturalCost(id: string) {
  const costs = listAgriculturalCosts().filter((cost) => cost.id !== id);
  persist(costs);
  return costs;
}
