import {
  Camera,
  Droplets,
  Flame,
  Gauge,
  Layers3,
  Leaf,
  RadioTower,
  Satellite,
  Tractor,
} from "lucide-react";

import type {
  DigitalTwinLayer,
  DigitalTwinLayerId,
} from "../types/digitalTwin";

type Props = {
  layers: DigitalTwinLayer[];
  onToggle: (id: DigitalTwinLayerId) => void;
};

const icons = {
  fields: Layers3,
  irrigation: Droplets,
  fire: Flame,
  photos: Camera,
  biodiversity: Leaf,
  sensors: RadioTower,
  machines: Tractor,
  satellite: Satellite,
} satisfies Record<DigitalTwinLayerId, typeof Gauge>;

export default function DigitalTwinLayersPanel({ layers, onToggle }: Props) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-[#0b171a] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="rounded-xl bg-[#9cdf28]/12 p-2.5 text-[#9cdf28]">
          <Layers3 size={20} />
        </div>
        <div>
          <h2 className="font-black text-white">Camadas do gémeo digital</h2>
          <p className="text-xs text-[#84938d]">Controle a informação operacional do mapa.</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {layers.map((layer) => {
          const Icon = icons[layer.id];
          return (
            <button
              key={layer.id}
              type="button"
              disabled={!layer.available}
              onClick={() => onToggle(layer.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                layer.enabled && layer.available
                  ? "border-[#9cdf28]/35 bg-[#9cdf28]/10"
                  : "border-white/8 bg-white/[0.025] hover:bg-white/[0.05]"
              } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon
                  size={18}
                  className={layer.enabled && layer.available ? "text-[#9cdf28]" : "text-[#718079]"}
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-white">{layer.label}</span>
                  <span className="block truncate text-[11px] text-[#7e8e87]">{layer.description}</span>
                </span>
              </span>
              <span
                className={`h-5 w-9 shrink-0 rounded-full p-0.5 transition ${
                  layer.enabled && layer.available ? "bg-[#9cdf28]" : "bg-white/10"
                }`}
              >
                <span
                  className={`block h-4 w-4 rounded-full bg-white transition ${
                    layer.enabled && layer.available ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 rounded-2xl border border-[#d6a72c]/20 bg-[#d6a72c]/8 p-3 text-xs leading-5 text-[#d9c785]">
        Sensores, máquinas e satélite já estão previstos na arquitetura e serão ativados quando as integrações forem configuradas.
      </p>
    </aside>
  );
}
