import { useState } from "react";

import {
  Brain,
  CloudSun,
  ClipboardList,
  Map,
  MapPinned,
  Plus,
  Satellite,
  Sprout,
  Tractor,
  TrendingUp,
} from "lucide-react";

import MapView from "../../maps/components/MapView";
import FarmDrawer from "../../farms/components/FarmDrawer";
import type { Farm } from "../../farms/types/farm";

const widgets = [
  { title: "Clima", value: "22°C", description: "Chuva prevista às 16:00", icon: CloudSun, color: "bg-blue-100 text-blue-700" },
  { title: "IA Agrícola", value: "3 alertas", description: "Talhão Norte requer atenção", icon: Brain, color: "bg-violet-100 text-violet-700" },
  { title: "Máquinas", value: "4 ativas", description: "1 manutenção pendente", icon: Tractor, color: "bg-orange-100 text-orange-700" },
  { title: "Saúde das Culturas", value: "87%", description: "Índice médio", icon: Sprout, color: "bg-green-100 text-green-700" },
  { title: "ROI", value: "€2.430", description: "Estimativa mensal", icon: TrendingUp, color: "bg-emerald-100 text-emerald-700" },
  { title: "Tarefas", value: "8", description: "3 críticas hoje", icon: ClipboardList, color: "bg-slate-200 text-slate-700" },
];

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [farms, setFarms] = useState<Farm[]>([]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Centro de Operações
        </h1>

        <p className="mt-1 text-slate-500">
          Monitorização inteligente da exploração agrícola.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-4">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="flex items-center gap-3 text-2xl font-bold">
                  <Map className="text-green-700" />
                  Mapa Inteligente
                </h2>

                <p className="mt-1 text-slate-500">
                  Explorações • Talhões • Satélite • IA • Sensores
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                >
                  <Plus size={18} />
                  Nova Exploração
                </button>

                <button className="rounded-xl border px-4 py-2 hover:bg-slate-100">
                  Talhões
                </button>
              </div>
            </div>

            <div className="relative h-180">
              <MapView farms={farms} />

              <div className="absolute left-6 top-6 flex flex-col gap-3">
                <button className="rounded-xl bg-white p-3 shadow hover:bg-slate-100">
                  <Satellite />
                </button>

                <button className="rounded-xl bg-white p-3 shadow hover:bg-slate-100">
                  <MapPinned />
                </button>
              </div>
            </div>

            {farms.length > 0 && (
              <div className="border-t border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Explorações cadastradas
                </h3>

                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {farms.map((farm) => (
                    <div
                      key={farm.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <h4 className="font-bold text-slate-900">{farm.name}</h4>
                      <p className="text-sm text-slate-500">{farm.owner}</p>
                      <p className="mt-2 text-sm text-slate-700">
                        {farm.area} ha • {farm.crop}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        GPS: {farm.latitude}, {farm.longitude}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {widgets.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${item.color}`}>
                    <Icon size={22} />
                  </div>

                  <span className="text-xs font-bold text-green-700">
                    AgriOS
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-500">{item.title}</p>
                <h3 className="mt-1 text-3xl font-bold">{item.value}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <FarmDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreateFarm={(farm) => setFarms((current) => [...current, farm])}
      />
    </section>
  );
}