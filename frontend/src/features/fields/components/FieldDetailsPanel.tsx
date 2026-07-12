import {
  Activity,
  Brain,
  Droplets,
  Download,
  Copy,
  MapPin,
  Maximize2,
  Pencil,
  Save,
  Ruler,
  Sprout,
  Trash2,
  Undo2,
  Redo2,
  Scissors,
  X,
} from "lucide-react";

import * as turf from "@turf/turf";

import type { Field } from "../types/field";

interface Props {
  field: Field | null;
  onClose: () => void;
  onEdit: (field: Field) => void;
  onCenter: (field: Field) => void;
  onDelete: (field: Field) => void;
  onDuplicate: (field: Field) => void;
  onSplit: (field: Field) => void;
  onExport: (field: Field) => void;
  onExportKML: (field: Field) => void;
  isEditingGeometry?: boolean;
  isSavingGeometry?: boolean;
  canUndoGeometry?: boolean;
  canRedoGeometry?: boolean;
  onEditGeometry: (field: Field) => void;
  onUndoGeometry: () => void;
  onRedoGeometry: () => void;
  onSaveGeometry: () => void;
  onCancelGeometry: () => void;
}

interface FieldMetrics {
  areaHectares: number;
  perimeterMeters: number;
  latitude: number | null;
  longitude: number | null;
  vertices: number;
}

function getStatusLabel(status: Field["status"]) {
  if (status === "healthy") {
    return "Saudável";
  }

  if (status === "attention") {
    return "Atenção";
  }

  return "Crítico";
}

function getStatusClasses(status: Field["status"]) {
  if (status === "healthy") {
    return {
      badge: "bg-green-100 text-green-700",
      dot: "bg-green-500",
      card: "border-green-200 bg-green-50",
    };
  }

  if (status === "attention") {
    return {
      badge: "bg-amber-100 text-amber-700",
      dot: "bg-amber-500",
      card: "border-amber-200 bg-amber-50",
    };
  }

  return {
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
    card: "border-red-200 bg-red-50",
  };
}

function calculateFieldMetrics(field: Field): FieldMetrics {
  if (!field.geometry) {
    return {
      areaHectares: Number(field.area) || 0,
      perimeterMeters: 0,
      latitude: null,
      longitude: null,
      vertices: 0,
    };
  }

  try {
    const polygon = turf.polygon(field.geometry.coordinates);

    const areaHectares = turf.area(polygon) / 10000;

    const boundary = turf.polygonToLine(polygon);

    const perimeterKilometers = turf.length(boundary, {
      units: "kilometers",
    });

    const perimeterMeters = perimeterKilometers * 1000;

    const center = turf.centroid(polygon);

    const [longitude, latitude] = center.geometry.coordinates;

    const firstRing = field.geometry.coordinates[0] ?? [];

    const vertices =
      firstRing.length > 1 &&
      firstRing[0]?.[0] === firstRing[firstRing.length - 1]?.[0] &&
      firstRing[0]?.[1] === firstRing[firstRing.length - 1]?.[1]
        ? firstRing.length - 1
        : firstRing.length;

    return {
      areaHectares,
      perimeterMeters,
      latitude,
      longitude,
      vertices,
    };
  } catch (error) {
    console.error("FIELD METRICS ERROR:", error);

    return {
      areaHectares: Number(field.area) || 0,
      perimeterMeters: 0,
      latitude: null,
      longitude: null,
      vertices: 0,
    };
  }
}

