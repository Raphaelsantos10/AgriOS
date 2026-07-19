import { supabase } from "../../services/supabase";
import type { FarmInput } from "../../features/farms/services/farmsService";
import type { Farm } from "../../features/farms/types/farm";
import type { RepositoryResult } from "../core/types";
import { toRepositoryError } from "../core/types";

export const farmRepository = {
  async list(): Promise<RepositoryResult<Farm[]>> {
    const { data, error } = await supabase
      .from("farms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: (data ?? []) as Farm[] };
  },

  async getById(id: string): Promise<RepositoryResult<Farm>> {
    const { data, error } = await supabase
      .from("farms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: data as Farm };
  },

  async create(input: FarmInput): Promise<RepositoryResult<Farm>> {
    const { data, error } = await supabase
      .from("farms")
      .insert({
        name: input.name,
        owner: input.owner,
        area: input.area,
        crop: input.crop,
        latitude: input.latitude,
        longitude: input.longitude,
      })
      .select()
      .single();

    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: data as Farm };
  },

  async update(farm: Farm): Promise<RepositoryResult<Farm>> {
    const { data, error } = await supabase
      .from("farms")
      .update({
        name: farm.name,
        owner: farm.owner,
        area: farm.area,
        crop: farm.crop,
        latitude: farm.latitude,
        longitude: farm.longitude,
      })
      .eq("id", farm.id)
      .select()
      .single();

    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: data as Farm };
  },

  async remove(id: string): Promise<RepositoryResult<void>> {
    const { error } = await supabase.from("farms").delete().eq("id", id);
    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: undefined };
  },
};
