import type { OperationalDataSource } from "../../shared/operationalDataSource";
import { unwrapRepositoryResult } from "../../../repositories/core/types";
import { agriculturalCostRepository } from "../../../repositories/costs/agriculturalCostRepository";
import type { AgriculturalCostDraft } from "../types/agriculturalCost";
import {
  clearLocalAgriculturalCosts, createAgriculturalCost as createLocal,
  deleteAgriculturalCost as deleteLocal, listAgriculturalCosts as listLocal,
} from "./agriculturalCostStorage";

export const agriculturalCostService = {
  async list(source: OperationalDataSource) {
    return source === "supabase" ? unwrapRepositoryResult(await agriculturalCostRepository.list()) : listLocal();
  },
  async create(source: OperationalDataSource, draft: AgriculturalCostDraft) {
    return source === "supabase" ? unwrapRepositoryResult(await agriculturalCostRepository.create(draft)) : createLocal(draft);
  },
  async remove(source: OperationalDataSource, id: string) {
    if (source === "supabase") { unwrapRepositoryResult(await agriculturalCostRepository.remove(id)); return; }
    deleteLocal(id);
  },
  localCount() { return listLocal().length; },
  async migrateLocalToSupabase() {
    const costs = listLocal();
    for (const cost of costs) unwrapRepositoryResult(await agriculturalCostRepository.create(cost, cost.id));
    clearLocalAgriculturalCosts();
    return costs.length;
  },
};
