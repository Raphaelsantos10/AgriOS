import type { DistributionItem } from "../types/analytics";

interface Props {
  title: string;
  description: string;
  items: DistributionItem[];
}

export default function DistributionPanel({ title, description, items }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>

      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div key={item.key}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-700">{item.label}</span>
              <span className="text-slate-500">
                {item.count} · {item.percentage.toFixed(0)}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all"
                style={{ width: `${Math.max(item.percentage, item.count > 0 ? 3 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
