import { useEffect, useMemo, useState } from "react";
import { Clock3, History, RotateCcw, X } from "lucide-react";
import * as turf from "@turf/turf";
import type { Field } from "../types/field";
import type { FieldHistory } from "../types/fieldHistory";
import { getFieldHistory } from "../services/fieldHistoryService";

interface Props {
  open: boolean;
  field: Field | null;
  restoring: boolean;
  onClose: () => void;
  onRestore: (version: FieldHistory) => void;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function perimeter(geometry: FieldHistory["geometry"]) {
  if (!geometry) return 0;
  try {
    return turf.length(turf.polygonToLine(turf.polygon(geometry.coordinates)), {
      units: "kilometers",
    }) * 1000;
  } catch {
    return 0;
  }
}

const labels: Record<FieldHistory["change_type"], string> = {
  CREATE: "Criação",
  UPDATE: "Dados alterados",
  GEOMETRY: "Limites alterados",
  SPLIT: "Divisão",
  MERGE: "União",
  DELETE: "Eliminação",
  IMPORT: "Importação",
  RESTORE: "Restauro",
};

export default function FieldHistoryDialog({ open, field, restoring, onClose, onRestore }: Props) {
  const [items, setItems] = useState<FieldHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !field) return;
    let active = true;
    Promise.resolve().then(() => {
      if (active) setLoading(true);
    });
    getFieldHistory(field.id)
      .then((data) => {
        if (!active) return;
        setItems(data);
        setSelectedId(data[0]?.id ?? null);
      })
      .catch((error) => {
        console.error("FIELD HISTORY LOAD ERROR:", error);
        alert("Não foi possível carregar o histórico do talhão.");
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [open, field]);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId]
  );

  if (!open || !field) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="w-2/5 border-r border-slate-200 bg-slate-50">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700"><History size={21} /></div>
              <div><h2 className="font-bold text-slate-900">Histórico do talhão</h2><p className="text-sm text-slate-500">{field.name}</p></div>
            </div>
            <button onClick={onClose} disabled={restoring} className="rounded-xl p-2 hover:bg-slate-100"><X size={20}/></button>
          </header>
          <div className="max-h-[72vh] space-y-2 overflow-y-auto p-4">
            {loading ? <p className="p-4 text-sm text-slate-500">A carregar versões...</p> : items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">Ainda não existem versões guardadas. A próxima alteração criará o primeiro snapshot.</div>
            ) : items.map((item) => (
              <button key={item.id} onClick={() => setSelectedId(item.id)} className={`w-full rounded-2xl border p-4 text-left transition ${selectedId === item.id ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100" : "border-slate-200 bg-white hover:border-violet-200"}`}>
                <div className="flex items-center justify-between gap-3"><span className="font-bold text-slate-900">{labels[item.change_type]}</span><Clock3 size={16} className="text-slate-400"/></div>
                <p className="mt-1 text-xs text-slate-500">{formatDate(item.created_at)}</p>
                {item.change_note && <p className="mt-2 text-sm text-slate-700">{item.change_note}</p>}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-7">
            {!selected ? <div className="grid h-full place-items-center text-slate-500">Selecione uma versão.</div> : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-xs font-bold uppercase tracking-wider text-violet-700">Versão guardada</p><h3 className="mt-1 text-2xl font-bold text-slate-900">{selected.field_name}</h3><p className="mt-1 text-slate-500">{formatDate(selected.created_at)}</p></div>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-700">{labels[selected.change_type]}</span>
                </div>
                <div className="mt-7 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 p-5"><p className="text-sm text-slate-500">Área guardada</p><p className="mt-1 text-2xl font-bold">{Number(selected.area).toFixed(2)} ha</p></div>
                  <div className="rounded-2xl border border-slate-200 p-5"><p className="text-sm text-slate-500">Perímetro</p><p className="mt-1 text-2xl font-bold">{perimeter(selected.geometry).toFixed(0)} m</p></div>
                  <div className="rounded-2xl border border-slate-200 p-5"><p className="text-sm text-slate-500">Cultura</p><p className="mt-1 text-xl font-bold">{selected.crop}</p></div>
                  <div className="rounded-2xl border border-slate-200 p-5"><p className="text-sm text-slate-500">Estado</p><p className="mt-1 text-xl font-bold">{selected.status}</p></div>
                </div>
                <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Ao restaurar, o estado atual será guardado automaticamente como uma nova versão.</div>
              </>
            )}
          </div>
          <footer className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 p-5">
            <button onClick={onClose} disabled={restoring} className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold">Fechar</button>
            <button onClick={() => selected && onRestore(selected)} disabled={!selected || restoring} className="flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white disabled:opacity-50"><RotateCcw size={18}/>{restoring ? "A restaurar..." : "Restaurar versão"}</button>
          </footer>
        </div>
      </div>
    </div>
  );
}
