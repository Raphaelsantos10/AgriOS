import { supabase } from "../../../services/supabase";
import type { FireRiskAssessment, FireRiskAssessmentInput } from "../types/fire";

export async function getLatestFireAssessment(fieldId: string) {
  const { data, error } = await supabase
    .from("fire_risk_assessments")
    .select("*")
    .eq("field_id", fieldId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as FireRiskAssessment | null;
}

export async function getFireAssessmentHistory(fieldId: string) {
  const { data, error } = await supabase
    .from("fire_risk_assessments")
    .select("*")
    .eq("field_id", fieldId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return (data ?? []) as FireRiskAssessment[];
}

export async function saveFireAssessment(input: FireRiskAssessmentInput) {
  const { data, error } = await supabase
    .from("fire_risk_assessments")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as FireRiskAssessment;
}
