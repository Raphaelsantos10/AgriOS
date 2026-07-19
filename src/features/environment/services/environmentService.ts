import { supabase } from "../../../services/supabase";
import type { FieldEnvironmentInput, FieldEnvironmentProfile } from "../types/environment";

export async function getEnvironmentProfile(fieldId: string) {
  const { data, error } = await supabase
    .from("field_environment_profiles")
    .select("*")
    .eq("field_id", fieldId)
    .maybeSingle();

  if (error) throw error;
  return data as FieldEnvironmentProfile | null;
}

export async function saveEnvironmentProfile(input: FieldEnvironmentInput) {
  const { data, error } = await supabase
    .from("field_environment_profiles")
    .upsert(input, { onConflict: "field_id" })
    .select()
    .single();

  if (error) throw error;
  return data as FieldEnvironmentProfile;
}
