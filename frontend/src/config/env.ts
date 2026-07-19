const readEnv = (key: keyof ImportMetaEnv): string => import.meta.env[key] ?? "";

export const env = {
  supabaseUrl: readEnv("VITE_SUPABASE_URL"),
  supabaseAnonKey: readEnv("VITE_SUPABASE_ANON_KEY"),
} as const;
