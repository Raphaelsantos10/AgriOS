import type { InventoryCategory, InventoryProduct } from "../types/inventory";

export const inventoryCategoryLabels: Record<InventoryCategory, string> = {
  fertilizer: "Fertilizante", seed: "Semente", phytosanitary: "Fitofármaco", amendment: "Corretivo", other: "Outro",
};

export function getInventoryProductStatus(product: InventoryProduct, today: string) {
  if (product.expiryDate && product.expiryDate < today) return "expired" as const;
  if (product.currentStock <= product.minimumStock) return "low_stock" as const;
  return "available" as const;
}

export function summarizeInventory(products: InventoryProduct[], today: string) {
  return {
    products: products.length,
    lowStock: products.filter((product) => getInventoryProductStatus(product, today) === "low_stock").length,
    expired: products.filter((product) => getInventoryProductStatus(product, today) === "expired").length,
    estimatedValue: Number(products.reduce((sum, product) => sum + Math.max(0, product.currentStock) * Math.max(0, product.unitCost), 0).toFixed(2)),
  };
}

const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
export function buildInventoryCsv(products: InventoryProduct[], today: string, generatedAt: string) {
  const statusLabels = { expired: "Validade ultrapassada", low_stock: "Stock baixo", available: "Disponível" };
  const rows = products.map((product) => [product.id, product.name, inventoryCategoryLabels[product.category], product.currentStock, product.minimumStock, product.unit, product.unitCost, Number((product.currentStock * product.unitCost).toFixed(2)), product.supplier, product.batch, product.expiryDate || "Não informada", statusLabels[getInventoryProductStatus(product, today)], product.notes, generatedAt]);
  return [["ID", "Produto", "Categoria", "Stock atual", "Stock mínimo", "Unidade", "Custo unitário (€)", "Valor estimado (€)", "Fornecedor", "Lote", "Validade", "Estado", "Observações", "Exportado em"], ...rows].map((row) => row.map(escapeCsv).join(";")).join("\r\n");
}

export function downloadInventoryCsv(products: InventoryProduct[], today: string, generatedAt: string) {
  const blob = new Blob([`\uFEFF${buildInventoryCsv(products, today, generatedAt)}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
  anchor.href = url; anchor.download = "farpha-inventario-produtos.csv"; anchor.click(); URL.revokeObjectURL(url);
}
