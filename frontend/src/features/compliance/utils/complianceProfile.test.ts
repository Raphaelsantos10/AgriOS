import { describe, expect, it } from "vitest";
import { EMPTY_COMPLIANCE_PROFILE, evaluateComplianceProfile, summarizeObligations } from "./complianceProfile";

describe("perfil de conformidade", () => {
  it("mantém temas gerais para confirmação mesmo num perfil simples", () => {
    const items = evaluateComplianceProfile({ ...EMPTY_COMPLIANCE_PROFILE, professionalActivity: false, sellsProduction: false });
    expect(items.find((item) => item.id === "tax")?.status).toBe("review");
    expect(items.find((item) => item.id === "field-book")?.status).toBe("review");
  });

  it("ativa as obrigações condicionais indicadas pelo agricultor", () => {
    const items = evaluateComplianceProfile({ ...EMPTY_COMPLIANCE_PROFILE, receivesSupport: true, capturesWater: true, hasLivestock: true, usesProfessionalPlantProtection: true });
    expect(["support", "water", "livestock", "plant-protection"].every((id) => items.find((item) => item.id === id)?.status === "applicable")).toBe(true);
  });

  it("resume a matriz sem perder nenhuma regra", () => {
    const items = evaluateComplianceProfile(EMPTY_COMPLIANCE_PROFILE);
    const summary = summarizeObligations(items);
    expect(summary.applicable + summary.review + summary.not_applicable).toBe(items.length);
    expect(items.every((item) => item.sourceUrl.startsWith("https://") && item.sourceCheckedAt)).toBe(true);
  });
});