export default function FieldDetailsPanel({
  field,
  onClose,
  onEdit,
  onCenter,
  onDelete,
  onDuplicate,
  onSplit,
  onExport,
  onExportKML,
  isEditingGeometry = false,
  isSavingGeometry = false,
  canUndoGeometry = false,
  canRedoGeometry = false,
  onEditGeometry,
  onUndoGeometry,
  onRedoGeometry,
  onSaveGeometry,
  onCancelGeometry,
}: Props) {
  if (!field) {
    return null;
  }

  const metrics = calculateFieldMetrics(field);
  const statusClasses = getStatusClasses(field.status);

  return (
    <aside className="fixed inset-y-0 right-0 z-9999 flex w-full max-w-md flex-col border-l border-slate-200 bg-slate-50 shadow-2xl">
      <header className="flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-green-100 p-3 text-green-700">
              <Sprout size={24} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                Talhão selecionado
              </p>

              <h2 className="truncate text-2xl font-bold text-slate-900">
                {field.name}
              </h2>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isEditingGeometry}
          aria-label="Fechar painel"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <X size={22} />
        </button>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <section
          className={`rounded-3xl border p-5 ${statusClasses.card}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Cultura atual
              </p>

              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                {field.crop}
              </h3>
            </div>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${statusClasses.badge}`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${statusClasses.dot}`}
              />

              {getStatusLabel(field.status)}
            </span>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Métricas geográficas
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Valores calculados automaticamente a partir do polígono.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-green-700">
                <Maximize2 size={18} />

                <span className="text-xs font-bold uppercase tracking-wide">
                  Área
                </span>
              </div>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                {metrics.areaHectares.toFixed(2)}
              </p>

              <p className="text-sm text-slate-500">
                hectares
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <Ruler size={18} />

                <span className="text-xs font-bold uppercase tracking-wide">
                  Perímetro
                </span>
              </div>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                {metrics.perimeterMeters.toFixed(0)}
              </p>

              <p className="text-sm text-slate-500">
                metros
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-violet-700">
                <MapPin size={18} />

                <span className="text-xs font-bold uppercase tracking-wide">
                  Vértices
                </span>
              </div>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                {metrics.vertices}
              </p>

              <p className="text-sm text-slate-500">
                pontos
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-orange-700">
                <Activity size={18} />

                <span className="text-xs font-bold uppercase tracking-wide">
                  Estado
                </span>
              </div>

              <p className="mt-3 text-lg font-bold text-slate-900">
                {getStatusLabel(field.status)}
              </p>

              <p className="text-sm text-slate-500">
                monitorização
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Centro geográfico
          </h3>

          {metrics.latitude !== null &&
          metrics.longitude !== null ? (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Latitude
                </p>

                <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                  {metrics.latitude.toFixed(7)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Longitude
                </p>

                <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                  {metrics.longitude.toFixed(7)}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Este talhão ainda não possui uma geometria válida.
            </p>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Agricultura inteligente
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Indicadores preparados para futuras integrações.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-100 p-2.5 text-green-700">
                  <Activity size={20} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    NDVI
                  </p>

                  <p className="text-sm text-slate-500">
                    Saúde da vegetação
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                Em breve
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
                  <Droplets size={20} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Humidade
                  </p>

                  <p className="text-sm text-slate-500">
                    Sensores de solo
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                Em breve
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                  <Brain size={20} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Produção prevista
                  </p>

                  <p className="text-sm text-slate-500">
                    Análise com inteligência artificial
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                Em breve
              </span>
            </div>
          </div>
        </section>
      </div>

      <footer className="space-y-3 border-t border-slate-200 bg-white p-5">
        {isEditingGeometry ? (
          <>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
              Os valores acima são atualizados em tempo real enquanto altera os limites.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onUndoGeometry}
                disabled={!canUndoGeometry || isSavingGeometry}
                title="Desfazer (Ctrl+Z)"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Undo2 size={18} />
                Desfazer
              </button>

              <button
                type="button"
                onClick={onRedoGeometry}
                disabled={!canRedoGeometry || isSavingGeometry}
                title="Refazer (Ctrl+Y ou Ctrl+Shift+Z)"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Redo2 size={18} />
                Refazer
              </button>
            </div>

            <p className="text-center text-xs text-slate-500">
              Atalhos: Ctrl+Z para desfazer e Ctrl+Y para refazer.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onSaveGeometry}
                disabled={isSavingGeometry}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
              >
                <Save size={18} />
                {isSavingGeometry ? "A guardar..." : "Guardar limites"}
              </button>

              <button
                type="button"
                onClick={onCancelGeometry}
                disabled={isSavingGeometry}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              >
                <X size={18} />
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onCenter(field)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              <MapPin size={18} />
              Centralizar no mapa
            </button>

            <button
              type="button"
              onClick={() => onExport(field)}
              disabled={!field.geometry}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={18} />
              Exportar talhão em GeoJSON
            </button>

            <button
              type="button"
              onClick={() => onExportKML(field)}
              disabled={!field.geometry}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-5 py-3 font-semibold text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={18} />
              Exportar talhão em KML
            </button>

            <button
              type="button"
              onClick={() => onDuplicate(field)}
              disabled={!field.geometry}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-5 py-3 font-semibold text-cyan-700 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Copy size={18} />
              Duplicar talhão
            </button>

            <button
              type="button"
              onClick={() => onSplit(field)}
              disabled={!field.geometry}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Scissors size={18} />
              Dividir talhão
            </button>

            <button
              type="button"
              onClick={() => onEditGeometry(field)}
              disabled={!field.geometry}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Pencil size={18} />
              Editar limites
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onEdit(field)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <Pencil size={18} />
                Editar dados
              </button>

              <button
                type="button"
                onClick={() => onDelete(field)}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={18} />
                Apagar
              </button>
            </div>
          </>
        )}
      </footer>
    </aside>
  );
}