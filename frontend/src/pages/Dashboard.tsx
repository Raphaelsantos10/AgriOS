import {
  Brain,
  CloudSun,
  ClipboardList,
  Map,
  Sprout,
  Tractor,
  TrendingUp,
} from "lucide-react";

const widgets = [
  {
    title: "Clima",
    value: "22°C",
    description: "Chuva prevista às 16:00",
    icon: CloudSun,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "IA Agrícola",
    value: "3 alertas",
    description: "Talhão Norte requer atenção",
    icon: Brain,
    color: "bg-violet-100 text-violet-700",
  },
  {
    title: "Máquinas",
    value: "4 ativas",
    description: "1 manutenção pendente",
    icon: Tractor,
    color: "bg-orange-100 text-orange-700",
  },
  {
    title: "Saúde",
    value: "87%",
    description: "Índice médio das culturas",
    icon: Sprout,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "ROI",
    value: "€2.430",
    description: "Estimativa mensal",
    icon: TrendingUp,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Tarefas",
    value: "8",
    description: "3 críticas hoje",
    icon: ClipboardList,
    color: "bg-slate-200 text-slate-700",
  },
];

export default function Dashboard() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Centro de Operações
        </h1>
        <p className="mt-1 text-slate-500">
          Visão inteligente da sua exploração agrícola.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="min-h-155 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                <Map className="text-green-700" />
                Mapa da Exploração
              </h2>
              <p className="mt-2 text-slate-500">
                Futuramente aqui estará o mapa interativo com GPS, talhões,
                satélite, sensores e drones.
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              Online
            </span>
          </div>

          <div className="mt-8 flex h-125 items-center justify-center rounded-3xl border-2 border-dashed border-green-200 bg-green-50">
            <div className="text-center">
              <div className="text-7xl">🗺️</div>
              <h3 className="mt-6 text-2xl font-bold text-green-800">
                Centro Inteligente AgriOS
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-slate-600">
                Este espaço será responsável por visualizar talhões, sensores,
                máquinas, drones, satélite e inteligência artificial em tempo
                real.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {widgets.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${item.color}`}>
                    <Icon size={22} />
                  </div>

                  <span className="text-xs font-semibold text-green-700">
                    AgriOS
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-medium text-slate-500">
                  {item.title}
                </h3>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {item.value}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}