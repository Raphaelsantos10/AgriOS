/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../services/supabase";
import { normalizeRole, resolveAuthMode, type AuthMode, type FarphaRole } from "./utils/authPolicy";
import type { FarphaPlan } from "./utils/marketingExperience";

export type UserProfile = { id: string; email: string; fullName: string; role: FarphaRole; active: boolean };
export type SignUpInput = { email: string; password: string; fullName: string; operationType: string; selectedPlan?: FarphaPlan };
export type SignUpResult = { ok: boolean; needsConfirmation: boolean };
type AuthContextValue = {
  mode: AuthMode; loading: boolean; session: Session | null; profile: UserProfile | null; recovery: boolean; error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (input: SignUpInput) => Promise<SignUpResult>;
  signInSocial: (provider: "google" | "azure") => Promise<boolean>;
  signOut: () => Promise<void>;
  requestReset: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const mode = resolveAuthMode(import.meta.env.VITE_AUTH_REQUIRED === "true", import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

async function socialProviderEnabled(provider: "google" | "azure") {
  const baseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "");
  if (!baseUrl || !anonKey) return false;
  const response = await fetch(`${baseUrl}/auth/v1/settings`, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } });
  if (!response.ok) throw new Error("social_provider_check_failed");
  const settings = await response.json() as { external?: Record<string, boolean> };
  return settings.external?.[provider] === true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(mode === "required");
  const [recovery, setRecovery] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "required") return;
    let active = true;
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      setError(sessionError?.message ?? null);
      setSession(data.session);
      setLoading(Boolean(data.session));
    });
    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (nextSession?.user.id !== session?.user.id) setProfile(null);
      setSession(nextSession);
      setLoading(Boolean(nextSession));
      setRecovery(event === "PASSWORD_RECOVERY");
      setError(null);
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [session?.user.id]);

  useEffect(() => {
    if (mode !== "required" || !session?.user) return;
    let active = true;
    void supabase.from("user_profiles").select("id, full_name, role, active").eq("id", session.user.id).maybeSingle().then(({ data, error: profileError }) => {
      if (!active) return;
      setError(profileError?.message ?? null);
      setProfile(data ? { id: data.id, email: session.user.email ?? "", fullName: data.full_name || session.user.email || "Utilizador", role: normalizeRole(data.role), active: data.active === true } : null);
      setLoading(false);
    });
    return () => { active = false; };
  }, [session]);

  const value = useMemo<AuthContextValue>(() => ({
    mode, loading, session, profile, recovery, error,
    signIn: async (email, password) => {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setError(error?.message ?? null);
      return !error;
    },
    signUp: async ({ email, password, fullName, operationType, selectedPlan }) => {
      setError(null);
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: fullName, operation_type: operationType, selected_plan: selectedPlan ?? "Free" } } });
      setError(error?.message ?? null);
      return { ok: !error, needsConfirmation: !error && !data.session };
    },
    signInSocial: async (provider) => {
      setError(null);
      try {
        if (!await socialProviderEnabled(provider)) {
          setError(`provider_not_enabled_${provider}`);
          return false;
        }
      } catch {
        setError("social_provider_check_failed");
        return false;
      }
      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin, ...(provider === "azure" ? { scopes: "email" } : {}) } });
      setError(error?.message ?? null);
      return !error;
    },
    signOut: async () => { await supabase.auth.signOut(); setProfile(null); },
    requestReset: async (email) => {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
      setError(error?.message ?? null);
      return !error;
    },
    updatePassword: async (password) => {
      setError(null);
      const { error } = await supabase.auth.updateUser({ password });
      setError(error?.message ?? null);
      if (!error) setRecovery(false);
      return !error;
    },
  }), [error, loading, profile, recovery, session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth deve ser utilizado dentro de AuthProvider");
  return value;
}
