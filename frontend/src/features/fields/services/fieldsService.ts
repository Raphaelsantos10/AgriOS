import { supabase } from "../../../services/supabase";
import type { Field } from "../types/field";

export async function getFieldsByFarm(farmId: string) {
  const { data, error } = await supabase
    .from("fields")
    .select("*")
    .eq("farm_id", farmId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Field[];
}

export async function createField(field: Omit<Field, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("fields")
    .insert({
      farm_id: field.farm_id,
      name: field.name,
      crop: field.crop,
      area: field.area,
      status: field.status,
      geometry: field.geometry,
    })
    .select()
    .single();

  if (error) throw error;

  return data as Field;
}

export async function updateField(field: Field) {
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

  if (error) throw error;

  return data as Field;
}

export async function deleteField(fieldId: string) {
  const { error } = await supabase
    .from("fields")
    .delete()
    .eq("id", fieldId);

  if (error) throw error;
}