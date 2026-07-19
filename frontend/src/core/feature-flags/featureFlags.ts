export type FeatureFlagName =
  | "farphaBranding"
  | "farphaDesignSystem"
  | "intelligenceCenter"
  | "satellite"
  | "drones"
  | "sensors";

const STORAGE_KEY = "farpha.feature-flags";

const defaults: Record<FeatureFlagName, boolean> = {
  farphaBranding: false,
  farphaDesignSystem: true,
  intelligenceCenter: false,
  satellite: false,
  drones: false,
  sensors: false,
};

function readStoredFlags(): Partial<Record<FeatureFlagName, boolean>> {
  if (typeof window === "undefined") return {};

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}

export function getFeatureFlags(): Record<FeatureFlagName, boolean> {
  return { ...defaults, ...readStoredFlags() };
}

export function isFeatureEnabled(name: FeatureFlagName): boolean {
  return getFeatureFlags()[name];
}

export function setFeatureFlag(name: FeatureFlagName, enabled: boolean): void {
  if (typeof window === "undefined") return;

  const next = { ...readStoredFlags(), [name]: enabled };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
