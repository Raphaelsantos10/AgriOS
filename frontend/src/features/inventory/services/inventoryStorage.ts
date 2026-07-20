import type { InventoryMovementType, InventoryProduct, InventoryProductDraft } from "../types/inventory";

const STORAGE_KEY = "farpha.inventory.v1";

export function listInventoryProducts(): InventoryProduct[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as InventoryProduct[]; }
  catch { localStorage.setItem(STORAGE_KEY, "[]"); return []; }
}

function persist(products: InventoryProduct[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); }

export function createInventoryProduct(draft: InventoryProductDraft) {
  const now = new Date().toISOString();
  const product: InventoryProduct = { ...draft, id: `INV-${Date.now().toString(36).toUpperCase()}`, createdAt: now, updatedAt: now };
  persist([product, ...listInventoryProducts()]);
  return product;
}

export function moveInventoryStock(id: string, type: InventoryMovementType, quantity: number) {
  if (!Number.isFinite(quantity) || quantity <= 0) throw new Error("A quantidade deve ser superior a zero.");
  const products = listInventoryProducts().map((product) => {
    if (product.id !== id) return product;
    const next = type === "entry" ? product.currentStock + quantity : product.currentStock - quantity;
    if (next < 0) throw new Error("A saída não pode ser superior ao stock atual.");
    return { ...product, currentStock: Number(next.toFixed(3)), updatedAt: new Date().toISOString() };
  });
  persist(products); return products;
}

export function deleteInventoryProduct(id: string) {
  const products = listInventoryProducts().filter((product) => product.id !== id);
  persist(products); return products;
}
