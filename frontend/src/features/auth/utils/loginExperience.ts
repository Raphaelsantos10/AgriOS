export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function normalizeAuthError(message?: string | null) {
  if (!message) return "Não foi possível entrar. Tente novamente.";
  const value = message.toLowerCase();
  if (value.includes("invalid login") || value.includes("invalid credentials")) return "Email ou palavra-passe incorretos.";
  if (value.includes("email not confirmed")) return "Confirme o email antes de entrar.";
  if (value.includes("rate limit") || value.includes("too many")) return "Foram feitas muitas tentativas. Aguarde alguns minutos.";
  if (value.includes("network") || value.includes("fetch")) return "Não foi possível contactar o serviço. Verifique a ligação.";
  if (value.includes("provider_not_enabled_google")) return "O acesso Google ainda não está ativado no Supabase. Peça ao administrador para concluir a configuração.";
  if (value.includes("provider_not_enabled_azure")) return "O acesso Microsoft ainda não está ativado no Supabase. Peça ao administrador para concluir a configuração.";
  if (value.includes("unsupported provider") || value.includes("provider is not enabled")) return "Este método de acesso ainda não está ativado no Supabase.";
  if (value.includes("social_provider_check_failed")) return "Não foi possível confirmar este método de acesso. Tente novamente ou utilize o email.";
  return "Não foi possível concluir a autenticação. Tente novamente.";
}

export function emailValidationMessage(value: string, touched: boolean) {
  if (!touched) return undefined;
  if (!value.trim()) return "Introduza o seu email.";
  if (!isValidEmail(value)) return "Introduza um email válido.";
  return undefined;
}
