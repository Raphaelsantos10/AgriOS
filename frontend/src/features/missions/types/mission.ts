export type MissionPriority = "low" | "medium" | "high" | "critical";

export type MissionStatus =
  | "new"
  | "in_progress"
  | "paused"
  | "completed"
  | "cancelled";

export interface MissionChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Mission {
  id: string;
  farm_id: string;
  field_id: string | null;
  title: string;
  description: string | null;
  priority: MissionPriority;
  status: MissionStatus;
  assigned_to: string | null;
  start_date: string | null;
  end_date: string | null;
  completed_at: string | null;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
  checklist: MissionChecklistItem[];
  created_at: string;
  updated_at: string;
}

export type MissionInput = Omit<
  Mission,
  "id" | "created_at" | "updated_at" | "completed_at"
> & {
  completed_at?: string | null;
};
