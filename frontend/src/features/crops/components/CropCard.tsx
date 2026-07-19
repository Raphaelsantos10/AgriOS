import { Droplets, Flame, MapPin, Snowflake, Sprout } from "lucide-react";
import type { Crop } from "../types/crop";
import { cropCategoryLabels } from "../types/crop";

type Props = {
  crop: Crop;
  regional: boolean;
  onSelect: (crop: Crop) => void;
};

const toleranceLabel = { low: "Baixa", medium: "Média", high: "Alta" } as const;

export default function CropCard({ crop, regional, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(crop)}
      className="group flex h-full w-full flex-col rounded-2xl border border-white/10 bg-[#0b171a] p-5 text-left shadow-[0_16px_50px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-[#9cdf28]/50 hover:bg-[#0f1e21]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-xl bg-[#9cdf28]/12 p-2.5 text-[#9cdf28]">
          <Sprout size={20} />
        </span>
        <div className="flex flex-wrap justify-end gap-2">
          {regional && (
            <span className="rounded-full bg-[#9cdf28]/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#b9ec5a]">
              Recomendada na região
            </span>
          )}
          {crop.sourceType === "custom" && (
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#9aa9a2]">
              Personalizada
            </span>
          )}
        </div>
      </div>

      <h2 className="mt-4 text-lg font-black text-white">{crop.commonName}</h2>
      <p className="mt-1 min-h-5 text-xs italic text-[#7f9189]">
        {crop.scientificName || cropCategoryLabels[crop.category]}
      </p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#aab8b1]">
        {crop.description || "Cultura adicionada ao catálogo FARPHA."}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-[#96a69f]">
        <span className="flex items-center gap-1.5 rounded-lg bg-white/[0.035] px-2.5 py-2">
          <Snowflake size={14} className="text-sky-400" /> Geada: {crop.frostTolerance ? toleranceLabel[crop.frostTolerance] : "A definir"}
        </span>
        <span className="flex items-center gap-1.5 rounded-lg bg-white/[0.035] px-2.5 py-2">
          <Flame size={14} className="text-orange-400" /> Calor: {crop.heatTolerance ? toleranceLabel[crop.heatTolerance] : "A definir"}
        </span>
        <span className="col-span-2 flex items-center gap-1.5 rounded-lg bg-white/[0.035] px-2.5 py-2">
          <Droplets size={14} className="text-blue-400" /> Perfil hídrico disponível no detalhe
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-4 text-xs">
        <span className="flex items-center gap-1.5 text-[#7f9189]"><MapPin size={13} /> {crop.recommendedRegions.length || 0} regiões</span>
        <span className="font-bold text-[#9cdf28] transition group-hover:translate-x-0.5">Ver dados →</span>
      </div>
    </button>
  );
}
