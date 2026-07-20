export type SoilPropertyCode = "phh2o" | "soc" | "clay" | "sand" | "silt" | "nitrogen" | "cec" | "bdod";
export type SoilEstimate = { property: SoilPropertyCode; depth: string; mean: number | null; low: number | null; high: number | null; unit: string };
export type SoilProfile = { latitude: number; longitude: number; queriedAt: string; source: "SoilGrids / ISRIC"; resolutionMeters: 250; estimates: SoilEstimate[] };
