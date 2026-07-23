import type { AgriculturalCost, AgriculturalCostDraft } from "../../features/costs/types/agriculturalCost";
import { supabase } from "../../services/supabase";
import type { RepositoryResult } from "../core/types";
import { toRepositoryError } from "../core/types";

type CostRow = {
  id: string; farm_name: string; field_name: string | null;
  category: AgriculturalCost["category"]; description: string; cost_date: string;
  quantity: number | string; unit: string; unit_cost: number | string;
  notes: string | null; created_at: string;
};

function fromRow(row: CostRow): AgriculturalCost {
  return {
    id: row.id, farm: row.farm_name, field: row.field_name ?? "", category: row.category,
    description: row.description, date: row.cost_date, quantity: Number(row.quantity),
    unit: row.unit, unitCost: Number(row.unit_cost), notes: row.notes ?? "", createdAt: row.created_at,
  };
}

const selection = "id,farm_name,field_name,category,description,cost_date,quantity,unit,unit_cost,notes,created_at";

export const agriculturalCostRepository = {
  async list(): Promise<RepositoryResult<AgriculturalCost[]>> {
    const { data, error } = await supabase.from("agricultural_costs").select(selection)
      .order("cost_date", { ascending: false }).order("created_at", { ascending: false });
    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: ((data ?? []) as CostRow[]).map(fromRow) };
  },
  async create(input: AgriculturalCostDraft, clientReference?: string): Promise<RepositoryResult<AgriculturalCost>> {
    const payload = {
      client_reference: clientReference ?? null, farm_name: input.farm,
      field_name: input.field || null, category: input.category, description: input.description,
      cost_date: input.date, quantity: input.quantity, unit: input.unit,
      unit_cost: input.unitCost, notes: input.notes || null,
    };
    const query = clientReference
      ? supabase.from("agricultural_costs").upsert(payload, { onConflict: "owner_id,client_reference" })
      : supabase.from("agricultural_costs").insert(payload);
    const { data, error } = await query.select(selection).single();
    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: fromRow(data as CostRow) };
  },
  async remove(id: string): Promise<RepositoryResult<void>> {
    const { error } = await supabase.from("agricultural_costs").delete().eq("id", id);
    if (error) return { ok: false, error: toRepositoryError(error) };
    return { ok: true, data: undefined };
  },
};
