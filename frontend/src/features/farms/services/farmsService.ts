import { farmRepository } from "../../../repositories/farms/farmRepository";
import { unwrapRepositoryResult } from "../../../repositories/core/types";
import type { Farm } from "../types/farm";

export type FarmInput = Omit<Farm, "id" | "created_at">;

export async function getFarms(): Promise<Farm[]> {
  return unwrapRepositoryResult(await farmRepository.list());
}

export async function getFarmById(id: string): Promise<Farm> {
  return unwrapRepositoryResult(await farmRepository.getById(id));
}

export async function createFarm(farm: FarmInput): Promise<Farm> {
  return unwrapRepositoryResult(await farmRepository.create(farm));
}

export async function updateFarm(farm: Farm): Promise<Farm> {
  return unwrapRepositoryResult(await farmRepository.update(farm));
}

export async function deleteFarm(farmId: string): Promise<void> {
  unwrapRepositoryResult(await farmRepository.remove(farmId));
}
