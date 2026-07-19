export type VegetationIndex = "ndvi" | "ndre" | "ndmi";

export type PrecisionLayer = {
  id: "parcels" | "ndvi" | "irrigation" | "alerts";
  label: string;
  description: string;
  enabled: boolean;
  opacity: number;
};

export type ObservationStatus = "healthy" | "attention" | "critical";

export type SatelliteObservation = {
  id: string;
  fieldId: string;
  fieldName: string;
  capturedAt: string;
  cloudCoverage: number;
  index: VegetationIndex;
  averageValue: number;
  minimumValue: number;
  maximumValue: number;
  status: ObservationStatus;
};

export type PrecisionRecommendation = {
  id: string;
  fieldId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  action: string;
};
