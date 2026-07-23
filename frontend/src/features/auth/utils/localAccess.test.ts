import { describe, expect, it } from "vitest";
import { hasCurrentLocalAccess, LOCAL_ACCESS_VERSION } from "./localAccess";

describe("acesso local versionado", () => {
  it("obriga versões antigas a regressar à nova página pública", () => {
    expect(hasCurrentLocalAccess(null)).toBe(false);
    expect(hasCurrentLocalAccess("active")).toBe(false);
    expect(hasCurrentLocalAccess("signed-out")).toBe(false);
  });

  it("permite entrar apenas depois da ação na experiência atual", () => {
    expect(hasCurrentLocalAccess(LOCAL_ACCESS_VERSION)).toBe(true);
  });
});
