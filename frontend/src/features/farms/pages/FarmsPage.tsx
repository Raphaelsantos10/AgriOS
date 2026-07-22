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
import { Badge, Button, Card, EmptyState, FilterBar, Input, LoadingState, PageHeader } from "../../../design-system";

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
      <PageHeader eyebrow="Gestão agrícola" title="Explorações" description="Gestão das propriedades agrícolas registadas no FARPHA." actions={<Button onClick={handleOpenCreate}><Plus size={19}/> Nova exploração</Button>}/>

      <FilterBar results={loading ? undefined : filteredFarms.length}><Input aria-label="Pesquisar explorações" value={search} onChange={(event) => setSearch(event.target.value)} leadingIcon={<Search size={18}/>} placeholder="Exploração, proprietário ou cultura…"/></FilterBar>

      {loading ? (
        <LoadingState label="A carregar explorações…"/>
      ) : filteredFarms.length === 0 ? (
        <EmptyState icon={Sprout} title="Nenhuma exploração encontrada" description="Crie uma propriedade ou altere o termo da pesquisa." actionLabel="Criar primeira exploração" onAction={handleOpenCreate}/>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {filteredFarms.map((farm) => (
            <Card
              key={farm.id}
              interactive className="group p-6"
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

                <Badge tone="success">Online</Badge>
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
            </Card>
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
