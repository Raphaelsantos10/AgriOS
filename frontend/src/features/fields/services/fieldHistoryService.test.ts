import { beforeEach, describe, expect, it, vi } from "vitest";

import { supabase } from "../../../services/supabase";
import type { Field } from "../types/field";
import {
  createFieldHistorySnapshot,
  getFieldHistory,
} from "./fieldHistoryService";

vi.mock("../../../services/supabase", () => ({
  supabase: { from: vi.fn() },
}));

const field: Field = {
  id: "field-1",
  farm_id: "farm-1",
  name: "Talhão Norte",
  crop: "Oliveira",
  area: 2.75,
  status: "healthy",
  geometry: {
    type: "Polygon",
    coordinates: [[[-7.3, 41.5], [-7.29, 41.5], [-7.29, 41.51], [-7.3, 41.5]]],
  },
};

function historyInsertResult(result: { data: unknown; error: unknown }) {
  const single = vi.fn().mockResolvedValue(result);
  const select = vi.fn(() => ({ single }));
  const insert = vi.fn(() => ({ select }));
  vi.mocked(supabase.from).mockReturnValue({ insert } as never);
  return { insert, select, single };
}

function historyListResult(result: { data: unknown; error: unknown }) {
  const order = vi.fn().mockResolvedValue(result);
  const eq = vi.fn(() => ({ order }));
  const select = vi.fn(() => ({ eq }));
  vi.mocked(supabase.from).mockReturnValue({ select } as never);
  return { select, eq, order };
}

describe("fieldHistoryService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("guarda um snapshot completo antes de uma alteração", async () => {
    const saved = { id: "history-1", field_id: field.id };
    const chain = historyInsertResult({ data: saved, error: null });

    await expect(
      createFieldHistorySnapshot(field, "GEOMETRY", "  Limites ajustados  "),
    ).resolves.toEqual(saved);

    expect(supabase.from).toHaveBeenCalledWith("field_history");
    expect(chain.insert).toHaveBeenCalledWith({
      field_id: field.id,
      farm_id: field.farm_id,
      field_name: field.name,
      crop: field.crop,
      area: field.area,
      status: field.status,
      geometry: field.geometry,
      change_type: "GEOMETRY",
      change_note: "Limites ajustados",
    });
  });

  it("guarda notas vazias como null", async () => {
    const chain = historyInsertResult({ data: { id: "history-2" }, error: null });
    await createFieldHistorySnapshot(field, "UPDATE", "   ");
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ change_note: null }),
    );
  });

  it("lista o histórico mais recente primeiro", async () => {
    const entries = [{ id: "history-2" }, { id: "history-1" }];
    const chain = historyListResult({ data: entries, error: null });

    await expect(getFieldHistory("field-1")).resolves.toEqual(entries);
    expect(chain.eq).toHaveBeenCalledWith("field_id", "field-1");
    expect(chain.order).toHaveBeenCalledWith("created_at", { ascending: false });
  });

  it("devolve uma lista vazia quando não existem versões", async () => {
    historyListResult({ data: null, error: null });
    await expect(getFieldHistory("field-1")).resolves.toEqual([]);
  });

  it("propaga falhas do Supabase ao guardar ou consultar", async () => {
    const saveError = new Error("Falha ao guardar histórico.");
    historyInsertResult({ data: null, error: saveError });
    await expect(createFieldHistorySnapshot(field, "UPDATE")).rejects.toBe(saveError);

    const loadError = new Error("Falha ao carregar histórico.");
    historyListResult({ data: null, error: loadError });
    await expect(getFieldHistory("field-1")).rejects.toBe(loadError);
  });
});
