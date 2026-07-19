import { supabase } from "../../../services/supabase";
import type {
  IrrigationEvent,
  IrrigationEventInput,
  IrrigationSystem,
  IrrigationSystemInput,
} from "../types/irrigation";

export async function getIrrigationSystem(fieldId: string) {
  const { data, error } = await supabase
    .from("irrigation_systems")
    .select("*")
    .eq("field_id", fieldId)
    .maybeSingle();

  if (error) throw error;
  return data as IrrigationSystem | null;
}

export async function saveIrrigationSystem(input: IrrigationSystemInput) {
  const { data, error } = await supabase
    .from("irrigation_systems")
    .upsert(input, { onConflict: "field_id" })
    .select()
    .single();

  if (error) throw error;
  return data as IrrigationSystem;
}

export async function getIrrigationEvents(fieldId: string) {
  const { data, error } = await supabase
    .from("irrigation_events")
    .select("*")
    .eq("field_id", fieldId)
    .order("started_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return (data ?? []) as IrrigationEvent[];
}

export async function createIrrigationEvent(input: IrrigationEventInput) {
  const { data, error } = await supabase
    .from("irrigation_events")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as IrrigationEvent;
}
