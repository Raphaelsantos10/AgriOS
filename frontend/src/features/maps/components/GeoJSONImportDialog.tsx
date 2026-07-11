import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, FileCode2, Upload, X } from "lucide-react";

import type { Field } from "../../fields/types/field";
import {
  parseGeoJSONFields,
  type ImportedFieldCandidate,
} from "../utils/geojsonImport";
import { parseKMLFields } from "../utils/kml";

interface Props {
  open: boolean;
  existingFields: Field[];
  importing?: boolean;
  onClose: () => void;
  onImport: (candidates: ImportedFieldCandidate[]) => Promise<void> | void;
}

export default function GeoJSONImportDialog({
  open,
  existingFields,
  importing = false,
  onClose,
  onImport,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState("");
  const [candidates, setCandidates] = useState<ImportedFieldCandidate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  if (!open) return null;

  async function readFile(file: File) {
    setError(null);

    if (!/\.(geojson|json|kml)$/i.test(file.name)) {
      setError("Selecione um ficheiro .geojson, .json ou .kml.");
      return;
    }

    try {
      const text = await file.text();
      const parsed = /\.kml$/i.test(file.name)
        ? parseKMLFields(text, existingFields)
        : parseGeoJSONFields(text, existingFields);
      setFilename(file.name);
      setCandidates(parsed);
    } catch (readError) {
      setFilename("");
      setCandidates([]);
      setError(
        readError instanceof Error
          ? readError.message
          : "Não foi possível analisar o ficheiro."
      );
    }
  }

  function updateCandidate(
    key: string,
    changes: Partial<ImportedFieldCandidate>
  ) {
    setCandidates((current) =>
      current.map((candidate) =>
        candidate.key === key ? { ...candidate, ...changes } : candidate
      )
    );
  }

  const selectedCandidates = candidates.filter(
    (candidate) => candidate.selected && !candidate.duplicate
  );
  const duplicates = candidates.filter((candidate) => candidate.duplicate).length;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
              <FileCode2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Importar ficheiro GIS
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Pré-visualize e escolha os talhões antes de guardar no Supabase.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={importing}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
            aria-label="Fechar importação"
          >
            <X size={22} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <input
            ref={inputRef}
            type="file"
            accept=".geojson,.json,.kml,application/geo+json,application/json,application/vnd.google-earth.kml+xml"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void readFile(file);
              event.target.value = "";
            }}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              event.preventDefault();
              setDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              const file = event.dataTransfer.files?.[0];
              if (file) void readFile(file);
            }}
            className={`flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-10 text-center transition ${
              dragging
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/60"
            }`}
          >
            <Upload size={34} className="text-blue-700" />
            <span className="mt-3 font-bold text-slate-900">
              Clique ou arraste um ficheiro GeoJSON ou KML
            </span>
            <span className="mt-1 text-sm text-slate-500">
              Suporta GeoJSON Polygon/MultiPolygon e KML Polygon
            </span>
          </button>

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertTriangle className="mt-0.5 shrink-0" size={20} />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          {candidates.length > 0 && (
            <>
              <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-bold text-slate-900">{filename}</p>
                  <p className="text-sm text-slate-500">
                    {candidates.length} polígono(s) encontrado(s) • {selectedCandidates.length} selecionado(s)
                  </p>
                </div>
                {duplicates > 0 && (
                  <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
                    {duplicates} duplicado(s) ignorado(s)
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <article
                    key={candidate.key}
                    className={`rounded-2xl border p-4 ${
                      candidate.duplicate
                        ? "border-amber-200 bg-amber-50/70"
                        : candidate.selected
                          ? "border-green-300 bg-green-50/50"
                          : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={candidate.selected && !candidate.duplicate}
                        disabled={candidate.duplicate || importing}
                        onChange={(event) =>
                          updateCandidate(candidate.key, {
                            selected: event.target.checked,
                          })
                        }
                        className="mt-2 h-5 w-5 accent-green-700"
                      />

                      <div className="grid flex-1 gap-3 md:grid-cols-3">
                        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Nome
                          <input
                            value={candidate.name}
                            disabled={candidate.duplicate || importing}
                            onChange={(event) =>
                              updateCandidate(candidate.key, {
                                name: event.target.value,
                              })
                            }
                            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none focus:border-green-600"
                          />
                        </label>

                        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Cultura
                          <input
                            value={candidate.crop}
                            disabled={candidate.duplicate || importing}
                            onChange={(event) =>
                              updateCandidate(candidate.key, {
                                crop: event.target.value,
                              })
                            }
                            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none focus:border-green-600"
                          />
                        </label>

                        <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Estado
                          <select
                            value={candidate.status}
                            disabled={candidate.duplicate || importing}
                            onChange={(event) =>
                              updateCandidate(candidate.key, {
                                status: event.target.value as ImportedFieldCandidate["status"],
                              })
                            }
                            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-semibold normal-case tracking-normal text-slate-900 outline-none focus:border-green-600"
                          >
                            <option value="healthy">Saudável</option>
                            <option value="attention">Atenção</option>
                            <option value="critical">Crítico</option>
                          </select>
                        </label>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pl-8 text-sm">
                      <span className="font-semibold text-slate-600">
                        Área calculada: {candidate.area.toFixed(4)} ha
                      </span>
                      {candidate.duplicate ? (
                        <span className="flex items-center gap-1.5 font-bold text-amber-700">
                          <AlertTriangle size={16} /> Já existe
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 font-bold text-green-700">
                          <CheckCircle2 size={16} /> Válido
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={importing}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void onImport(selectedCandidates)}
            disabled={
              importing ||
              selectedCandidates.length === 0 ||
              selectedCandidates.some(
                (candidate) => !candidate.name.trim() || !candidate.crop.trim()
              )
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload size={18} />
            {importing
              ? "A importar..."
              : `Importar ${selectedCandidates.length} talhão(ões)`}
          </button>
        </footer>
      </div>
    </div>
  );
}
