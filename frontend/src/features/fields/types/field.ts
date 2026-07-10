export type FieldStatus = "healthy" | "attention" | "critical";

export type PolygonGeometry = {
  type: "Polygon";
  coordinates: number[][][];
};

export interface Field {
  id: string;
  farm_id: string;
  name: string;
  crop: string;
  area: number;
  status: FieldStatus;
  geometry: PolygonGeometry | null;
  created_at?: string;
}