import { supabase } from "../../../services/supabase";
import type {
  Mission,
  MissionInput,
  MissionStatus,
} from "../types/mission";

const missionSelect = "*";

export async function getMissions(): Promise<Mission[]> {
  const { data, error } = await supabase
    .from("missions")
    .select(missionSelect)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Mission[];
}

export async function createMission(input: MissionInput): Promise<Mission> {
  const { data, error } = await supabase
    .from("missions")
    .insert({
      farm_id: input.farm_id,
      field_id: input.field_id,
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: input.status,
      assigned_to: input.assigned_to,
      start_date: input.start_date,
      end_date: input.end_date,
      completed_at: input.completed_at ?? null,
      latitude: input.latitude,
      longitude: input.longitude,
      notes: input.notes,
      checklist: input.checklist,
    })
    .select(missionSelect)
    .single();

  if (error) throw error;
  return data as Mission;
}

export async function updateMission(mission: Mission): Promise<Mission> {
  const { data, error } = await supabase
    .from("missions")
    .update({
      farm_id: mission.farm_id,
      field_id: mission.field_id,
      title: mission.title,
      description: mission.description,
      priority: mission.priority,
      status: mission.status,
      assigned_to: mission.assigned_to,
      start_date: mission.start_date,
      end_date: mission.end_date,
      completed_at: mission.completed_at,
      latitude: mission.latitude,
      longitude: mission.longitude,
      notes: mission.notes,
      checklist: mission.checklist,
      updated_at: new Date().toISOString(),
    })
    .eq("id", mission.id)
    .select(missionSelect)
    .single();

  if (error) throw error;
  return data as Mission;
}

export async function updateMissionStatus(
  mission: Mission,
  status: MissionStatus,
): Promise<Mission> {
  return updateMission({
    ...mission,
    status,
    completed_at: status === "completed" ? new Date().toISOString() : null,
  });
}

export async function deleteMission(id: string): Promise<void> {
  const { error } = await supabase.from("missions").delete().eq("id", id);
  if (error) throw error;
}
