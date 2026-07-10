import { supabase } from "../../../services/supabase";
import type { Farm } from "../types/farm";

export async function getFarms() {
  const { data, error } = await supabase
    .from("farms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Farm[];
}

export async function getFarmById(id: string) {
  const { data, error } = await supabase
    .from("farms")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Farm;
}

export async function createFarm(farm: Farm) {
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

  if (error) throw error;

  return data as Farm;
}