import type { CropDistributionItem } from "../types/analytics";

interface Props {
  items: CropDistributionItem[];
}

export default function CropDistributionPanel({ items }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Culturas por área</h2>
      <p className="mt-1 text-sm text-slate-500">
        Distribuição da área real dos talhões por cultura.
      </p>

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            Ainda não existem talhões para analisar.
          </p>
        ) : (
          items.slice(0, 8).map((item) => (
            <div key={item.crop} className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800">{item.crop}</p>
                  <p className="text-sm text-slate-500">{item.fieldCount} talhão(ões)</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{item.area.toFixed(2)} ha</p>
                  <p className="text-sm text-slate-500">{item.percentage.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
