/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../services/supabase";
import { normalizeRole, resolveAuthMode, type AuthMode, type FarphaRole } from "./utils/authPolicy";
import type { FarphaPlan } from "./utils/marketingExperience";
import {
  buildOAuthReturnUrl,
  initialSocialProviderStates,
  readOAuthError,
  requestedSocialProviders,
  resolveSocialProviderStates,
  type SocialProvider,
  type SocialProviderSettings,
  type SocialProviderStates,
} from "./utils/socialAuth";

export type UserProfile = { id: string; email: string; fullName: string; role: FarphaRole; active: boolean };
export type SignUpInput = { email: string; password: string; fullName: string; operationType: string; selectedPlan?: FarphaPlan };
export type SignUpResult = { ok: boolean; needsConfirmation: boolean };
type AuthContextValue = {
  mode: AuthMode; loading: boolean; session: Session | null; profile: UserProfile | null; recovery: boolean; error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (input: SignUpInput) => Promise<SignUpResult>;
  socialProviders: SocialProviderStates;
  refreshSocialProviders: () => Promise<void>;
  signInSocial: (provider: SocialProvider) => Promise<boolean>;
  signOut: () => Promise<void>;
  requestReset: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const mode = resolveAuthMode(import.meta.env.VITE_AUTH_REQUIRED === "true", import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
const requestedProviders = requestedSocialProviders(
  import.meta.env.VITE_GOOGLE_AUTH_ENABLED === "true",
  import.meta.env.VITE_MICROSOFT_AUTH_ENABLED === "true",
);

async function fetchSocialProviderSettings() {
  const baseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "");
  if (!baseUrl || !anonKey) throw new Error("social_provider_check_failed");
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);
  const response = await fetch(`${baseUrl}/auth/v1/settings`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    signal: controller.signal,
  }).finally(() => window.clearTimeout(timeout));
  if (!response.ok) throw new Error("social_provider_check_failed");
  return response.json() as Promise<SocialProviderSettings>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(mode === "required");
  const [recovery, setRecovery] = useState(false);
  const [error, setError] = useState<string | null>(() => readOAuthError(window.location.search, window.location.hash));
  const [socialProviders, setSocialProviders] = useState<SocialProviderStates>(() => initialSocialProviderStates(requestedProviders));

  const refreshSocialProviders = useCallback(async () => {
    if (mode !== "required") {
      setSocialProviders(resolveSocialProviderStates({ google: false, azure: false }, {}));
      return;
    }
    setSocialProviders(initialSocialProviderStates(requestedProviders));
    try {
      setSocialProviders(resolveSocialProviderStates(requestedProviders, await fetchSocialProviderSettings()));
    } catch {
      setSocialProviders(resolveSocialProviderStates(requestedProviders));
    }
  }, []);

  useEffect(() => {
    const oauthError = readOAuthError(window.location.search, window.location.hash);
    if (!oauthError) return;
    window.history.replaceState(null, "", `${window.location.pathname}#entrar`);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void refreshSocialProviders(), 0);
    return () => window.clearTimeout(timeout);
  }, [refreshSocialProviders]);

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
      setProfile(null);
      setSession(nextSession);
      setLoading(Boolean(nextSession));
      setRecovery(event === "PASSWORD_RECOVERY");
      setError(null);
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);

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
    mode, loading, session, profile, recovery, error, socialProviders, refreshSocialProviders,
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
      const providerState = socialProviders[provider];
      if (providerState === "not_enabled" || providerState === "disabled") {
        setError(`provider_not_enabled_${provider}`);
        return false;
      }
      if (providerState === "checking") {
        setError("social_provider_check_pending");
        return false;
      }
      if (providerState === "unreachable") {
        setError("social_provider_check_failed");
        return false;
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: buildOAuthReturnUrl(window.location.origin, import.meta.env.BASE_URL),
          ...(provider === "azure" ? { scopes: "email" } : {}),
        },
      });
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
  }), [error, loading, profile, recovery, refreshSocialProviders, session, socialProviders]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth deve ser utilizado dentro de AuthProvider");
  return value;
}
