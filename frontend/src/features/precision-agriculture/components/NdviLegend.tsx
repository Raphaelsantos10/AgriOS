const bands = [
  { label: "Solo exposto", value: "< 0,20", className: "bg-amber-700" },
  { label: "Vigor baixo", value: "0,20–0,40", className: "bg-yellow-400" },
  { label: "Vigor médio", value: "0,40–0,60", className: "bg-lime-500" },
  { label: "Vigor alto", value: "> 0,60", className: "bg-green-700" },
];

export default function NdviLegend() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Legenda NDVI</p>
      <div className="mt-3 space-y-2">
        {bands.map((band) => (
          <div key={band.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-slate-700">
              <span className={`h-3 w-3 rounded-full ${band.className}`} />
              {band.label}
            </span>
            <span className="font-semibold text-slate-500">{band.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
