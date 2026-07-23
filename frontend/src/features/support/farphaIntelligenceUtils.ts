import type { FarphaIntelligenceContext } from "../../repositories/intelligence/farphaIntelligenceRepository";

export type FarphaIntelligenceErrorCode =
  | "authentication_required"
  | "ai_secret_missing"
  | "hourly_limit"
  | "database_unavailable"
  | "origin_not_allowed"
  | "provider_quota_exhausted"
  | "provider_rate_limit"
  | "provider_timeout"
  | "provider_unavailable"
  | "service_not_configured"
  | "function_unavailable";

export class FarphaIntelligenceError extends Error {
  readonly code: FarphaIntelligenceErrorCode;

  constructor(code: FarphaIntelligenceErrorCode) {
    super(code);
    this.name = "FarphaIntelligenceError";
    this.code = code;
  }
}

export function currentIntelligenceContext(
  location: Pick<Location, "pathname">,
  documentTitle: string,
  locale: string,
  timeZone: string,
): FarphaIntelligenceContext {
  return {
    route: String(location.pathname || "/").slice(0, 240),
    page: String(documentTitle || "FARPHA").slice(0, 160),
    locale: String(locale || "pt-PT").slice(0, 30),
    timeZone: String(timeZone || "Europe/Lisbon").slice(0, 80),
  };
}

export function intelligenceErrorMessage(error: unknown) {
  const code = error instanceof FarphaIntelligenceError ? error.code : "function_unavailable";
  if (code === "authentication_required") return "Entre novamente na conta para utilizar a Inteligência FARPHA.";
  if (code === "ai_secret_missing") return "A chave da Inteligência ainda não foi configurada nos Secrets do Supabase.";
  if (code === "hourly_limit") return "O limite de perguntas desta hora foi atingido. Tente novamente mais tarde.";
  if (code === "origin_not_allowed") return "Este endereço do FARPHA ainda não foi autorizado na Edge Function.";
  if (code === "database_unavailable") return "Execute o SQL da Sprint 107.6 no Supabase.";
  if (code === "provider_quota_exhausted") return "A Inteligência online está sem saldo de API. O guia local respondeu e continuará disponível.";
  if (code === "provider_rate_limit") return "O serviço de Inteligência está temporariamente ocupado.";
  if (code === "provider_timeout") return "A resposta demorou demasiado. Tente novamente.";
  if (code === "service_not_configured") return "A Edge Function ainda não está totalmente configurada.";
  return "A Inteligência online está indisponível. O guia local respondeu sem enviar dados.";
}
