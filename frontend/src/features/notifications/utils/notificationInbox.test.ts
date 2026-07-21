import { describe, expect, it } from "vitest";
import type { UnifiedAlert } from "../../../core/alerts";
import { alertFingerprint, markAlertRead, relativeNotificationTime, resolveAlertPath, unreadAlerts, visibleAlerts } from "./notificationInbox";

const alert = { id: "a1", title: "Geada", description: "Risco", severity: "critical", source: "weather", createdAt: "2026-07-21T08:00:00Z" } as UnifiedAlert;

describe("caixa de notificações", () => {
  it("conta apenas alertas ainda não lidos", () => {
    expect(unreadAlerts([alert, { ...alert, id: "a2" }], ["a1"]).map((item) => item.id)).toEqual(["a2"]);
  });

  it("marca um alerta sem duplicar identificadores", () => {
    expect(markAlertRead(["a1"], "a1")).toEqual(["a1"]);
    expect(unreadAlerts([alert], [alertFingerprint(alert)])).toEqual([]);
  });

  it("abre o módulo associado ao alerta", () => {
    expect(resolveAlertPath(alert)).toBe("/clima");
    expect(resolveAlertPath({ ...alert, actionPath: "/ordens" })).toBe("/ordens");
    expect(relativeNotificationTime(alert.createdAt, Date.parse(alert.createdAt) + 120_000)).toBe("Há 2 min");
    expect(visibleAlerts([alert], [alertFingerprint(alert)])).toEqual([]);
  });

  it("volta a considerar novo um alerta cujo conteúdo mudou", () => {
    const oldFingerprint = alertFingerprint(alert);
    expect(unreadAlerts([{ ...alert, description: "Risco agravado" }], [oldFingerprint])).toHaveLength(1);
  });

  it("remove apenas a versão dispensada do histórico", () => {
    expect(visibleAlerts([alert], [alertFingerprint(alert)])).toEqual([]);
    expect(visibleAlerts([{ ...alert, severity: "warning" }], [alertFingerprint(alert)])).toHaveLength(1);
  });

  it("apresenta horas e dias de forma resumida", () => {
    const base = Date.parse(alert.createdAt);
    expect(relativeNotificationTime(alert.createdAt, base + 3_600_000)).toBe("Há 1 h");
    expect(relativeNotificationTime(alert.createdAt, base + 86_400_000)).toBe("Há 1 d");
  });
});
