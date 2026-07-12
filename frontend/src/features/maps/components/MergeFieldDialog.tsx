import { GitMerge, X } from "lucide-react";

import type { Field } from "../../fields/types/field";

interface Props {
  open: boolean;
  sourceField: Field | null;
  fields: Field[];
  selectedFieldId: string;
  name: string;
  saving: boolean;
  onSelectedFieldIdChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function MergeFieldDialog({
  open,
  sourceField,
  fields,
  selectedFieldId,
  name,
  saving,
  onSelectedFieldIdChange,
  onNameChange,
  onSave,
  onClose,
}: Props) {
  if (!open || !sourceField) return null;

  const candidates = fields.filter(
    (field) => field.id !== sourceField.id && field.geometry
  );

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700">
              <GitMerge size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                União GIS
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                Unir talhões
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </header>

        <div className="space-y-5 p-6">
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
            Talhão principal: <strong>{sourceField.name}</strong>. Escolha um
            segundo talhão que toque ou se sobreponha ao primeiro.
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Segundo talhão
            </span>
            <select
              value={selectedFieldId}
              onChange={(event) => onSelectedFieldIdChange(event.target.value)}
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">Selecione um talhão</option>
              {candidates.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name} — {Number(field.area).toFixed(2)} ha
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Nome do novo talhão
            </span>
            <input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              placeholder="Nome do talhão unido"
            />
          </label>

          {candidates.length === 0 && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Não existem outros talhões com geometria válida nesta exploração.
            </p>
          )}
        </div>

        <footer className="flex gap-3 border-t border-slate-200 p-6">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving || !selectedFieldId || !name.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GitMerge size={18} />
            {saving ? "A unir..." : "Confirmar união"}
          </button>
        </footer>
      </div>
    </div>
  );
}
