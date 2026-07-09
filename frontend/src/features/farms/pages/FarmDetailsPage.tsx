import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Brain,
  CalendarDays,
  CloudSun,
  MapPin,
  Plus,
  Sprout,
  Tractor,
} from "lucide-react";

import MapView from "../../maps/components/MapView";
import type { Farm } from "../types/farm";

export default function FarmDetailsPage() {
  const { farmId } = useParams();

  const savedFarms = localStorage.getItem("agrios-farms");
  const farms = savedFarms ? (JSON.parse(savedFarms) as Farm[]) : [];

  const farm = farms.find((item) => item.id === farmId);

  if (!farm) {
    return (
      <section className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Exploração não encontrada
        </h1>

        <button
          onClick={() => window.history.back()}
          className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
        >
          Voltar
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-sm font-semibold text-green-700"
      >
        <ArrowLeft size={18} />
        Voltar
      </button>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              🌾 {farm.name}
            </h1>

            <p className="mt-2 text-slate-500">
              {farm.owner} • {farm.crop}
            </p>
          </div>

          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
            Online
          </span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-green-50 p-5">
            <Sprout className="text-green-700" />
            <p className="mt-3 text-sm text-slate-500">Cultura</p>
            <h3 className="text-2xl font-bold">{farm.crop}</h3>
          </div>

          <div className="rounded-2xl bg-blue-50 p-5">
            <MapPin className="text-blue-700" />
            <p className="mt-3 text-sm text-slate-500">Área</p>
            <h3 className="text-2xl font-bold">{farm.area} ha</h3>
          </div>

          <div className="rounded-2xl bg-orange-50 p-5">
            <Tractor className="text-orange-700" />
            <p className="mt-3 text-sm text-slate-500">Máquinas</p>
            <h3 className="text-2xl font-bold">0</h3>
          </div>

          <div className="rounded-2xl bg-violet-50 p-5">
            <Brain className="text-violet-700" />
            <p className="mt-3 text-sm text-slate-500">Alertas IA</p>
            <h3 className="text-2xl font-bold">0</h3>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Mapa da Exploração
              </h2>

              <p className="mt-1 text-slate-500">
                Localização, talhões e operações da propriedade.
              </p>
            </div>

            <button className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800">
              <Plus size={18} />
              Adicionar Talhão
            </button>
          </div>

          <div className="h-125">
            <MapView farms={[farm]} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <CloudSun className="text-blue-700" />
              Clima
            </h2>

            <p className="mt-4 text-3xl font-bold">22°C</p>
            <p className="text-slate-500">Céu limpo</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <CalendarDays className="text-green-700" />
              Agenda
            </h2>

            <p className="mt-4 text-slate-500">
              Nenhuma tarefa cadastrada.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <BarChart3 className="text-emerald-700" />
              Financeiro
            </h2>

            <p className="mt-4 text-3xl font-bold">€0</p>
            <p className="text-slate-500">Resultado atual</p>
          </div>
        </div>
      </div>
    </section>
  );
}