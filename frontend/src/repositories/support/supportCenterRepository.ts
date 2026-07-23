import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../../services/supabase";
import type { RepositoryResult } from "../core/types";
import { toRepositoryError } from "../core/types";

export type SupportTicketRow = {
  id: string;
  client_reference: string;
  user_id: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type SupportMessageRow = {
  id: string;
  ticket_id: string;
  author_id: string;
  author_kind: "user" | "support" | "system";
  body: string;
  created_at: string;
};

type CreateTicketRow = Omit<SupportTicketRow, "id" | "created_at" | "updated_at">;

async function resultOf<T>(promise: PromiseLike<{ data: T | null; error: unknown }>): Promise<RepositoryResult<T>> {
  const { data, error } = await promise;
  if (error) return { ok: false, error: toRepositoryError(error) };
  return { ok: true, data: data as T };
}

export const supportCenterRepository = {
  async listTickets(): Promise<RepositoryResult<SupportTicketRow[]>> {
    return resultOf(
      supabase
        .from("support_tickets")
        .select("id, client_reference, user_id, subject, category, priority, description, status, created_at, updated_at")
        .order("updated_at", { ascending: false }),
    );
  },

  async upsertTicket(input: CreateTicketRow): Promise<RepositoryResult<SupportTicketRow>> {
    return resultOf(
      supabase
        .from("support_tickets")
        .upsert(input, { onConflict: "user_id,client_reference" })
        .select("id, client_reference, user_id, subject, category, priority, description, status, created_at, updated_at")
        .single(),
    );
  },

  async updateStatus(id: string, status: string): Promise<RepositoryResult<SupportTicketRow>> {
    return resultOf(
      supabase
        .from("support_tickets")
        .update({ status })
        .eq("id", id)
        .select("id, client_reference, user_id, subject, category, priority, description, status, created_at, updated_at")
        .single(),
    );
  },

  async listMessages(ticketId: string): Promise<RepositoryResult<SupportMessageRow[]>> {
    return resultOf(
      supabase
        .from("support_ticket_messages")
        .select("id, ticket_id, author_id, author_kind, body, created_at")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true }),
    );
  },

  async addMessage(input: Omit<SupportMessageRow, "id" | "created_at">): Promise<RepositoryResult<SupportMessageRow>> {
    return resultOf(
      supabase
        .from("support_ticket_messages")
        .insert(input)
        .select("id, ticket_id, author_id, author_kind, body, created_at")
        .single(),
    );
  },

  async isSupportAdmin(): Promise<RepositoryResult<boolean>> {
    const { data, error } = await supabase.rpc("is_farpha_support_admin");
    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: data === true };
  },

  subscribe(onChange: () => void): () => void {
    const channel: RealtimeChannel = supabase
      .channel(`farpha-support-${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "support_tickets" }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "support_ticket_messages" }, onChange)
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  },
};
