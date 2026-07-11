import { ChevronDown, ChevronUp, Eye, EyeOff, Layers3, RotateCcw } from "lucide-react";

export type MapLayerPreferences = {
  fields: boolean;
  labels: boolean;
  farms: boolean;
  hillshade: boolean;
  measurements: boolean;
  draft: boolean;
  fieldsOpacity: number;
  hillshadeOpacity: number;
};

interface Props {
  open: boolean;
  preferences: MapLayerPreferences;
  onOpenChange: (open: boolean) => void;
  onChange: (preferences: MapLayerPreferences) => void;
  onReset: () => void;
}

type ToggleKey = "fields" | "labels" | "farms" | "hillshade" | "measurements" | "draft";

const items: Array<{ key: ToggleKey; label: string; description: string }> = [
  { key: "fields", label: "Talhões", description: "Polígonos e limites guardados" },
  { key: "labels", label: "Etiquetas", description: "Nome e área dos talhões" },
  { key: "farms", label: "Explorações", description: "Marcadores das explorações" },
  { key: "hillshade", label: "Relevo", description: "Sombreamento do terreno" },
  { key: "measurements", label: "Medições", description: "Distância e área temporárias" },
  { key: "draft", label: "Desenhos temporários", description: "Novos limites e edição" },
];

export default function LayersManager({
  open,
  preferences,
  onOpenChange,
  onChange,
  onReset,
}: Props) {
  function toggle(key: ToggleKey) {
    onChange({ ...preferences, [key]: !preferences[key] });
  }

  return (
    <div className="absolute bottom-8 left-4 z-20 w-80 max-w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
      >
        <span className="flex items-center gap-2 font-bold text-slate-900">
          <Layers3 size={18} className="text-green-700" />
          Camadas
        </span>
        {open ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </button>

      {open && (
        <div className="border-t border-slate-200 px-4 pb-4 pt-3">
          <div className="space-y-2">
            {items.map((item) => {
              const enabled = preferences[item.key];

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggle(item.key)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-left transition hover:bg-slate-50"
                >
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                    <span className="block text-[11px] text-slate-500">{item.description}</span>
                  </span>
                  {enabled ? (
                    <Eye size={18} className="shrink-0 text-green-700" />
                  ) : (
                    <EyeOff size={18} className="shrink-0 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 space-y-4 rounded-xl bg-slate-50 p-3">
            <label className="block">
              <span className="flex items-center justify-between text-xs font-semibold text-slate-700">
                Opacidade dos talhões
                <span>{Math.round(preferences.fieldsOpacity * 100)}%</span>
              </span>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={preferences.fieldsOpacity}
                onChange={(event) =>
                  onChange({ ...preferences, fieldsOpacity: Number(event.target.value) })
                }
                className="mt-2 w-full accent-green-700"
              />
            </label>

            <label className="block">
              <span className="flex items-center justify-between text-xs font-semibold text-slate-700">
                Intensidade do relevo
                <span>{Math.round(preferences.hillshadeOpacity * 100)}%</span>
              </span>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={preferences.hillshadeOpacity}
                onChange={(event) =>
                  onChange({ ...preferences, hillshadeOpacity: Number(event.target.value) })
                }
                className="mt-2 w-full accent-green-700"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            <RotateCcw size={15} />
            Restaurar camadas
          </button>
        </div>
      )}
    </div>
  );
}
