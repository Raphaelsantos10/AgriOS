import { supabase } from "../../services/supabase";
import {
  FarphaIntelligenceError,
  type FarphaIntelligenceErrorCode,
} from "../../features/support/farphaIntelligenceUtils";

export type FarphaIntelligenceContext = {
  route: string;
  page: string;
  locale: string;
  timeZone: string;
};

export type FarphaIntelligenceRequest = {
  message: string;
  conversationId?: string;
  context: FarphaIntelligenceContext;
};

export type FarphaIntelligenceResponse = {
  answer: string;
  conversationId: string;
  requestId: string;
  model: string;
  remaining: number;
};

function responseCode(value: unknown): FarphaIntelligenceErrorCode {
  if (value && typeof value === "object" && "error" in value) {
    const code = String((value as { error: unknown }).error);
    const allowed: FarphaIntelligenceErrorCode[] = [
      "authentication_required",
      "ai_secret_missing",
      "hourly_limit",
      "database_unavailable",
      "origin_not_allowed",
      "provider_rate_limit",
      "provider_timeout",
      "provider_unavailable",
      "service_not_configured",
    ];
    if (allowed.includes(code as FarphaIntelligenceErrorCode)) {
      return code as FarphaIntelligenceErrorCode;
    }
  }
  return "function_unavailable";
}

export const farphaIntelligenceRepository = {
  async ask(input: FarphaIntelligenceRequest): Promise<FarphaIntelligenceResponse> {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) throw new FarphaIntelligenceError("authentication_required");

    const { data, error } = await supabase.functions.invoke<FarphaIntelligenceResponse>(
      "farpha-intelligence",
      {
        body: input,
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    if (error || !data?.answer || !data.conversationId) {
      let details: unknown;
      const context = (error as { context?: Response } | null)?.context;
      if (context && typeof context.clone === "function") {
        details = await context.clone().json().catch(() => undefined);
      }
      throw new FarphaIntelligenceError(responseCode(details));
    }
    return data;
  },
};
