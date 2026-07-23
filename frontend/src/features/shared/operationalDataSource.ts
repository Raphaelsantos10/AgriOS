import type { AuthMode } from "../auth/utils/authPolicy";

export type OperationalDataSource = "supabase" | "local";

export function resolveOperationalDataSource(mode: AuthMode): OperationalDataSource {
  return mode === "required" ? "supabase" : "local";
}
