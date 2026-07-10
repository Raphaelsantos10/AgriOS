import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Plus, Sprout } from "lucide-react";

import type { Farm } from "../types/farm";
import { getFarms } from "../services/farmsService";

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFarms() {
      try {
        setLoading(true);
        const data = await getFarms();
        setFarms(data);
      } catch (error) {
        console.error("ERRO AO CARREGAR EXPLORAÇÕES:", error);
        alert("Erro ao carregar explorações do Supabase.");
      } finally {
        setLoading(false);
      }
    }

    loadFarms();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Explorações
          </h1>

          <p className="mt-1 text-slate-500">
            Gestão das propriedades agrícolas cadastradas no AgriOS.
          </p>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
        >
          <Plus size={18} />
          Nova Exploração
        </Link>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-500">A carregar explorações...</p>
        </div>
      ) : farms.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Nenhuma exploração cadastrada
          </h2>

          <p className="mt-2 text-slate-500">
            Crie uma exploração no Centro de Operações para começar.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    🌾 {farm.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {farm.owner}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Online
                </span>
              </div>

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Sprout size={18} className="text-green-700" />
                  {farm.crop}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-green-700" />
                  {farm.latitude}, {farm.longitude}
                </div>

                <div className="font-semibold text-slate-900">
                  {farm.area} hectares
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  to={`/exploracoes/${farm.id}`}
                  className="flex-1 rounded-xl bg-green-700 py-3 text-center font-semibold text-white hover:bg-green-800"
                >
                  Abrir
                </Link>

                <button className="rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-100">
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}