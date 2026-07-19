import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Pencil,
  Plus,
  Search,
  Sprout,
  Trash2,
} from "lucide-react";

import type { Farm } from "../types/farm";
import {
  createFarm,
  deleteFarm,
  getFarms,
  updateFarm,
} from "../services/farmsService";
import type { FarmInput } from "../services/farmsService";

import FarmDrawer from "../components/FarmDrawer";

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    async function loadFarms() {
      try {
        const data = await getFarms();

        if (active) {
          setFarms(data);
        }
      } catch (error) {
        console.error("FARMS LOAD ERROR:", error);
        alert("Erro ao carregar explorações.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFarms();

    return () => {
      active = false;
    };
  }, []);

  const filteredFarms = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return farms;
    }

    return farms.filter((farm) => {
      return (
        farm.name.toLowerCase().includes(term) ||
        farm.owner.toLowerCase().includes(term) ||
        farm.crop.toLowerCase().includes(term)
      );
    });
  }, [farms, search]);

  function handleOpenCreate() {
    setEditingFarm(null);
    setDrawerOpen(true);
  }

  function handleOpenEdit(farm: Farm) {
    setEditingFarm(farm);
    setDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setDrawerOpen(false);
    setEditingFarm(null);
  }

  async function handleCreateFarm(farm: FarmInput) {
    const createdFarm = await createFarm(farm);

    setFarms((current) => [
      createdFarm,
      ...current,
    ]);
  }

  async function handleUpdateFarm(farm: Farm) {
    const updatedFarm = await updateFarm(farm);

    setFarms((current) =>
      current.map((item) =>
        item.id === updatedFarm.id
          ? updatedFarm
          : item
      )
    );
  }

  async function handleDeleteFarm(farm: Farm) {
    const confirmed = window.confirm(
      `Tem a certeza que pretende apagar a exploração "${farm.name}"?\n\nTodos os talhões ligados também serão apagados.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFarm(farm.id);

      setFarms((current) =>
        current.filter((item) => item.id !== farm.id)
      );
    } catch (error) {
      console.error("FARM DELETE ERROR:", error);
      alert("Não foi possível apagar a exploração.");
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Explorações
          </h1>

          <p className="mt-1 text-slate-500">
            Gestão das propriedades agrícolas cadastradas no AgriOS.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          <Plus size={19} />
          Nova Exploração
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Search size={20} className="text-slate-400" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full bg-transparent outline-none"
          placeholder="Pesquisar por exploração, proprietário ou cultura..."
        />

        {!loading && (
          <span className="whitespace-nowrap text-sm font-semibold text-slate-500">
            {filteredFarms.length} resultado(s)
          </span>
        )}
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-500">
            A carregar explorações...
          </p>
        </div>
      ) : filteredFarms.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Nenhuma exploração encontrada
          </h2>

          <p className="mt-2 text-slate-500">
            Crie uma propriedade ou altere o termo da pesquisa.
          </p>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
          >
            <Plus size={18} />
            Criar primeira exploração
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {filteredFarms.map((farm) => (
            <article
              key={farm.id}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
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
                  <span>{farm.crop}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-green-700" />

                  <span>
                    {Number(farm.latitude).toFixed(5)},{" "}
                    {Number(farm.longitude).toFixed(5)}
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Área declarada
                  </span>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {farm.area} hectares
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-[1fr_auto_auto] gap-2">
                <Link
                  to={`/exploracoes/${farm.id}`}
                  className="rounded-xl bg-green-700 px-4 py-3 text-center font-semibold text-white transition hover:bg-green-800"
                >
                  Abrir
                </Link>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(farm)}
                  title="Editar exploração"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteFarm(farm)}
                  title="Apagar exploração"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <FarmDrawer
        open={drawerOpen}
        editingFarm={editingFarm}
        onClose={handleCloseDrawer}
        onCreateFarm={handleCreateFarm}
        onUpdateFarm={handleUpdateFarm}
      />
    </section>
  );
}