import { supabase } from "../../../services/supabase";
import type { Farm } from "../types/farm";

export type FarmInput = Omit<Farm, "id" | "created_at">;

export async function getFarms(): Promise<Farm[]> {
  const { data, error } = await supabase
    .from("farms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as Farm[];
}

export async function getFarmById(id: string): Promise<Farm> {
  const { data, error } = await supabase
    .from("farms")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as Farm;
}

export async function createFarm(farm: FarmInput): Promise<Farm> {
  const { data, error } = await supabase
    .from("farms")
    .insert({
      name: farm.name,
      owner: farm.owner,
      area: farm.area,
      crop: farm.crop,
      latitude: farm.latitude,
      longitude: farm.longitude,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Farm;
}

export async function updateFarm(farm: Farm): Promise<Farm> {
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

  if (error) {
    throw error;
  }

  return data as Farm;
}

export async function deleteFarm(farmId: string): Promise<void> {
  const { error } = await supabase
    .from("farms")
    .delete()
    .eq("id", farmId);

  if (error) {
    throw error;
  }
}