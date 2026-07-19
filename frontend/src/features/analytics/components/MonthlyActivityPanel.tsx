import type { MonthlyActivityItem } from "../types/analytics";

interface Props {
  items: MonthlyActivityItem[];
}

export default function MonthlyActivityPanel({ items }: Props) {
  const maxValue = Math.max(1, ...items.flatMap((item) => [item.created, item.completed]));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Atividade nos últimos 6 meses</h2>
      <p className="mt-1 text-sm text-slate-500">Missões criadas e concluídas por mês.</p>

      <div className="mt-8 grid h-56 grid-cols-6 items-end gap-3">
        {items.map((item) => (
          <div key={item.monthKey} className="flex h-full flex-col justify-end gap-2">
            <div className="flex flex-1 items-end justify-center gap-1.5">
              <div
                className="w-3 rounded-t bg-slate-300"
                style={{ height: `${Math.max(4, (item.created / maxValue) * 100)}%` }}
                title={`${item.created} criadas`}
              />
              <div
                className="w-3 rounded-t bg-emerald-600"
                style={{ height: `${Math.max(4, (item.completed / maxValue) * 100)}%` }}
                title={`${item.completed} concluídas`}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium capitalize text-slate-600">{item.label}</p>
              <p className="text-[11px] text-slate-400">
                {item.created}/{item.completed}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded bg-slate-300" />Criadas</span>
        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded bg-emerald-600" />Concluídas</span>
      </div>
    </section>
  );
}
