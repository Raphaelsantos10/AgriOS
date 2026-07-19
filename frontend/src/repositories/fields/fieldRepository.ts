import { supabase } from "../../services/supabase";
import type { Field } from "../../features/fields/types/field";
import type { RepositoryResult } from "../core/types";
import { toRepositoryError } from "../core/types";

export type CreateFieldInput = Omit<Field, "id" | "created_at">;

export const fieldRepository = {
  async listByFarm(farmId: string): Promise<RepositoryResult<Field[]>> {
    const { data, error } = await supabase
      .from("fields")
      .select("*")
      .eq("farm_id", farmId)
      .order("created_at", { ascending: false });

    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: (data ?? []) as Field[] };
  },

  async getById(id: string): Promise<RepositoryResult<Field>> {
    const { data, error } = await supabase
      .from("fields")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: data as Field };
  },

  async create(input: CreateFieldInput): Promise<RepositoryResult<Field>> {
    const { data, error } = await supabase
      .from("fields")
      .insert({
        farm_id: input.farm_id,
        name: input.name,
        crop: input.crop,
        area: input.area,
        status: input.status,
        geometry: input.geometry,
      })
      .select()
      .single();

    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: data as Field };
  },

  async update(field: Field): Promise<RepositoryResult<Field>> {
    const { data, error } = await supabase
      .from("fields")
      .update({
        name: field.name,
        crop: field.crop,
        area: field.area,
        status: field.status,
        geometry: field.geometry,
      })
      .eq("id", field.id)
      .select()
      .single();

    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: data as Field };
  },

  async remove(id: string): Promise<RepositoryResult<void>> {
    const { error } = await supabase.from("fields").delete().eq("id", id);
    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: undefined };
  },
};
