import { supportCenterRepository, type SupportMessageRow, type SupportTicketRow } from "../../repositories/support/supportCenterRepository";
import { unwrapRepositoryResult } from "../../repositories/core/types";
import type { SupportTicket, SupportTicketStatus } from "./supportCenterUtils";

export type SupportConversationMessage = {
  id: string;
  ticketId: string;
  authorId: string;
  authorKind: "user" | "support" | "system";
  body: string;
  createdAt: string;
};

const statusToDatabase: Record<SupportTicketStatus, string> = {
  "Aberto": "open",
  "Enviado": "open",
  "Em análise": "in_progress",
  "Aguardando utilizador": "waiting_user",
  "Resolvido": "resolved",
  "Encerrado": "closed",
};

const statusFromDatabase: Record<string, SupportTicketStatus> = {
  open: "Aberto",
  in_progress: "Em análise",
  waiting_user: "Aguardando utilizador",
  resolved: "Resolvido",
  closed: "Encerrado",
};

function mapTicket(row: SupportTicketRow): SupportTicket {
  return {
    id: row.client_reference,
    remoteId: row.id,
    subject: row.subject,
    category: row.category,
    priority: row.priority,
    description: row.description,
    status: statusFromDatabase[row.status] ?? "Aberto",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    syncState: "synced",
  };
}

function mapMessage(row: SupportMessageRow): SupportConversationMessage {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    authorId: row.author_id,
    authorKind: row.author_kind,
    body: row.body,
    createdAt: row.created_at,
  };
}

export async function listSyncedSupportTickets() {
  return unwrapRepositoryResult(await supportCenterRepository.listTickets()).map(mapTicket);
}

export async function syncSupportTicket(ticket: SupportTicket, userId: string) {
  const row = unwrapRepositoryResult(await supportCenterRepository.upsertTicket({
    client_reference: ticket.id,
    user_id: userId,
    subject: ticket.subject,
    category: ticket.category,
    priority: ticket.priority,
    description: ticket.description,
    status: statusToDatabase[ticket.status],
  }));
  return mapTicket(row);
}

export async function changeSyncedTicketStatus(remoteId: string, status: SupportTicketStatus) {
  return mapTicket(unwrapRepositoryResult(await supportCenterRepository.updateStatus(remoteId, statusToDatabase[status])));
}

export async function listSupportConversation(remoteId: string) {
  return unwrapRepositoryResult(await supportCenterRepository.listMessages(remoteId)).map(mapMessage);
}

export async function sendSupportConversationMessage(
  remoteId: string,
  userId: string,
  body: string,
  supportAdmin: boolean,
) {
  return mapMessage(unwrapRepositoryResult(await supportCenterRepository.addMessage({
    ticket_id: remoteId,
    author_id: userId,
    author_kind: supportAdmin ? "support" : "user",
    body: body.trim().slice(0, 4000),
  })));
}

export async function checkSupportAdmin() {
  return unwrapRepositoryResult(await supportCenterRepository.isSupportAdmin());
}

export function subscribeToSupportChanges(onChange: () => void) {
  return supportCenterRepository.subscribe(onChange);
}

export function supportSyncErrorMessage(error: unknown) {
  const candidate = error as { code?: string; message?: string };
  if (candidate.code === "42P01" || candidate.code === "PGRST205" || /support_tickets/i.test(candidate.message ?? "")) {
    return "Execute o SQL da Sprint 107.4 no Supabase para ativar a sincronização.";
  }
  if (!navigator.onLine) return "Sem ligação. O pedido ficou guardado neste dispositivo e será sincronizado depois.";
  return "Não foi possível sincronizar agora. O pedido continua guardado neste dispositivo.";
}
