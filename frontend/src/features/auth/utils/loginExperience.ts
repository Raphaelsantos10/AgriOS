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
  return "Não foi possível concluir a autenticação. Tente novamente.";
}

export function emailValidationMessage(value: string, touched: boolean) {
  if (!touched) return undefined;
  if (!value.trim()) return "Introduza o seu email.";
  if (!isValidEmail(value)) return "Introduza um email válido.";
  return undefined;
}
