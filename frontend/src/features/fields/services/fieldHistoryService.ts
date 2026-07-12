import { supabase } from "../../../services/supabase";
import type { Field } from "../types/field";
import type { FieldHistory, FieldHistoryChangeType } from "../types/fieldHistory";

export async function createFieldHistorySnapshot(
  field: Field,
  changeType: FieldHistoryChangeType,
  changeNote?: string
) {
  const { data, error } = await supabase
    .from("field_history")
    .insert({
      field_id: field.id,
      farm_id: field.farm_id,
      field_name: field.name,
      crop: field.crop,
      area: field.area,
      status: field.status,
      geometry: field.geometry,
      change_type: changeType,
      change_note: changeNote?.trim() || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as FieldHistory;
}

export async function getFieldHistory(fieldId: string) {
  const { data, error } = await supabase
    .from("field_history")
    .select("*")
    .eq("field_id", fieldId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as FieldHistory[];
}
