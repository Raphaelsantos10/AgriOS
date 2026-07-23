import { describe, expect, it } from "vitest";
import {
  answerSupportQuestion,
  changeSupportTicketStatus,
  makeSupportTicket,
  mergeSupportTickets,
  readSupportTickets,
  saveSupportTickets,
  supportEmailHref,
  supportWhatsappHref,
} from "./supportCenterUtils";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("supportCenterUtils", () => {
  it("cria, guarda e recupera pedidos válidos", () => {
    const storage = memoryStorage();
    const ticket = makeSupportTicket(
      { subject: "Erro no mapa", category: "Problema técnico", priority: "Alta", description: "O mapa não carregou." },
      new Date("2026-07-23T10:00:00Z"),
    );
    saveSupportTickets(storage, [ticket]);
    expect(readSupportTickets(storage)).toEqual([ticket]);
  });

  it("ignora armazenamento inválido", () => {
    expect(readSupportTickets({ getItem: () => "{incompleto" })).toEqual([]);
    expect(readSupportTickets({ getItem: () => JSON.stringify([{ id: "1" }]) })).toEqual([]);
  });

  it("acompanha o ciclo do pedido", () => {
    const ticket = makeSupportTicket(
      { subject: "Acesso", category: "Conta e acesso", priority: "Normal", description: "Preciso de orientação." },
      new Date("2026-07-23T10:00:00Z"),
    );
    const sent = changeSupportTicketStatus(ticket, "Enviado", new Date("2026-07-23T10:05:00Z"));
    expect(sent.status).toBe("Enviado");
    expect(changeSupportTicketStatus(sent, "Resolvido").status).toBe("Resolvido");
  });

  it("prefere a versão sincronizada do mesmo pedido", () => {
    const local = makeSupportTicket(
      { subject: "Mapa", category: "Problema técnico", priority: "Alta", description: "Não abre." },
      new Date("2026-07-23T10:00:00Z"),
    );
    const remote = { ...local, status: "Em análise" as const, remoteId: "remote-1", syncState: "synced" as const, updatedAt: "2026-07-23T11:00:00.000Z" };
    expect(mergeSupportTickets([local], [remote])).toEqual([remote]);
  });

  it("prepara contactos com a referência e sem expor credenciais", () => {
    const ticket = makeSupportTicket(
      { subject: "Talhão", category: "Dúvida", priority: "Normal", description: "Como criar o primeiro talhão?" },
      new Date("2026-07-23T10:00:00Z"),
    );
    expect(decodeURIComponent(supportEmailHref(ticket, "apoio@farpha.pt"))).toContain(ticket.id);
    expect(decodeURIComponent(supportWhatsappHref(ticket, "351900000000"))).toContain("primeiro talhão");
  });

  it("encaminha perguntas para módulos reais", () => {
    expect(answerSupportQuestion("Como vejo o clima?").path).toBe("/clima");
    expect(answerSupportQuestion("Tenho um erro").path).toBe("/diagnostico");
    expect(answerSupportQuestion("Quero falar com o administrador").text).toContain("Equipa");
  });
});
