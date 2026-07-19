import { unwrapRepositoryResult } from "../../../repositories/core/types";
import {
  fieldRepository,
  type CreateFieldInput,
} from "../../../repositories/fields/fieldRepository";
import type { Field } from "../types/field";

export async function getFieldsByFarm(farmId: string): Promise<Field[]> {
  return unwrapRepositoryResult(await fieldRepository.listByFarm(farmId));
}

export async function getFieldById(fieldId: string): Promise<Field> {
  return unwrapRepositoryResult(await fieldRepository.getById(fieldId));
}

export async function createField(field: CreateFieldInput): Promise<Field> {
  return unwrapRepositoryResult(await fieldRepository.create(field));
}

export async function updateField(field: Field): Promise<Field> {
  return unwrapRepositoryResult(await fieldRepository.update(field));
}

export async function deleteField(fieldId: string): Promise<void> {
  unwrapRepositoryResult(await fieldRepository.remove(fieldId));
}
