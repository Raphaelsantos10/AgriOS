import { supabase } from "../../../services/supabase";
import type { CreateCustomCropInput, Crop, CropCategory, CropSourceType } from "../types/crop";

type CropRow = {
  id: string;
  slug: string;
  common_name: string;
  scientific_name: string | null;
  category: CropCategory;
  aliases: string[] | null;
  recommended_regions: string[] | null;
  description: string | null;
  climate_profile: Crop["climateProfile"] | null;
  soil_profile: Crop["soilProfile"] | null;
  water_profile: Crop["waterProfile"] | null;
  frost_tolerance: Crop["frostTolerance"];
  heat_tolerance: Crop["heatTolerance"];
  source_type: CropSourceType;
  created_at: string;
};

function mapCrop(row: CropRow): Crop {
  return {
    id: row.id,
    slug: row.slug,
    commonName: row.common_name,
    scientificName: row.scientific_name,
    category: row.category,
    aliases: row.aliases ?? [],
    recommendedRegions: row.recommended_regions ?? [],
    description: row.description,
    climateProfile: row.climate_profile ?? {},
    soilProfile: row.soil_profile ?? {},
    waterProfile: row.water_profile ?? {},
    frostTolerance: row.frost_tolerance,
    heatTolerance: row.heat_tolerance,
    sourceType: row.source_type,
    createdAt: row.created_at,
  };
}

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getCrops(): Promise<Crop[]> {
  const { data, error } = await supabase
    .from("crop_catalog")
    .select("*")
    .order("common_name", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as CropRow[]).map(mapCrop);
}

export async function createCustomCrop(input: CreateCustomCropInput): Promise<Crop> {
  const payload = {
    slug: `${createSlug(input.commonName)}-${Date.now()}`,
    common_name: input.commonName.trim(),
    scientific_name: input.scientificName?.trim() || null,
    category: input.category,
    aliases: [],
    recommended_regions: input.region ? [input.region] : [],
    description: input.description?.trim() || null,
    climate_profile: {},
    soil_profile: {},
    water_profile: {},
    source_type: "custom" as const,
  };

  const { data, error } = await supabase
    .from("crop_catalog")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return mapCrop(data as CropRow);
}
