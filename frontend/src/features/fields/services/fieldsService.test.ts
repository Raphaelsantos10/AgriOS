import { beforeEach, describe, expect, it, vi } from "vitest";

import { fieldRepository } from "../../../repositories/fields/fieldRepository";
import type { Field } from "../types/field";
import {
  createField,
  deleteField,
  getFieldById,
  getFieldsByFarm,
  updateField,
} from "./fieldsService";

vi.mock("../../../repositories/fields/fieldRepository", () => ({
  fieldRepository: {
    listByFarm: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
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

describe("fieldsService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lista talhões de uma exploração", async () => {
    vi.mocked(fieldRepository.listByFarm).mockResolvedValue({ ok: true, data: [field] });
    await expect(getFieldsByFarm("farm-1")).resolves.toEqual([field]);
    expect(fieldRepository.listByFarm).toHaveBeenCalledWith("farm-1");
  });

  it("obtém um talhão pelo identificador", async () => {
    vi.mocked(fieldRepository.getById).mockResolvedValue({ ok: true, data: field });
    await expect(getFieldById("field-1")).resolves.toEqual(field);
  });

  it("cria um talhão com a geometria completa", async () => {
    const input = {
      farm_id: field.farm_id,
      name: field.name,
      crop: field.crop,
      area: field.area,
      status: field.status,
      geometry: field.geometry,
    };
    vi.mocked(fieldRepository.create).mockResolvedValue({ ok: true, data: field });
    await expect(createField(input)).resolves.toEqual(field);
    expect(fieldRepository.create).toHaveBeenCalledWith(input);
  });

  it("atualiza área, estado e geometria", async () => {
    const updated = { ...field, area: 3.1, status: "attention" as const };
    vi.mocked(fieldRepository.update).mockResolvedValue({ ok: true, data: updated });
    await expect(updateField(updated)).resolves.toEqual(updated);
    expect(fieldRepository.update).toHaveBeenCalledWith(updated);
  });

  it("remove um talhão", async () => {
    vi.mocked(fieldRepository.remove).mockResolvedValue({ ok: true, data: undefined });
    await expect(deleteField("field-1")).resolves.toBeUndefined();
    expect(fieldRepository.remove).toHaveBeenCalledWith("field-1");
  });

  it("converte falhas do repositório em erros da aplicação", async () => {
    vi.mocked(fieldRepository.update).mockResolvedValue({
      ok: false,
      error: { message: "Não foi possível guardar o talhão.", code: "23505" },
    });

    await expect(updateField(field)).rejects.toMatchObject({
      message: "Não foi possível guardar o talhão.",
      code: "23505",
    });
  });
});
