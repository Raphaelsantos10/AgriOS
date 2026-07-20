import { describe, expect, it } from "vitest";
import type { Field } from "../../fields/types/field";
import type { Farm } from "../types/farm";
import { alertToWorkOrderDraft, buildAgriculturalAlerts, buildAgriculturalAlertsCsv } from "./agriculturalAlerts";

const farm = { name: 'Quinta "Sul"' } as Farm;
const fields = [{ id: "1", name: "Vale", status: "critical" }] as Field[];

describe("agriculturalAlerts", () => {
  it("prioriza estado crítico e risco elevado de incêndio", () => {
    const alerts = buildAgriculturalAlerts(fields, [{ fieldId: "1", environment: true, irrigation: true, fireAssessment: true, fireRiskLevel: "high", climateComplete: true }]);
    expect(alerts[0].severity).toBe("critical");
    expect(alerts.some((alert) => alert.category === "Incêndio" && alert.severity === "critical")).toBe(true);
  });

  it("deteta rega, reservatório e clima que exigem atenção", () => {
    const alerts = buildAgriculturalAlerts([{ ...fields[0], status: "healthy" }], [{ fieldId: "1", environment: true, irrigation: true, irrigationActive: false, reservoirLevelPercent: 15, climateComplete: false, fireAssessment: false, fireRiskLevel: null }]);
    expect(alerts.some((alert) => alert.title.includes("Reservatório"))).toBe(true);
    expect(alerts.some((alert) => alert.title === "Sistema de rega inativo")).toBe(true);
    expect(alerts.some((alert) => alert.category === "Clima")).toBe(true);
  });

  it("exporta severidade, origem e ação com escape CSV", () => {
    const alerts = buildAgriculturalAlerts(fields, []);
    const csv = buildAgriculturalAlertsCsv(farm, alerts, "2026-07-20");
    expect(csv).toContain('"Quinta ""Sul"""');
    expect(csv).toContain('"Ação recomendada"');
    expect(csv).toContain('"Diagnóstico calculado"');
  });

  it("transforma um alerta numa tarefa operacional preenchida", () => {
    const alert = buildAgriculturalAlerts(fields, [])[0];
    const draft = alertToWorkOrderDraft(alert, farm, fields[0]);
    expect(draft).toMatchObject({ farm: 'Quinta "Sul"', field: "Vale", priority: "critical", status: "planned" });
    expect(draft.notes).toContain("Ação recomendada");
  });
});
