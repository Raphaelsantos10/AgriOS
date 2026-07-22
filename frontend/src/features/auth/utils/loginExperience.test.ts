import { describe, expect, it } from "vitest";
import { emailValidationMessage, isValidEmail, normalizeAuthError } from "./loginExperience";

describe("experiência de login FARPHA", () => {
  it("valida emails sem mostrar erro antes da interação", () => {
    expect(emailValidationMessage("", false)).toBeUndefined();
    expect(emailValidationMessage("", true)).toBe("Introduza o seu email.");
    expect(emailValidationMessage("raphael@farpha.pt", true)).toBeUndefined();
    expect(isValidEmail("raphael@farpha.pt")).toBe(true);
    expect(isValidEmail("raphael@farpha")).toBe(false);
  });

  it("não expõe mensagens técnicas do fornecedor", () => {
    expect(normalizeAuthError("Invalid login credentials")).toBe("Email ou palavra-passe incorretos.");
    expect(normalizeAuthError("Email not confirmed")).toBe("Confirme o email antes de entrar.");
    expect(normalizeAuthError("Failed to fetch")).toBe("Não foi possível contactar o serviço. Verifique a ligação.");
    expect(normalizeAuthError("SQL internal detail")).not.toContain("SQL");
  });
});
