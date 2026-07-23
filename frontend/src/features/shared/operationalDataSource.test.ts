import { describe, expect, it } from "vitest";
import { resolveOperationalDataSource } from "./operationalDataSource";

describe("fonte operacional", () => {
  it("usa Supabase apenas no modo autenticado obrigatório", () => {
    expect(resolveOperationalDataSource("required")).toBe("supabase");
    expect(resolveOperationalDataSource("local")).toBe("local");
    expect(resolveOperationalDataSource("misconfigured")).toBe("local");
  });
});
