import type { SatelliteObservation } from "../types/precision";

export default function ObservationTrend({ observations }: { observations: SatelliteObservation[] }) {
  if (!observations.length) return <div className="rounded-xl bg-slate-50 p-6 text-sm text-slate-500">Sem observações para o filtro selecionado.</div>;
  const max = Math.max(...observations.map((item) => item.averageValue), 0.1);
  return (
    <div className="space-y-3">
      {observations.map((item) => (
        <div key={item.id} className="grid grid-cols-[92px_minmax(0,1fr)_48px] items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">{new Date(`${item.capturedAt}T00:00:00`).toLocaleDateString("pt-PT", { day: "2-digit", month: "short" })}</span>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-green-600 transition-all" style={{ width: `${Math.max(5, (item.averageValue / max) * 100)}%` }} />
          </div>
          <strong className="text-right text-sm text-slate-800">{item.averageValue.toFixed(2)}</strong>
        </div>
      ))}
    </div>
  );
}
