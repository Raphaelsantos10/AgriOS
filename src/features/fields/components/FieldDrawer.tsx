import { useState } from "react";
import { X } from "lucide-react";
import type { Field, PolygonGeometry } from "../types/field";

interface Props {
  open: boolean;
  farmId: string;
  geometry: PolygonGeometry | null;
  calculatedArea: number;
  editingField?: Field | null;
  onClose: () => void;
  onCreateField: (
    field: Omit<Field, "id" | "created_at">
  ) => Promise<void> | void;
  onUpdateField: (field: Field) => Promise<void> | void;
}

export default function FieldDrawer(props: Props) {
  if (!props.open) return null;

  return <FieldDrawerContent key={props.editingField?.id ?? "new"} {...props} />;
}

function FieldDrawerContent({
  farmId,
  geometry,
  calculatedArea,
  editingField,
  onClose,
  onCreateField,
  onUpdateField,
}: Props) {
  const [name, setName] = useState(editingField?.name ?? "");
  const [crop, setCrop] = useState(editingField?.crop ?? "Milho");
  const [status, setStatus] = useState<Field["status"]>(
    editingField?.status ?? "healthy"
  );
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(editingField);

  async function handleSubmit() {
    if (!name) {
      alert("Preencha o nome do talhão.");
      return;
    }

    try {
      setLoading(true);

      if (editingField) {
        await onUpdateField({
          ...editingField,
          name,
          crop,
          status,
        });
      } else {
        if (!geometry) {
          alert("Desenhe o talhão no mapa antes de guardar.");
          return;
        }

        await onCreateField({
          farm_id: farmId,
          name,
          crop,
          area: calculatedArea,
          status,
          geometry,
        });
      }

      onClose();
    } catch (error) {
      console.error("FIELD DRAWER ERROR:", error);
      alert(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40">
      <div className="absolute right-0 top-0 h-screen w-[480px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isEditing ? "Editar Talhão" : "Guardar Talhão"}
            </h2>

            <p className="text-sm text-slate-500">
              {isEditing
                ? "Atualize os dados do talhão."
                : "Complete os dados da área desenhada no mapa."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-800">
              Área do Talhão
            </p>

            <p className="mt-2 text-3xl font-bold text-green-900">
              {isEditing
                ? `${editingField?.area.toFixed(2)} ha`
                : `${calculatedArea.toFixed(2)} ha`}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold">Nome do Talhão</label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-green-600"
              placeholder="Ex: Talhão Norte"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Cultura</label>

            <select
              value={crop}
              onChange={(event) => setCrop(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-green-600"
            >
              <option>Milho</option>
              <option>Trigo</option>
              <option>Vinha</option>
              <option>Olival</option>
              <option>Batata</option>
              <option>Amêndoa</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Estado</label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as Field["status"])
              }
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-green-600"
            >
              <option value="healthy">Saudável</option>
              <option value="attention">Atenção</option>
              <option value="critical">Crítico</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-green-700 py-4 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
          >
            {loading
              ? "A guardar..."
              : isEditing
                ? "Guardar Alterações"
                : "Guardar Talhão"}
          </button>
        </div>
      </div>
    </div>
  );
}