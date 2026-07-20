import { describe, expect, it } from "vitest";
import type { InventoryProduct } from "../types/inventory";
import { buildInventoryCsv, getInventoryProductStatus, summarizeInventory } from "./inventory";

const products = [
  { id: "1", name: 'Semente "A"', category: "seed", unit: "kg", currentStock: 5, minimumStock: 10, unitCost: 4, supplier: "Coop", batch: "L1", expiryDate: "2027-01-01", notes: "", createdAt: "", updatedAt: "" },
  { id: "2", name: "Produto B", category: "phytosanitary", unit: "l", currentStock: 2, minimumStock: 1, unitCost: 20, supplier: "Coop", batch: "L2", expiryDate: "2025-01-01", notes: "", createdAt: "", updatedAt: "" },
] as InventoryProduct[];

describe("inventory", () => {
  it("classifica stock baixo, validade ultrapassada e disponibilidade", () => {
    expect(getInventoryProductStatus(products[0], "2026-07-20")).toBe("low_stock");
    expect(getInventoryProductStatus(products[1], "2026-07-20")).toBe("expired");
    expect(getInventoryProductStatus({ ...products[0], currentStock: 20 }, "2026-07-20")).toBe("available");
  });
  it("calcula alertas e valor estimado do inventário", () => {
    expect(summarizeInventory(products, "2026-07-20")).toEqual({ products: 2, lowStock: 1, expired: 1, estimatedValue: 60 });
  });
  it("exporta lote, validade, estado e escapa o nome", () => {
    const csv = buildInventoryCsv(products, "2026-07-20", "2026-07-20T10:00:00Z");
    expect(csv).toContain('"Semente ""A"""');
    expect(csv).toContain('"Stock baixo"');
    expect(csv).toContain('"Validade ultrapassada"');
  });
});
