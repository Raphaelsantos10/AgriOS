import { describe, expect, it } from "vitest";
import type { UnifiedAlert } from "../../../core/alerts";
import { markAlertRead, resolveAlertPath, unreadAlerts } from "./notificationInbox";

const alert = { id: "a1", title: "Geada", description: "Risco", severity: "critical", source: "weather", createdAt: "2026-07-21T08:00:00Z" } as UnifiedAlert;

describe("caixa de notificações", () => {
  it("conta apenas alertas ainda não lidos", () => {
    expect(unreadAlerts([alert, { ...alert, id: "a2" }], ["a1"]).map((item) => item.id)).toEqual(["a2"]);
  });

  it("marca um alerta sem duplicar identificadores", () => {
    expect(markAlertRead(["a1"], "a1")).toEqual(["a1"]);
  });

  it("abre o módulo associado ao alerta", () => {
    expect(resolveAlertPath(alert)).toBe("/clima");
    expect(resolveAlertPath({ ...alert, actionPath: "/ordens" })).toBe("/ordens");
  });
});
