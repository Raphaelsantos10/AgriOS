import { useMemo, useState } from "react";
import { BarChart3, Download, FileText } from "lucide-react";
import Button from "../../../design-system/components/Button";
import Card from "../../../design-system/components/Card";
import { listAgriculturalCosts } from "../services/agriculturalCostStorage";
import type { AgriculturalCostCategory } from "../types/agriculturalCost";
import { categoryLabels } from "../utils/agriculturalCosts";
import { buildFinancialSummary, downloadFinancialReportCsv, filterFinancialCosts, type FinancialReportFilters } from "../utils/financialReport";

const inputClass = "h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";
const initialFilters: FinancialReportFilters = { startDate: "", endDate: "", farm: "", field: "", category: "all" };

export default function FinancialReportPage() {
  const [costs] = useState(() => listAgriculturalCosts());
  const [filters, setFilters] = useState(initialFilters);
  const filtered = useMemo(() => filterFinancialCosts(costs, filters), [costs, filters]);
  const summary = useMemo(() => buildFinancialSummary(filtered), [filtered]);
  const categoryRows = (Object.entries(summary.byCategory) as Array<[AgriculturalCostCategory, number]>).filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1]);
  const fieldRows = Object.entries(summary.byField).sort((a, b) => b[1] - a[1]);

  return <div className="mx-auto max-w-[1500px] space-y-6">
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">Sprint 60 · Análise de custos</p><h1 className="mt-1 text-3xl font-black text-slate-950">Relatório financeiro</h1><p className="mt-2 max-w-3xl text-sm text-slate-600">Análise baseada exclusivamente nos custos registados pelo utilizador. Receitas, margem e lucro ainda não estão disponíveis.</p></div>
      <Button onClick={() => downloadFinancialReportCsv(costs, filters, new Date().toISOString())}><Download size={18}/> Exportar relatório CSV</Button>
    </header>

    <Card className="p-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <label className="text-xs font-bold uppercase text-slate-500">Desde<input type="date" className={`mt-1 w-full ${inputClass}`} value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}/></label>
        <label className="text-xs font-bold uppercase text-slate-500">Até<input type="date" className={`mt-1 w-full ${inputClass}`} value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}/></label>
        <label className="text-xs font-bold uppercase text-slate-500">Exploração<input className={`mt-1 w-full ${inputClass}`} value={filters.farm} onChange={(e) => setFilters({ ...filters, farm: e.target.value })}/></label>
        <label className="text-xs font-bold uppercase text-slate-500">Talhão<input className={`mt-1 w-full ${inputClass}`} value={filters.field} onChange={(e) => setFilters({ ...filters, field: e.target.value })}/></label>
        <label className="text-xs font-bold uppercase text-slate-500">Categoria<select className={`mt-1 w-full ${inputClass}`} value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value as "all" | AgriculturalCostCategory })}><option value="all">Todas</option>{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      </div>
      <button type="button" onClick={() => setFilters(initialFilters)} className="mt-4 text-sm font-bold text-emerald-700">Limpar filtros</button>
    </Card>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="p-5"><p className="text-sm font-semibold text-slate-500">Custos no período</p><p className="mt-2 text-3xl font-black">{summary.total.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}</p></Card>
      <Card className="p-5"><p className="text-sm font-semibold text-slate-500">Lançamentos</p><p className="mt-2 text-3xl font-black">{summary.entries}</p></Card>
      <Card className="p-5"><p className="text-sm font-semibold text-slate-500">Custo médio</p><p className="mt-2 text-3xl font-black">{summary.average.toFixed(2)} €</p></Card>
      <Card className="p-5"><p className="text-sm font-semibold text-slate-500">Maior categoria</p><p className="mt-2 text-xl font-black">{summary.topCategory?.label ?? "Sem dados"}</p><p className="text-sm text-slate-500">{summary.topCategory ? `${summary.topCategory.total.toFixed(2)} €` : "Registe custos para analisar"}</p></Card>
    </section>

    <section className="grid gap-6 lg:grid-cols-2">
      <Card className="p-5"><h2 className="flex items-center gap-2 text-xl font-black"><BarChart3 className="text-emerald-700"/> Custos por categoria</h2><div className="mt-5 space-y-3">{categoryRows.length === 0 ? <p className="text-slate-500">Sem dados para os filtros aplicados.</p> : categoryRows.map(([category, value]) => <div key={category}><div className="flex justify-between text-sm"><b>{categoryLabels[category]}</b><span>{value.toFixed(2)} €</span></div><div className="mt-1.5 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${summary.total ? Math.max(3, (value / summary.total) * 100) : 0}%` }}/></div></div>)}</div></Card>
      <Card className="p-5"><h2 className="flex items-center gap-2 text-xl font-black"><FileText className="text-blue-700"/> Custos por talhão</h2><div className="mt-5 space-y-3">{fieldRows.length === 0 ? <p className="text-slate-500">Sem dados para os filtros aplicados.</p> : fieldRows.map(([field, value]) => <div key={field} className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"><b>{field}</b><span className="font-black">{value.toFixed(2)} €</span></div>)}</div></Card>
    </section>

    <Card className="overflow-hidden"><div className="border-b border-slate-200 p-5"><h2 className="text-xl font-black">Detalhamento do período</h2></div>{filtered.length === 0 ? <p className="p-10 text-center text-slate-500">Nenhum custo encontrado.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Data", "Exploração", "Talhão", "Categoria", "Descrição", "Total"].map((label) => <th key={label} className="px-5 py-3">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((cost) => <tr key={cost.id}><td className="px-5 py-4">{new Date(`${cost.date}T12:00:00`).toLocaleDateString("pt-PT")}</td><td className="px-5 py-4 font-semibold">{cost.farm}</td><td className="px-5 py-4">{cost.field || "Exploração inteira"}</td><td className="px-5 py-4">{categoryLabels[cost.category]}</td><td className="px-5 py-4">{cost.description}</td><td className="px-5 py-4 font-black">{(cost.quantity * cost.unitCost).toFixed(2)} €</td></tr>)}</tbody></table></div>}</Card>
  </div>;
}
