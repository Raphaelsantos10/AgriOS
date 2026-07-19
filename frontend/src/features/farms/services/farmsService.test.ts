import { beforeEach, describe, expect, it, vi } from "vitest";

import { farmRepository } from "../../../repositories/farms/farmRepository";
import type { Farm } from "../types/farm";
import {
  createFarm,
  deleteFarm,
  getFarmById,
  getFarms,
  updateFarm,
} from "./farmsService";

vi.mock("../../../repositories/farms/farmRepository", () => ({
  farmRepository: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

const farm: Farm = {
  id: "farm-1",
  name: "Quinta Vale Verde",
  owner: "Raphael Soares",
  area: 12.5,
  crop: "Oliveira",
  latitude: 41.5,
  longitude: -7.3,
};

describe("farmsService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lista explorações", async () => {
    vi.mocked(farmRepository.list).mockResolvedValue({ ok: true, data: [farm] });
    await expect(getFarms()).resolves.toEqual([farm]);
  });

  it("obtém uma exploração pelo identificador", async () => {
    vi.mocked(farmRepository.getById).mockResolvedValue({ ok: true, data: farm });
    await expect(getFarmById("farm-1")).resolves.toEqual(farm);
    expect(farmRepository.getById).toHaveBeenCalledWith("farm-1");
  });

  it("cria uma exploração", async () => {
    const input = {
      name: farm.name,
      owner: farm.owner,
      area: farm.area,
      crop: farm.crop,
      latitude: farm.latitude,
      longitude: farm.longitude,
    };
    vi.mocked(farmRepository.create).mockResolvedValue({ ok: true, data: farm });
    await expect(createFarm(input)).resolves.toEqual(farm);
    expect(farmRepository.create).toHaveBeenCalledWith(input);
  });

  it("atualiza uma exploração", async () => {
    const updated = { ...farm, area: 14 };
    vi.mocked(farmRepository.update).mockResolvedValue({ ok: true, data: updated });
    await expect(updateFarm(updated)).resolves.toEqual(updated);
    expect(farmRepository.update).toHaveBeenCalledWith(updated);
  });

  it("remove uma exploração", async () => {
    vi.mocked(farmRepository.remove).mockResolvedValue({ ok: true, data: undefined });
    await expect(deleteFarm("farm-1")).resolves.toBeUndefined();
    expect(farmRepository.remove).toHaveBeenCalledWith("farm-1");
  });

  it("preserva código e detalhes dos erros do repositório", async () => {
    vi.mocked(farmRepository.list).mockResolvedValue({
      ok: false,
      error: { message: "Falha ao carregar explorações.", code: "PGRST500", details: "API" },
    });

    await expect(getFarms()).rejects.toMatchObject({
      message: "Falha ao carregar explorações.",
      code: "PGRST500",
      details: "API",
    });
  });
});
