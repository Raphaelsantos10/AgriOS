import { supabase } from "../../../services/supabase";
import type { AnalyticsRawData } from "../types/analytics";

export async function getAnalyticsData(): Promise<AnalyticsRawData> {
  const [farmsResult, fieldsResult, missionsResult] = await Promise.all([
    supabase.from("farms").select("*").order("created_at", { ascending: false }),
    supabase.from("fields").select("*").order("created_at", { ascending: false }),
    supabase.from("missions").select("*").order("created_at", { ascending: false }),
  ]);

  if (farmsResult.error) throw farmsResult.error;
  if (fieldsResult.error) throw fieldsResult.error;
  if (missionsResult.error) throw missionsResult.error;

  return {
    farms: farmsResult.data ?? [],
    fields: fieldsResult.data ?? [],
    missions: missionsResult.data ?? [],
  } as AnalyticsRawData;
}
