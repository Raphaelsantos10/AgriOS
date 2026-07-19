import { Scissors, X } from "lucide-react";
import type { Field, PolygonGeometry } from "../../fields/types/field";

interface Props {
  open: boolean;
  field: Field | null;
  geometries: [PolygonGeometry, PolygonGeometry] | null;
  areas: [number, number] | null;
  firstName: string;
  secondName: string;
  saving: boolean;
  onFirstNameChange: (value: string) => void;
  onSecondNameChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function SplitFieldDialog({
  open,
  field,
  geometries,
  areas,
  firstName,
  secondName,
  saving,
  onFirstNameChange,
  onSecondNameChange,
  onSave,
  onCancel,
}: Props) {
  if (!open || !field || !geometries || !areas) {
    return null;
  }

  const namesValid =
    firstName.trim().length > 0 &&
    secondName.trim().length > 0 &&
    firstName.trim().toLowerCase() !== secondName.trim().toLowerCase();

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <section className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-red-100 p-3 text-red-700">
              <Scissors size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-700">
                Pré-visualização da divisão
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                {field.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            aria-label="Cancelar divisão"
          >
            <X size={22} />
          </button>
        </header>

        <div className="space-y-5 p-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            O talhão original só será apagado depois de os dois novos talhões serem guardados com sucesso.
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <span className="text-xs font-bold uppercase tracking-wide text-blue-700">
                Parte 1
              </span>
              <input
                value={firstName}
                onChange={(event) => onFirstNameChange(event.target.value)}
                disabled={saving}
                className="mt-3 w-full rounded-xl border border-blue-200 bg-white px-3 py-2.5 font-semibold text-slate-900 outline-none focus:border-blue-500"
              />
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {areas[0].toFixed(2)} ha
              </p>
            </label>

            <label className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <span className="text-xs font-bold uppercase tracking-wide text-violet-700">
                Parte 2
              </span>
              <input
                value={secondName}
                onChange={(event) => onSecondNameChange(event.target.value)}
                disabled={saving}
                className="mt-3 w-full rounded-xl border border-violet-200 bg-white px-3 py-2.5 font-semibold text-slate-900 outline-none focus:border-violet-500"
              />
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {areas[1].toFixed(2)} ha
              </p>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              Voltar ao corte
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!namesValid || saving}
              className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "A guardar..." : "Confirmar divisão"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
