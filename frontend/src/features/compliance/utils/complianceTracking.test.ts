import { describe, expect, it } from "vitest";
import type { ComplianceObligation } from "../types/compliance";
import { changeTrackingStatus, countTracking, createTracking, isTrackingOverdue } from "./complianceTracking";

const obligation = (status: ComplianceObligation["status"]): ComplianceObligation => ({ id: "water", area: "Água", title: "Captação", description: "", authority: "APA", sourceUrl: "https://apambiente.pt", sourceCheckedAt: "2026-07-20", status, reason: "" });

describe("acompanhamento das obrigações", () => {
  it("cria estado coerente com a aplicabilidade", () => {
    expect(createTracking(obligation("applicable")).status).toBe("pending");
    expect(createTracking(obligation("not_applicable")).status).toBe("not_applicable");
  });

  it("regista confirmação apenas quando o responsável conclui", () => {
    const initial = createTracking(obligation("applicable"));
    const completed = changeTrackingStatus(initial, "completed", "2026-07-20T10:00:00.000Z");
    expect(completed.confirmedAt).toBe("2026-07-20T10:00:00.000Z");
    expect(changeTrackingStatus(completed, "in_progress").confirmedAt).toBe("");
  });

  it("identifica prazos vencidos sem penalizar itens concluídos", () => {
    const pending = { ...createTracking(obligation("applicable")), dueDate: "2026-07-01" };
    const completed = changeTrackingStatus(pending, "completed");
    expect(isTrackingOverdue(pending, "2026-07-20")).toBe(true);
    expect(isTrackingOverdue(completed, "2026-07-20")).toBe(false);
    expect(countTracking([pending, completed], "2026-07-20").overdue).toBe(1);
  });
});
