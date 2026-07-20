import type { ComplianceProfile } from "../types/compliance";

const STORAGE_KEY = "farpha.compliance-profile.v1";

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
