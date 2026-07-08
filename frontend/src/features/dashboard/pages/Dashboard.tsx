import {
  Brain,
  CloudSun,
  ClipboardList,
  Map,
  Sprout,
  Tractor,
  TrendingUp,
} from "lucide-react";

const cards = [
  {
    title: "Clima",
    value: "22°C",
    icon: CloudSun,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "IA",
    value: "3 Alertas",
    icon: Brain,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Máquinas",
    value: "4 Ativas",
    icon: Tractor,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Culturas",
    value: "87%",
    icon: Sprout,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "ROI",
    value: "€2.430",
    icon: TrendingUp,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Tarefas",
    value: "8",
    icon: ClipboardList,
    color: "bg-slate-200 text-slate-700",
  },
];

export default function Dashboard() {
  return (
    <section className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Centro de Operações
        </h1>

        <p className="text-slate-500">
          Bem-vindo ao AgriOS
        </p>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        <div className="xl:col-span-3 bg-white rounded-3xl shadow border p-6 min-h-155">

          <div className="flex justify-between items-center">

            <h2 className="flex items-center gap-3 text-2xl font-bold">

              <Map className="text-green-700" />

              Mapa da Exploração

            </h2>

            <span className="bg-green-100 text-green-700 rounded-full px-4 py-2 text-sm">

              Online

            </span>

          </div>

          <div className="mt-8 h-125 rounded-3xl border-2 border-dashed border-green-300 flex items-center justify-center bg-green-50">

            <div className="text-center">

              <div className="text-7xl">

                🗺️

              </div>

              <h3 className="text-2xl font-bold mt-5">

                Mapa Inteligente AgriOS

              </h3>

              <p className="mt-3 text-slate-500">

                Aqui aparecerá o mapa com Talhões, GPS, Satélite,
                IA, Sensores e Drones.

              </p>

            </div>

          </div>

        </div>

        <div className="grid gap-4">

          {cards.map((card) => {

            const Icon = card.icon;

            return (

              <div
                key={card.title}
                className="rounded-2xl bg-white border shadow p-5 hover:shadow-lg transition"
              >

                <div className="flex justify-between">

                  <div className={`rounded-xl p-3 ${card.color}`}>

                    <Icon size={22} />

                  </div>

                  <span className="text-xs text-green-700 font-bold">

                    AgriOS

                  </span>

                </div>

                <h3 className="mt-4 text-slate-500">

                  {card.title}

                </h3>

                <p className="text-3xl font-bold">

                  {card.value}

                </p>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}