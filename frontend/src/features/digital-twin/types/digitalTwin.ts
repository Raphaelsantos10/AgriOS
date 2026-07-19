export type DigitalTwinLayerId =
  | "fields"
  | "irrigation"
  | "fire"
  | "photos"
  | "biodiversity"
  | "sensors"
  | "machines"
  | "satellite";

export type DigitalTwinLayer = {
  id: DigitalTwinLayerId;
  label: string;
  description: string;
  enabled: boolean;
  available: boolean;
};
