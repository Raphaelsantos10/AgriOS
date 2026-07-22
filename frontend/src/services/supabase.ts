import { createClient } from "@supabase/supabase-js";

export const REMEMBER_SESSION_KEY = "farpha-remember-session";

const authStorage = {
  getItem(key: string) { return sessionStorage.getItem(key) ?? localStorage.getItem(key); },
  setItem(key: string, value: string) {
    if (localStorage.getItem(REMEMBER_SESSION_KEY) === "true") {
      sessionStorage.removeItem(key); localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key); sessionStorage.setItem(key, value);
    }
  },
  removeItem(key: string) { sessionStorage.removeItem(key); localStorage.removeItem(key); },
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL não encontrada.");
}

if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY não encontrada.");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  { auth: { storage: authStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
);
