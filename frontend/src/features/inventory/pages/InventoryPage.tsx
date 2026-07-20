import { useMemo, useState, type FormEvent } from "react";
import { Download, Package, Plus, Trash2 } from "lucide-react";
import Button from "../../../design-system/components/Button";
import Card from "../../../design-system/components/Card";
import { createInventoryProduct, deleteInventoryProduct, listInventoryProducts, moveInventoryStock } from "../services/inventoryStorage";
import type { InventoryCategory, InventoryMovementType, InventoryProductDraft } from "../types/inventory";
import { downloadInventoryCsv, getInventoryProductStatus, inventoryCategoryLabels, summarizeInventory } from "../utils/inventory";

const today = new Date().toISOString().slice(0, 10);
const emptyDraft: InventoryProductDraft = { name: "", category: "fertilizer", unit: "kg", currentStock: 0, minimumStock: 0, unitCost: 0, supplier: "", batch: "", expiryDate: "", notes: "" };
const inputClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";

export default function InventoryPage() {
  const [products, setProducts] = useState(() => listInventoryProducts());
  const [draft, setDraft] = useState(emptyDraft);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const summary = summarizeInventory(products, today);
  const filtered = useMemo(() => products.filter((product) => `${product.name} ${product.supplier} ${product.batch} ${inventoryCategoryLabels[product.category]}`.toLowerCase().includes(query.toLowerCase())), [products, query]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.unit.trim() || draft.currentStock < 0 || draft.minimumStock < 0 || draft.unitCost < 0) {
      setError("Preencha nome, unidade, stocks e custo com valores válidos."); return;
    }
    const created = createInventoryProduct(draft); setProducts((current) => [created, ...current]); setDraft(emptyDraft); setError("");
  }

  function move(id: string, type: InventoryMovementType) {
    const raw = window.prompt(type === "entry" ? "Quantidade a adicionar:" : "Quantidade a retirar:");
    if (raw === null) return;
    try { setProducts(moveInventoryStock(id, type, Number(raw.replace(",", ".")))); }
    catch (movementError) { window.alert(movementError instanceof Error ? movementError.message : "Movimento inválido."); }
  }

  function remove(id: string) { if (window.confirm("Apagar este produto do inventário?")) setProducts(deleteInventoryProduct(id)); }

  return <div className="mx-auto max-w-[1500px] space-y-6">
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">Sprint 61 · Gestão de insumos</p><h1 className="mt-1 text-3xl font-black">Inventário de produtos</h1><p className="mt-2 text-sm text-slate-600">Produtos e movimentos introduzidos pelo utilizador, guardados localmente neste navegador.</p></div><Button variant="secondary" onClick={() => downloadInventoryCsv(filtered, today, new Date().toISOString())}><Download size={18}/> Exportar inventário CSV</Button></header>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="p-5"><p className="text-sm font-semibold text-slate-500">Produtos</p><p className="mt-2 text-3xl font-black">{summary.products}</p></Card>
      <Card className="p-5"><p className="text-sm font-semibold text-slate-500">Stock baixo</p><p className="mt-2 text-3xl font-black text-amber-700">{summary.lowStock}</p></Card>
      <Card className="p-5"><p className="text-sm font-semibold text-slate-500">Validade ultrapassada</p><p className="mt-2 text-3xl font-black text-red-700">{summary.expired}</p></Card>
      <Card className="p-5"><p className="text-sm font-semibold text-slate-500">Valor estimado</p><p className="mt-2 text-3xl font-black">{summary.estimatedValue.toFixed(2)} €</p></Card>
    </section>

    <Card className="p-5 sm:p-7"><h2 className="flex items-center gap-2 text-xl font-black"><Plus className="text-emerald-700"/> Novo produto</h2><form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-sm font-semibold sm:col-span-2">Nome *<input className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}/></label>
      <label className="text-sm font-semibold">Categoria<select className={inputClass} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as InventoryCategory })}>{Object.entries(inventoryCategoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-sm font-semibold">Unidade *<input className={inputClass} placeholder="kg, litro, unidade…" value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })}/></label>
      <label className="text-sm font-semibold">Stock inicial<input type="number" min="0" step="0.001" className={inputClass} value={draft.currentStock} onChange={(e) => setDraft({ ...draft, currentStock: Number(e.target.value) })}/></label>
      <label className="text-sm font-semibold">Stock mínimo<input type="number" min="0" step="0.001" className={inputClass} value={draft.minimumStock} onChange={(e) => setDraft({ ...draft, minimumStock: Number(e.target.value) })}/></label>
      <label className="text-sm font-semibold">Custo unitário (€)<input type="number" min="0" step="0.01" className={inputClass} value={draft.unitCost} onChange={(e) => setDraft({ ...draft, unitCost: Number(e.target.value) })}/></label>
      <label className="text-sm font-semibold">Validade<input type="date" className={inputClass} value={draft.expiryDate} onChange={(e) => setDraft({ ...draft, expiryDate: e.target.value })}/></label>
      <label className="text-sm font-semibold">Fornecedor<input className={inputClass} value={draft.supplier} onChange={(e) => setDraft({ ...draft, supplier: e.target.value })}/></label>
      <label className="text-sm font-semibold">Lote<input className={inputClass} value={draft.batch} onChange={(e) => setDraft({ ...draft, batch: e.target.value })}/></label>
      <label className="text-sm font-semibold lg:col-span-2">Observações<input className={inputClass} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })}/></label>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700 sm:col-span-2 lg:col-span-4">{error}</p>}
      <div className="sm:col-span-2 lg:col-span-4"><Button type="submit"><Package size={18}/> Cadastrar produto</Button></div>
    </form></Card>

    <Card className="overflow-hidden"><div className="border-b border-slate-200 p-5"><input className="h-11 w-full max-w-md rounded-xl border border-slate-200 px-3" placeholder="Pesquisar produto, fornecedor ou lote…" value={query} onChange={(e) => setQuery(e.target.value)}/></div>{filtered.length === 0 ? <p className="p-10 text-center text-slate-500">Nenhum produto registado.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Produto", "Stock", "Mínimo", "Custo", "Lote / Validade", "Estado", "Movimento", ""].map((label) => <th key={label} className="px-5 py-3">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((product) => { const status = getInventoryProductStatus(product, today); return <tr key={product.id}><td className="px-5 py-4"><b>{product.name}</b><p className="text-sm text-slate-500">{inventoryCategoryLabels[product.category]} · {product.supplier || "Sem fornecedor"}</p></td><td className="px-5 py-4 font-black">{product.currentStock} {product.unit}</td><td className="px-5 py-4">{product.minimumStock} {product.unit}</td><td className="px-5 py-4">{product.unitCost.toFixed(2)} €/{product.unit}</td><td className="px-5 py-4"><p>{product.batch || "Sem lote"}</p><p className="text-sm text-slate-500">{product.expiryDate || "Sem validade"}</p></td><td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${status === "expired" ? "bg-red-100 text-red-700" : status === "low_stock" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{status === "expired" ? "Validade ultrapassada" : status === "low_stock" ? "Stock baixo" : "Disponível"}</span></td><td className="px-5 py-4"><div className="flex gap-2"><button onClick={() => move(product.id, "entry")} className="rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700">+ Entrada</button><button onClick={() => move(product.id, "exit")} className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">− Saída</button></div></td><td className="px-5 py-4"><button onClick={() => remove(product.id)} aria-label={`Apagar ${product.name}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={17}/></button></td></tr>; })}</tbody></table></div>}</Card>
  </div>;
}
