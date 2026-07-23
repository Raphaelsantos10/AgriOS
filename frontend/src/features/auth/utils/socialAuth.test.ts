import { describe, expect, it } from "vitest";
import {
  buildOAuthReturnUrl,
  initialSocialProviderStates,
  readOAuthError,
  requestedSocialProviders,
  resolveSocialProviderStates,
} from "./socialAuth";

describe("autenticação social FARPHA", () => {
  it("só prepara os provedores pedidos na configuração pública", () => {
    const requested = requestedSocialProviders(true, false);
    expect(initialSocialProviderStates(requested)).toEqual({ google: "checking", azure: "disabled" });
  });

  it("confirma provedores realmente ativos no Supabase", () => {
    const requested = requestedSocialProviders(true, true);
    expect(resolveSocialProviderStates(requested, { external: { google: true, azure: false } })).toEqual({
      google: "ready",
      azure: "not_enabled",
    });
  });

  it("distingue falha de diagnóstico de provedor desativado", () => {
    expect(resolveSocialProviderStates(requestedSocialProviders(true, true))).toEqual({
      google: "unreachable",
      azure: "unreachable",
    });
  });

  it("gera o retorno OAuth a partir da base da aplicação", () => {
    expect(buildOAuthReturnUrl("http://localhost:5173", "/")).toBe("http://localhost:5173/");
    expect(buildOAuthReturnUrl("https://farpha.pt", "/app/")).toBe("https://farpha.pt/app/");
  });

  it("lê erros OAuth devolvidos na query ou no fragmento", () => {
    expect(readOAuthError("", "#error=access_denied&error_description=Acesso%20cancelado")).toBe("Acesso cancelado");
    expect(readOAuthError("?error_code=bad_oauth_state", "")).toBe("bad_oauth_state");
    expect(readOAuthError("", "#entrar")).toBeNull();
  });
});
