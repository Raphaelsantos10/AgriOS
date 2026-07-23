export type SupportTicketStatus =
  | "Aberto"
  | "Enviado"
  | "Em análise"
  | "Aguardando utilizador"
  | "Resolvido"
  | "Encerrado";

export type SupportSyncState = "local" | "syncing" | "synced" | "error";

export type SupportTicket = {
  id: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
  remoteId?: string;
  syncState?: SupportSyncState;
};

export type SupportAnswer = {
  text: string;
  path?: string;
  action?: string;
};

export const SUPPORT_TICKETS_KEY = "farpha-support-tickets-v2";
export const OPEN_SUPPORT_EVENT = "farpha:open-support";

export function openSupportAssistant() {
  window.dispatchEvent(new Event(OPEN_SUPPORT_EVENT));
}

const validStatuses = new Set<SupportTicketStatus>([
  "Aberto",
  "Enviado",
  "Em análise",
  "Aguardando utilizador",
  "Resolvido",
  "Encerrado",
]);
const validSyncStates = new Set<SupportSyncState>(["local", "syncing", "synced", "error"]);

function clean(value: unknown, maximum: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, maximum);
}

function isTicket(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function readSupportTickets(storage: Pick<Storage, "getItem">): SupportTicket[] {
  try {
    const parsed = JSON.parse(storage.getItem(SUPPORT_TICKETS_KEY) || "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((value) => {
      if (!isTicket(value)) return [];
      const id = clean(value.id, 32);
      const subject = clean(value.subject, 100);
      const description = clean(value.description, 1200);
      if (!id || !subject || !description) return [];
      const createdAt = clean(value.createdAt, 40) || new Date(0).toISOString();
      const status = validStatuses.has(value.status as SupportTicketStatus)
        ? value.status as SupportTicketStatus
        : "Aberto";
      const syncState = validSyncStates.has(value.syncState as SupportSyncState)
        ? value.syncState as SupportSyncState
        : value.remoteId ? "synced" : "local";
      return [{
        id,
        subject,
        description,
        category: clean(value.category, 60) || "Dúvida de utilização",
        priority: clean(value.priority, 30) || "Normal",
        status,
        createdAt,
        updatedAt: clean(value.updatedAt, 40) || createdAt,
        remoteId: clean(value.remoteId, 80) || undefined,
        syncState,
      }];
    });
  } catch {
    return [];
  }
}

export function saveSupportTickets(
  storage: Pick<Storage, "setItem">,
  tickets: SupportTicket[],
) {
  storage.setItem(SUPPORT_TICKETS_KEY, JSON.stringify(tickets.slice(0, 50)));
}

export function makeSupportTicket(
  input: Pick<SupportTicket, "subject" | "category" | "priority" | "description">,
  now = new Date(),
): SupportTicket {
  const createdAt = now.toISOString();
  return {
    id: `FAR-${String(now.getTime()).slice(-8)}`,
    subject: clean(input.subject, 100),
    category: clean(input.category, 60),
    priority: clean(input.priority, 30),
    description: clean(input.description, 1200),
    status: "Aberto",
    createdAt,
    updatedAt: createdAt,
    syncState: "local",
  };
}

export function changeSupportTicketStatus(
  ticket: SupportTicket,
  status: SupportTicketStatus,
  now = new Date(),
): SupportTicket {
  return { ...ticket, status, updatedAt: now.toISOString() };
}

export function mergeSupportTickets(
  localTickets: SupportTicket[],
  remoteTickets: SupportTicket[],
) {
  const byReference = new Map<string, SupportTicket>();
  for (const ticket of localTickets) byReference.set(ticket.id, ticket);
  for (const ticket of remoteTickets) byReference.set(ticket.id, ticket);
  return [...byReference.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function supportEmailHref(ticket: SupportTicket, email: string) {
  const subject = `[${ticket.id}] ${ticket.subject}`;
  const body = [
    "Olá, equipa FARPHA.",
    "",
    "Preciso de apoio com o seguinte pedido:",
    `Referência: ${ticket.id}`,
    `Categoria: ${ticket.category}`,
    `Prioridade: ${ticket.priority}`,
    `Criado em: ${new Date(ticket.createdAt).toLocaleString("pt-PT")}`,
    "",
    ticket.description,
    "",
    "Não incluí palavras-passe nem dados bancários.",
  ].join("\n");
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function supportWhatsappHref(ticket: SupportTicket, whatsapp: string) {
  const message = [
    "Olá, equipa FARPHA.",
    `Pedido ${ticket.id}: ${ticket.subject}`,
    `${ticket.category} · prioridade ${ticket.priority}`,
    ticket.description,
  ].join("\n");
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

export function answerSupportQuestion(question: string): SupportAnswer {
  const value = clean(question, 300).toLocaleLowerCase("pt-PT");
  if (/plano|preço|preco|subscri|cartão|cartao|teste/.test(value)) return { text: "Compare Free, Plus e Pro em Plano e subscrição. A escolha feita na página pública acompanha o cadastro.", path: "/configuracoes#subscricao", action: "Abrir planos" };
  if (/senha|palavra-passe|2fa|seguran|sessão|sessao/.test(value)) return { text: "Na área Segurança pode recuperar a palavra-passe, configurar MFA e rever sessões. Nunca partilhe códigos ou palavras-passe no apoio.", path: "/configuracoes#seguranca", action: "Abrir segurança" };
  if (/mapa|talhão|talhao|explora/.test(value)) return { text: "Comece por criar uma exploração. Depois desenhe ou importe os talhões; o mapa relaciona clima, missões, riscos e histórico.", path: "/exploracoes", action: "Abrir explorações" };
  if (/clima|tempo|chuva|meteor/.test(value)) return { text: "Clima utiliza as coordenadas da exploração selecionada para apresentar previsão e alertas relevantes.", path: "/clima", action: "Abrir clima" };
  if (/custo|finance|despesa/.test(value)) return { text: "Registe custos por operação e consulte o consolidado no Relatório Financeiro.", path: "/custos", action: "Abrir custos" };
  if (/erro|problema|branco|carrega|diagn/.test(value)) return { text: "Execute primeiro o Diagnóstico. Se o problema continuar, crie um pedido com a página, a ação, o horário e a mensagem apresentada — sem dados sensíveis.", path: "/diagnostico", action: "Executar diagnóstico" };
  if (/humano|pessoa|agente|atendente|administrador|whatsapp|telefone/.test(value)) return { text: "Abra Equipa para falar com o administrador. Em Pedidos pode preparar e enviar o contexto completo por email ou WhatsApp." };
  if (/começar|comecar|primeiro|início|inicio/.test(value)) return { text: "Fluxo recomendado: crie uma exploração, adicione talhões, consulte clima e alertas, registe operações e reveja as prioridades no Dashboard.", path: "/exploracoes", action: "Começar agora" };
  if (/módulo|modulo|encontrar|navegar/.test(value)) return { text: "Use Ctrl+K ou a pesquisa global para encontrar qualquer módulo. Também posso conduzi-lo se disser a tarefa que pretende realizar." };
  return { text: "Posso orientar tarefas, localizar módulos e preparar um diagnóstico. Diga o resultado que pretende obter ou crie um pedido para encaminhar a situação à equipa." };
}
