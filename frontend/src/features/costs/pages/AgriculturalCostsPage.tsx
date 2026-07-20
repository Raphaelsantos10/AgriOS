import { useMemo, useState, type FormEvent } from "react";
import { CircleDollarSign, Download, Plus, Trash2 } from "lucide-react";
import Button from "../../../design-system/components/Button";
import Card from "../../../design-system/components/Card";
import { createAgriculturalCost, deleteAgriculturalCost, listAgriculturalCosts } from "../services/agriculturalCostStorage";
import type { AgriculturalCostCategory, AgriculturalCostDraft } from "../types/agriculturalCost";
import { calculateCostTotal, categoryLabels, downloadAgriculturalCostsCsv, summarizeAgriculturalCosts } from "../utils/agriculturalCosts";

const today = new Date().toISOString().slice(0, 10);
const emptyDraft: AgriculturalCostDraft = { farm: "", field: "", category: "labor", description: "", date: today, quantity: 1, unit: "hora", unitCost: 0, notes: "" };
const inputClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";

export default function AgriculturalCostsPage() {
  const [costs, setCosts] = useState(() => listAgriculturalCosts());
  const [draft, setDraft] = useState(emptyDraft);
  const [category, setCategory] = useState<"all" | AgriculturalCostCategory>("all");
  const [error, setError] = useState("");
  const filtered = useMemo(() => category === "all" ? costs : costs.filter((cost) => cost.category === category), [category, costs]);
  const summary = summarizeAgriculturalCosts(costs);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.farm.trim() || !draft.description.trim() || !draft.date || draft.quantity <= 0 || draft.unitCost < 0) {
      setError("Preencha exploração, descrição, data, quantidade e preço válidos."); return;
    }
    const created = createAgriculturalCost(draft);
    setCosts((current) => [created, ...current]); setDraft(emptyDraft); setError("");
  }

  function remove(id: string) { if (window.confirm("Apagar este custo agrícola?")) setCosts(deleteAgriculturalCost(id)); }

  return <div className="mx-auto max-w-[1500px] space-y-6">
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">Sprint 59 · Gestão operacional</p><h1 className="mt-1 text-3xl font-black text-slate-950">Custos agrícolas</h1><p className="mt-2 text-sm text-slate-600">Registos reais introduzidos pelo utilizador e guardados localmente neste navegador.</p></div>
      <Button variant="secondary" onClick={() => downloadAgriculturalCostsCsv(filtered, new Date().toISOString())}><Download size={18}/> Exportar CSV</Button>
    </header>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="p-5"><p className="text-sm font-semibold text-slate-500">Custo total</p><p className="mt-2 text-3xl font-black">{summary.total.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}</p></Card>
      <Card className="p-5"><p className="text-sm font-semibold text-slate-500">Lançamentos</p><p className="mt-2 text-3xl font-black">{summary.entries}</p></Card>
      <Card className="p-5"><p className="text-sm font-semibold text-slate-500">Mão de obra</p><p className="mt-2 text-3xl font-black">{summary.byCategory.labor.toFixed(2)} €</p></Card>
      <Card className="p-5"><p className="text-sm font-semibold text-slate-500">Combustível</p><p className="mt-2 text-3xl font-black">{summary.byCategory.fuel.toFixed(2)} €</p></Card>
    </section>

    <Card className="p-5 sm:p-7">
      <h2 className="flex items-center gap-2 text-xl font-black"><Plus className="text-emerald-700"/> Novo custo</h2>
      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-semibold">Exploração *<input className={inputClass} value={draft.farm} onChange={(e) => setDraft({ ...draft, farm: e.target.value })}/></label>
        <label className="text-sm font-semibold">Talhão<input className={inputClass} value={draft.field} onChange={(e) => setDraft({ ...draft, field: e.target.value })}/></label>
        <label className="text-sm font-semibold">Categoria<select className={inputClass} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as AgriculturalCostCategory })}>{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="text-sm font-semibold">Data *<input type="date" className={inputClass} value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })}/></label>
        <label className="text-sm font-semibold sm:col-span-2">Descrição *<input className={inputClass} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })}/></label>
        <label className="text-sm font-semibold">Quantidade *<input type="number" min="0.01" step="0.01" className={inputClass} value={draft.quantity} onChange={(e) => setDraft({ ...draft, quantity: Number(e.target.value) })}/></label>
        <label className="text-sm font-semibold">Unidade<input className={inputClass} placeholder="hora, litro, kg…" value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })}/></label>
        <label className="text-sm font-semibold">Preço unitário (€) *<input type="number" min="0" step="0.01" className={inputClass} value={draft.unitCost} onChange={(e) => setDraft({ ...draft, unitCost: Number(e.target.value) })}/></label>
        <label className="text-sm font-semibold lg:col-span-2">Observações<input className={inputClass} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })}/></label>
        <div className="flex items-end justify-between gap-3 lg:col-span-1"><div><p className="text-xs text-slate-500">Total calculado</p><p className="text-xl font-black">{calculateCostTotal(draft).toFixed(2)} €</p></div><Button type="submit"><CircleDollarSign size={18}/> Registar</Button></div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700 sm:col-span-2 lg:col-span-4">{error}</p>}
      </form>
    </Card>

    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-xl font-black">Lançamentos</h2><select className="h-10 rounded-xl border border-slate-200 px-3 text-sm" value={category} onChange={(e) => setCategory(e.target.value as "all" | AgriculturalCostCategory)}><option value="all">Todas as categorias</option>{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      {filtered.length === 0 ? <p className="p-10 text-center text-slate-500">Nenhum custo registado.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Data", "Exploração / Talhão", "Categoria", "Descrição", "Quantidade", "Total", ""].map((item) => <th key={item} className="px-5 py-3">{item}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((cost) => <tr key={cost.id}><td className="px-5 py-4">{new Date(`${cost.date}T12:00:00`).toLocaleDateString("pt-PT")}</td><td className="px-5 py-4"><b>{cost.farm}</b><p className="text-sm text-slate-500">{cost.field || "Exploração inteira"}</p></td><td className="px-5 py-4">{categoryLabels[cost.category]}</td><td className="px-5 py-4">{cost.description}</td><td className="px-5 py-4">{cost.quantity} {cost.unit}</td><td className="px-5 py-4 font-black">{calculateCostTotal(cost).toFixed(2)} €</td><td className="px-5 py-4"><button onClick={() => remove(cost.id)} aria-label={`Apagar ${cost.id}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={17}/></button></td></tr>)}</tbody></table></div>}
    </Card>
  </div>;
}
