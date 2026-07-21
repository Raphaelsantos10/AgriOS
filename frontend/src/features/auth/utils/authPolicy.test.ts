import { describe, expect, it } from "vitest";
import { normalizeRole, resolveAuthMode, roleAllowsAdministration } from "./authPolicy";

describe("política de autenticação FARPHA", () => {
  it("mantém o modo local quando a autenticação não é obrigatória", () => {
    expect(resolveAuthMode(false)).toBe("local");
  });

  it("bloqueia uma configuração obrigatória incompleta", () => {
    expect(resolveAuthMode(true, "YOUR_SUPABASE_URL", "YOUR_SUPABASE_ANON_KEY")).toBe("misconfigured");
    expect(resolveAuthMode(true, "https://farpha.supabase.co", "anon-publica")).toBe("required");
  });

  it("normaliza perfis e limita a administração", () => {
    expect(normalizeRole("owner")).toBe("owner");
    expect(normalizeRole("desconhecido")).toBe("viewer");
    expect(roleAllowsAdministration("manager")).toBe(true);
    expect(roleAllowsAdministration("operator")).toBe(false);
  });
});
