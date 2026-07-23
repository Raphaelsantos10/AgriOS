import type { WorkOrder, WorkOrderDraft, WorkOrderStatus } from "../../features/work-orders/types/workOrder";
import { supabase } from "../../services/supabase";
import type { RepositoryResult } from "../core/types";
import { toRepositoryError } from "../core/types";

type WorkOrderRow = {
  id: string; title: string; operation_type: WorkOrder["type"];
  farm_name: string | null; field_name: string | null; crop: string | null;
  priority: WorkOrder["priority"]; status: WorkOrderStatus;
  scheduled_date: string | null; assigned_to: string | null;
  estimated_cost: number | string | null; actual_cost: number | string | null;
  notes: string | null; created_at: string; updated_at: string;
};

function fromRow(row: WorkOrderRow): WorkOrder {
  return {
    id: row.id, title: row.title, type: row.operation_type,
    farm: row.farm_name ?? "", field: row.field_name ?? "", crop: row.crop ?? undefined,
    priority: row.priority, status: row.status, scheduledDate: row.scheduled_date ?? "",
    assignedTo: row.assigned_to ?? "", estimatedCost: Number(row.estimated_cost ?? 0),
    actualCost: row.actual_cost == null ? undefined : Number(row.actual_cost),
    notes: row.notes ?? undefined, createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

const selection = "id,title,operation_type,farm_name,field_name,crop,priority,status,scheduled_date,assigned_to,estimated_cost,actual_cost,notes,created_at,updated_at";

export const workOrderRepository = {
  async list(): Promise<RepositoryResult<WorkOrder[]>> {
    const { data, error } = await supabase.from("work_orders").select(selection).order("created_at", { ascending: false });
    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: ((data ?? []) as WorkOrderRow[]).map(fromRow) };
  },
  async create(input: WorkOrderDraft, clientReference?: string): Promise<RepositoryResult<WorkOrder>> {
    const payload = {
      client_reference: clientReference ?? null, title: input.title, operation_type: input.type,
      farm_name: input.farm, field_name: input.field, crop: input.crop || null,
      priority: input.priority, status: input.status, scheduled_date: input.scheduledDate || null,
      assigned_to: input.assignedTo, estimated_cost: input.estimatedCost,
      actual_cost: input.actualCost ?? null, notes: input.notes || null,
    };
    const query = clientReference
      ? supabase.from("work_orders").upsert(payload, { onConflict: "owner_id,client_reference" })
      : supabase.from("work_orders").insert(payload);
    const { data, error } = await query.select(selection).single();
    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: fromRow(data as WorkOrderRow) };
  },
  async updateStatus(id: string, status: WorkOrderStatus): Promise<RepositoryResult<WorkOrder>> {
    const { data, error } = await supabase.from("work_orders")
      .update({ status, updated_at: new Date().toISOString() }).eq("id", id).select(selection).single();
    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: fromRow(data as WorkOrderRow) };
  },
  async remove(id: string): Promise<RepositoryResult<void>> {
    const { error } = await supabase.from("work_orders").delete().eq("id", id);
    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: undefined };
  },
};
