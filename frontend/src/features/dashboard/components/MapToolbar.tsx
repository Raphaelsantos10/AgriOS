import { Crosshair, Layers3, Maximize2, Ruler } from "lucide-react";

const tools = [
  { label: "Camadas", icon: Layers3 },
  { label: "Medir", icon: Ruler },
  { label: "Localizar", icon: Crosshair },
  { label: "Expandir", icon: Maximize2 },
];

export default function MapToolbar() {
  return (
    <div className="absolute right-3 top-20 z-[500] flex flex-col gap-2 sm:right-4 sm:top-4">
      {tools.map(({ label, icon: Icon }) => (
        <button key={label} type="button" title={label} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-[#071215]/90 text-[#aab7b1] shadow-lg backdrop-blur transition hover:border-[#9cdf28]/35 hover:text-[#9cdf28]">
          <Icon size={17} />
        </button>
      ))}
    </div>
  );
}
