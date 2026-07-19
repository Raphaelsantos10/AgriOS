import type { FarmRankingItem } from "../types/analytics";

interface Props {
  items: FarmRankingItem[];
}

export default function FarmRankingTable({ items }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-slate-900">Ranking das explorações</h2>
        <p className="mt-1 text-sm text-slate-500">
          Área cartografada, atividade operacional e saúde dos talhões.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3">Exploração</th>
              <th className="px-6 py-3">Área</th>
              <th className="px-6 py-3">Talhões</th>
              <th className="px-6 py-3">Missões</th>
              <th className="px-6 py-3">Concluídas</th>
              <th className="px-6 py-3">Saúde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Sem explorações para apresentar.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.farmId} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.farmName}</td>
                  <td className="px-6 py-4 text-slate-600">{item.area.toFixed(2)} ha</td>
                  <td className="px-6 py-4 text-slate-600">{item.fieldCount}</td>
                  <td className="px-6 py-4 text-slate-600">{item.missionCount}</td>
                  <td className="px-6 py-4 text-slate-600">{item.completedMissionCount}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                      {item.healthScore.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
