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
  intent?: SupportIntent;
};

export type SupportIntent =
  | "plans"
  | "security"
  | "exploration"
  | "weather"
  | "costs"
  | "diagnostics"
  | "human"
  | "getting_started"
  | "navigation"
  | "general";

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

export function classifySupportIntent(question: string): SupportIntent {
  const value = clean(question, 300).toLocaleLowerCase("pt-PT");
  if (/mapa|talhão|talhao|parcela|polígono|poligono|desenhar|importar|exploraç|explorac|quinta|fazenda/.test(value)) return "exploration";
  if (/clima|tempo|chuva|meteor|temperatura|vento|geada/.test(value)) return "weather";
  if (/custo|finance|despesa|fatura|factura|orçamento|orcamento/.test(value)) return "costs";
  if (/erro|problema|branco|carrega|diagn|bloque|falha/.test(value)) return "diagnostics";
  if (/senha|palavra-passe|2fa|mfa|seguran|sessão|sessao|entrar|login/.test(value)) return "security";
  if (/plano|preço|preco|subscri|pagamento|mensalidade|teste grátis|teste gratis/.test(value)) return "plans";
  if (/humano|pessoa|agente|atendente|administrador|whatsapp|telefone|equipa/.test(value)) return "human";
  if (/módulo|modulo|encontrar|navegar|menu|pesquisa/.test(value)) return "navigation";
  if (/começar|comecar|primeiro|início|inicio/.test(value)) return "getting_started";
  return "general";
}

export function answerSupportQuestion(question: string): SupportAnswer {
  const intent = classifySupportIntent(question);
  if (intent === "exploration") return {
    intent,
    text: "Para começar: 1) abra Explorações; 2) selecione Nova exploração e preencha nome e localização; 3) guarde; 4) abra a exploração no mapa; 5) escolha Novo talhão; 6) desenhe o limite ponto a ponto ou importe GeoJSON/KML; 7) confirme a geometria, cultura e área e guarde. Depois o talhão ficará disponível para clima, operações, custos e histórico.",
    path: "/exploracoes",
    action: "Abrir Explorações",
  };
  if (intent === "weather") return { intent, text: "Abra Clima depois de selecionar uma exploração com coordenadas. O FARPHA utiliza essa localização para apresentar previsão, chuva, vento e alertas relevantes.", path: "/clima", action: "Abrir Clima" };
  if (intent === "costs") return { intent, text: "Abra Custos para registar mão de obra, água, combustível, produtos e máquinas. Associe cada registo à exploração, talhão e operação para obter o consolidado financeiro.", path: "/custos", action: "Abrir Custos" };
  if (intent === "diagnostics") return { intent, text: "Execute primeiro o Diagnóstico. Se o problema continuar, crie um pedido com a página, a ação, o horário e a mensagem apresentada — sem dados sensíveis.", path: "/diagnostico", action: "Executar Diagnóstico" };
  if (intent === "security") return { intent, text: "Na área Segurança pode recuperar a palavra-passe, configurar MFA e rever sessões. Nunca partilhe códigos ou palavras-passe no apoio.", path: "/configuracoes#seguranca", action: "Abrir Segurança" };
  if (intent === "plans") return { intent, text: "Compare Free, Plus e Pro em Plano e subscrição. A escolha feita na página pública acompanha o cadastro.", path: "/configuracoes#subscricao", action: "Abrir Planos" };
  if (intent === "human") return { intent, text: "Abra Equipa para falar com o administrador. Em Pedidos pode criar um chamado e manter toda a conversa sincronizada na sua conta." };
  if (intent === "navigation") return { intent, text: "Use Ctrl+K ou a pesquisa global para encontrar qualquer módulo. Se indicar a tarefa, o guia pode apontar o destino correto." };
  if (intent === "getting_started") return { intent, text: "Fluxo inicial recomendado: crie uma exploração, adicione os talhões, consulte clima e alertas, registe operações e reveja as prioridades no Dashboard.", path: "/exploracoes", action: "Começar agora" };
  return { intent, text: "Posso orientar tarefas, localizar módulos e preparar um diagnóstico. Diga o resultado que pretende obter ou crie um pedido para encaminhar a situação à equipa." };
}
