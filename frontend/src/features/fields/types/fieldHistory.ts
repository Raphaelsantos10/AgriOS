import type { FieldStatus, PolygonGeometry } from "./field";

export type FieldHistoryChangeType =
  | "CREATE"
  | "UPDATE"
  | "GEOMETRY"
  | "SPLIT"
  | "MERGE"
  | "DELETE"
  | "IMPORT"
  | "RESTORE";

export interface FieldHistory {
  id: string;
  field_id: string | null;
  farm_id: string;
  field_name: string;
  crop: string;
  area: number;
  status: FieldStatus;
  geometry: PolygonGeometry | null;
  change_type: FieldHistoryChangeType;
  change_note: string | null;
  created_by: string | null;
  created_at: string;
}
