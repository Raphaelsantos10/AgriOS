import { describe, expect, it } from "vitest";
import {
  FarphaIntelligenceError,
  currentIntelligenceContext,
  intelligenceErrorMessage,
} from "./farphaIntelligenceUtils";

describe("Inteligência FARPHA", () => {
  it("limita o contexto público enviado à função", () => {
    const context = currentIntelligenceContext(
      { pathname: `/${"a".repeat(400)}` },
      "Painel agrícola",
      "pt-PT",
      "Europe/Lisbon",
    );
    expect(context.route).toHaveLength(240);
    expect(context.page).toBe("Painel agrícola");
    expect(context.locale).toBe("pt-PT");
    expect(context.timeZone).toBe("Europe/Lisbon");
  });

  it("traduz falhas de configuração sem expor detalhes técnicos", () => {
    expect(intelligenceErrorMessage(new FarphaIntelligenceError("ai_secret_missing"))).toContain("Secrets");
    expect(intelligenceErrorMessage(new FarphaIntelligenceError("database_unavailable"))).toContain("107.6");
    expect(intelligenceErrorMessage(new FarphaIntelligenceError("hourly_limit"))).toContain("limite");
    expect(intelligenceErrorMessage(new FarphaIntelligenceError("provider_quota_exhausted"))).toContain("sem saldo");
  });

  it("usa mensagem segura para erros desconhecidos", () => {
    const message = intelligenceErrorMessage(new Error("OPENAI_API_KEY=segredo"));
    expect(message).not.toContain("segredo");
    expect(message).toContain("guia local");
  });
});
