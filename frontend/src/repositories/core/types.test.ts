import { describe, expect, it } from "vitest";

import {
  toRepositoryError,
  unwrapRepositoryResult,
} from "./types";

describe("repository core", () => {
  it("preserva mensagem, código e detalhes conhecidos", () => {
    expect(
      toRepositoryError({ message: "Registo duplicado.", code: "23505", details: "fields" }),
    ).toEqual({ message: "Registo duplicado.", code: "23505", details: "fields" });
  });

  it("normaliza valores de erro desconhecidos", () => {
    expect(toRepositoryError("falha")).toEqual({
      message: "Ocorreu um erro inesperado.",
    });
  });

  it("usa uma mensagem segura quando o objeto não possui mensagem", () => {
    expect(toRepositoryError({ code: "PGRST500" })).toEqual({
      message: "Ocorreu um erro inesperado.",
      code: "PGRST500",
      details: undefined,
    });
  });

  it("devolve os dados de um resultado bem-sucedido", () => {
    expect(unwrapRepositoryResult({ ok: true, data: { id: "farm-1" } })).toEqual({
      id: "farm-1",
    });
  });

  it("converte um resultado falhado num Error com contexto", () => {
    expect(() =>
      unwrapRepositoryResult({
        ok: false,
        error: { message: "Sem autorização.", code: "42501", details: "RLS" },
      }),
    ).toThrow("Sem autorização.");

    try {
      unwrapRepositoryResult({
        ok: false,
        error: { message: "Sem autorização.", code: "42501", details: "RLS" },
      });
    } catch (error) {
      expect(error).toMatchObject({ code: "42501", details: "RLS" });
    }
  });
});
