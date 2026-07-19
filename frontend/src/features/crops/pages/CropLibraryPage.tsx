import { Filter, Leaf, LoaderCircle, Plus, RefreshCw, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CropCard from "../components/CropCard";
import CropDetailsPanel from "../components/CropDetailsPanel";
import { createCustomCrop, getCrops } from "../services/cropService";
import type { CreateCustomCropInput, Crop, CropCategory } from "../types/crop";
import { cropCategoryLabels } from "../types/crop";

const regions = [
  "Todas as regiões",
  "Portugal — Norte",
  "Portugal — Centro",
  "Portugal — Lisboa e Vale do Tejo",
  "Portugal — Alentejo",
  "Portugal — Algarve",
  "Portugal — Açores",
  "Portugal — Madeira",
];

export default function CropLibraryPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("Portugal — Norte");
  const [category, setCategory] = useState<CropCategory | "all">("all");
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [customOpen, setCustomOpen] = useState(false);

  const loadCrops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCrops(await getCrops());
    } catch (loadError) {
      console.error(loadError);
      setError("Não foi possível carregar o catálogo. Execute primeiro o SQL do Universal Crop Engine no Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadCrops();
    }, 0);

    return () => window.clearTimeout(id);
  }, [loadCrops]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt");
    return crops
      .filter((crop) => category === "all" || crop.category === category)
      .filter((crop) => region === regions[0] || crop.recommendedRegions.includes(region) || crop.sourceType === "custom")
      .filter((crop) => !normalized || [crop.commonName, crop.scientificName ?? "", ...crop.aliases].some((value) => value.toLocaleLowerCase("pt").includes(normalized)))
      .sort((a, b) => Number(b.recommendedRegions.includes(region)) - Number(a.recommendedRegions.includes(region)) || a.commonName.localeCompare(b.commonName, "pt"));
  }, [crops, query, region, category]);

  async function handleCreate(input: CreateCustomCropInput) {
    const created = await createCustomCrop(input);
    setCrops((current) => [...current, created]);
    setCustomOpen(false);
    setSelectedCrop(created);
  }

  return (
    <section className="-m-4 min-h-full bg-[radial-gradient(circle_at_top_right,rgba(156,223,40,0.08),transparent_28%),#061014] p-4 text-white md:-m-6 md:p-6 xl:-m-7 xl:p-7">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9cdf28]">Universal Crop Engine · Fundação</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Biblioteca Universal de Culturas</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#9aa9a2]">Pesquise culturas e variedades, veja primeiro as mais adequadas à região e acrescente qualquer plantação que ainda não exista no catálogo.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => void loadCrops()} className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[#9aa9a2] hover:text-white" aria-label="Atualizar"><RefreshCw className={loading ? "animate-spin" : ""} size={18} /></button>
          <button type="button" onClick={() => setCustomOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5f9912] to-[#9cdf28] px-4 py-2.5 font-black text-[#061014] hover:brightness-110"><Plus size={18} /> Adicionar outra cultura</button>
        </div>
      </header>

      <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-[#0b171a] p-4 lg:grid-cols-[1fr_260px_220px]">
        <label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#75867e]" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar por cultura, variedade ou nome científico..." className="w-full rounded-xl border border-white/10 bg-[#071215] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-[#617169] focus:border-[#9cdf28]/60" /></label>
        <label className="relative"><Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#75867e]" size={17} /><select value={region} onChange={(event) => setRegion(event.target.value)} className="w-full appearance-none rounded-xl border border-white/10 bg-[#071215] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-[#9cdf28]/60">{regions.map((item) => <option key={item}>{item}</option>)}</select></label>
        <select value={category} onChange={(event) => setCategory(event.target.value as CropCategory | "all")} className="rounded-xl border border-white/10 bg-[#071215] px-3 py-3 text-sm text-white outline-none focus:border-[#9cdf28]/60"><option value="all">Todas as categorias</option>{Object.entries(cropCategoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      </div>

      {error && <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      {loading ? (
        <div className="flex min-h-[420px] items-center justify-center gap-3 text-[#9aa9a2]"><LoaderCircle className="animate-spin text-[#9cdf28]" /> A carregar catálogo agrícola…</div>
      ) : filtered.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{filtered.map((crop) => <CropCard key={crop.id} crop={crop} regional={region !== regions[0] && crop.recommendedRegions.includes(region)} onSelect={setSelectedCrop} />)}</div>
      ) : (
        <div className="mt-6 flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-[#0b171a] p-8 text-center"><Leaf size={42} className="text-[#9cdf28]" /><h2 className="mt-4 text-xl font-black">Cultura não encontrada</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#9aa9a2]">Use “Adicionar outra cultura” para registá-la. Depois, o catálogo poderá ser enriquecido com clima, solo, água, pragas e variedades.</p><button type="button" onClick={() => setCustomOpen(true)} className="mt-5 rounded-xl bg-[#9cdf28] px-4 py-2.5 font-black text-[#061014]">Adicionar cultura</button></div>
      )}

      <CropDetailsPanel crop={selectedCrop} onClose={() => setSelectedCrop(null)} />
      <CustomCropDialog open={customOpen} region={region === regions[0] ? undefined : region} onClose={() => setCustomOpen(false)} onCreate={handleCreate} />
    </section>
  );
}

function CustomCropDialog({ open, region, onClose, onCreate }: { open: boolean; region?: string; onClose: () => void; onCreate: (input: CreateCustomCropInput) => Promise<void> }) {
  const [name, setName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CropCategory>("other");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!open) return null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true); setError(null);
    try { await onCreate({ commonName: name, scientificName, description, category, region }); }
    catch (saveError) { console.error(saveError); setError("Não foi possível guardar a cultura."); }
    finally { setSaving(false); }
  }

  return <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={onClose}><form onSubmit={(event) => void submit(event)} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#071215] p-6 text-white shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9cdf28]">Outros</p><h2 className="mt-2 text-2xl font-black">Adicionar cultura ao catálogo</h2></div><button type="button" onClick={onClose} className="rounded-xl border border-white/10 p-2 text-[#9aa9a2]"><X size={18} /></button></div><div className="mt-6 grid gap-4"><Field label="Nome da cultura"><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Pistácio, Goji, Paulownia..." className="input" /></Field><Field label="Nome científico (opcional)"><input value={scientificName} onChange={(event) => setScientificName(event.target.value)} placeholder="Ex.: Pistacia vera" className="input" /></Field><Field label="Categoria"><select value={category} onChange={(event) => setCategory(event.target.value as CropCategory)} className="input">{Object.entries(cropCategoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field><Field label="Descrição inicial"><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="input resize-none" placeholder="Observações sobre a cultura ou variedade..." /></Field></div>{error && <p className="mt-4 text-sm text-red-300">{error}</p>}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-[#b4c1bb]">Cancelar</button><button disabled={saving || !name.trim()} className="rounded-xl bg-[#9cdf28] px-5 py-2.5 text-sm font-black text-[#061014] disabled:opacity-50">{saving ? "A guardar…" : "Guardar cultura"}</button></div><style>{`.input{width:100%;border:1px solid rgba(255,255,255,.10);background:#0b171a;border-radius:.75rem;padding:.75rem 1rem;color:#fff;outline:none}.input:focus{border-color:rgba(156,223,40,.65)}.input option{background:#071215}`}</style></form></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-semibold text-[#b8c5bf]"><span>{label}</span>{children}</label>; }
