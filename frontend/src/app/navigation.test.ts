import { describe, expect, it } from "vitest";
import { navigationGroups } from "./navigation";

const registeredRoutes = new Set([
  "/", "/centro-operacoes", "/exploracoes", "/missoes", "/ordens",
  "/custos", "/financeiro", "/inventario", "/maquinas", "/diario-talhao",
  "/tratamentos-agricolas", "/colheitas", "/rastreabilidade", "/produtividade",
  "/calendario", "/culturas", "/analytics", "/digital-twin", "/precisao",
  "/intelligence", "/recomendacoes", "/solo-inteligente", "/clima",
  "/risco-incendio-oficial", "/cartografia-incendio", "/agua-ambiente",
  "/obrigacoes", "/assistente-auditoria", "/ifap-pepac", "/fiscal-laboral",
  "/documentos-conformidade", "/automacoes", "/diagnostico", "/configuracoes",
]);

describe("navegação principal", () => {
  const items = navigationGroups.flatMap((group) => group.items);

  it("não repete caminhos", () => {
    expect(new Set(items.map((item) => item.path)).size).toBe(items.length);
  });

  it("só deixa clicáveis módulos com rota registada", () => {
    const invalid = items.filter((item) => !item.disabled && !registeredRoutes.has(item.path));
    expect(invalid).toEqual([]);
  });

  it("mantém sensores identificado como futuro até existir uma página", () => {
    expect(items.find((item) => item.path === "/sensores")?.disabled).toBe(true);
  });
});
