export type AuthMode = "local" | "required" | "misconfigured";
export type FarphaRole = "owner" | "manager" | "operator" | "viewer";

const roles: FarphaRole[] = ["owner", "manager", "operator", "viewer"];

export function resolveAuthMode(required: boolean, url?: string, anonKey?: string): AuthMode {
  if (!required) return "local";
  const validUrl = Boolean(url && /^https:\/\/.+\.supabase\.co$/i.test(url));
  const validKey = Boolean(anonKey && !anonKey.startsWith("YOUR_"));
  return validUrl && validKey ? "required" : "misconfigured";
}

export function normalizeRole(value: unknown): FarphaRole {
  return roles.includes(value as FarphaRole) ? (value as FarphaRole) : "viewer";
}

export function roleAllowsAdministration(role: FarphaRole): boolean {
  return role === "owner" || role === "manager";
}
