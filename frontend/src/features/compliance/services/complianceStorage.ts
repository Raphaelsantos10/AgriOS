import type { ComplianceProfile, ObligationTracking } from "../types/compliance";

const STORAGE_KEY = "farpha.compliance-profile.v1";
const TRACKING_KEY = "farpha.compliance-tracking.v1";

export function readComplianceProfile(): ComplianceProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as ComplianceProfile : null;
  } catch {
    return null;
  }
}

export function saveComplianceProfile(profile: ComplianceProfile): ComplianceProfile {
  const saved = { ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return saved;
}

export function readComplianceTracking(): Record<string, ObligationTracking> {
  try {
    const raw = localStorage.getItem(TRACKING_KEY);
    return raw ? JSON.parse(raw) as Record<string, ObligationTracking> : {};
  } catch {
    return {};
  }
}

export function saveComplianceTracking(tracking: Record<string, ObligationTracking>): Record<string, ObligationTracking> {
  const updatedAt = new Date().toISOString();
  const saved = Object.fromEntries(Object.entries(tracking).map(([id, item]) => [id, { ...item, updatedAt }]));
  localStorage.setItem(TRACKING_KEY, JSON.stringify(saved));
  return saved;
}
