import { describe, expect, it } from "vitest";
import { animatedResult, clampProgress, journeyStages, publicNavigation, readSelectedPlan, saveSelectedPlan, validateInteractiveDestinations } from "./marketingExperience";

describe("experiência pública FARPHA", () => {
  it("não publica navegação sem destino", () => {
    expect(validateInteractiveDestinations(publicNavigation)).toBe(true);
    expect(new Set(publicNavigation.map((item) => item.href)).size).toBe(publicNavigation.length);
  });

  it("mantém as quatro etapas da história guiada completas", () => {
    expect(journeyStages.map((stage) => stage.label)).toEqual(["Observe", "Planeie", "Execute", "Comprove"]);
    expect(journeyStages.every((stage) => stage.title && stage.text && stage.action)).toBe(true);
  });

  it("limita e calcula resultados animados com segurança", () => {
    expect(clampProgress(-1)).toBe(0);
    expect(clampProgress(2)).toBe(1);
    expect(animatedResult(24, 0.5)).toBe(12);
    expect(animatedResult(18, 2)).toBe(18);
  });

  it("guarda apenas planos FARPHA reconhecidos", () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) };
    saveSelectedPlan(storage, "Plus");
    expect(readSelectedPlan(storage)).toBe("Plus");
    values.set("farpha-selected-plan", "Enterprise");
    expect(readSelectedPlan(storage)).toBeUndefined();
  });
});
