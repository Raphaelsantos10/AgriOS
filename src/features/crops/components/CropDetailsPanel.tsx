import { Droplets, FlaskConical, MapPin, Snowflake, Sun, X } from "lucide-react";
import type { Crop } from "../types/crop";
import { cropCategoryLabels } from "../types/crop";

type Props = { crop: Crop | null; onClose: () => void };

function prettyJson(value: Crop["climateProfile"]) {
  const entries = Object.entries(value);
  if (!entries.length) return "Dados ainda não definidos.";
  return entries
    .map(([key, item]) => `${key.replaceAll("_", " ")}: ${typeof item === "object" ? JSON.stringify(item) : String(item)}`)
    .join(" · ");
}

export default function CropDetailsPanel({ crop, onClose }: Props) {
  if (!crop) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end bg-black/55 backdrop-blur-sm" onMouseDown={onClose}>
      <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#071215] p-6 text-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9cdf28]">Ficha universal de cultura</p>
            <h2 className="mt-2 text-3xl font-black">{crop.commonName}</h2>
            <p className="mt-1 italic text-[#8fa098]">{crop.scientificName || cropCategoryLabels[crop.category]}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 p-2 text-[#9aa9a2] hover:bg-white/5 hover:text-white" aria-label="Fechar"><X /></button>
        </div>

        <p className="mt-6 rounded-2xl border border-white/8 bg-white/[0.035] p-4 leading-7 text-[#b6c3bd]">
          {crop.description || "Esta cultura foi adicionada manualmente e aguarda enriquecimento de dados."}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Info icon={MapPin} title="Regiões recomendadas" text={crop.recommendedRegions.join(", ") || "A definir"} />
          <Info icon={Snowflake} title="Tolerância ao frio" text={crop.frostTolerance || "A definir"} />
          <Info icon={Sun} title="Tolerância ao calor" text={crop.heatTolerance || "A definir"} />
          <Info icon={Droplets} title="Necessidade hídrica" text={prettyJson(crop.waterProfile)} />
        </div>

        <section className="mt-7 space-y-3">
          <Profile icon={Sun} title="Perfil climático" value={prettyJson(crop.climateProfile)} />
          <Profile icon={FlaskConical} title="Perfil do solo" value={prettyJson(crop.soilProfile)} />
          <Profile icon={Droplets} title="Perfil de rega" value={prettyJson(crop.waterProfile)} />
        </section>

        <div className="mt-8 rounded-2xl border border-[#9cdf28]/20 bg-[#9cdf28]/8 p-4 text-sm leading-6 text-[#cceba3]">
          Próxima evolução: combinar estes requisitos com GPS, altitude, solo, clima, geada e disponibilidade de água de cada talhão para calcular a compatibilidade de plantio.
        </div>
      </aside>
    </div>
  );
}

function Info({ icon: Icon, title, text }: { icon: typeof MapPin; title: string; text: string }) {
  return <div className="rounded-2xl border border-white/8 bg-[#0b171a] p-4"><Icon size={18} className="text-[#9cdf28]" /><p className="mt-3 text-xs uppercase tracking-wider text-[#7f9189]">{title}</p><p className="mt-1 text-sm font-semibold capitalize text-white">{text}</p></div>;
}

function Profile({ icon: Icon, title, value }: { icon: typeof MapPin; title: string; value: string }) {
  return <div className="rounded-2xl border border-white/8 bg-[#0b171a] p-4"><div className="flex items-center gap-2"><Icon size={17} className="text-[#9cdf28]" /><h3 className="font-bold">{title}</h3></div><p className="mt-2 text-sm leading-6 text-[#9eaea6]">{value}</p></div>;
}
