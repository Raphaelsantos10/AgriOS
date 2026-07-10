import { useEffect, useState } from "react";
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
import { getFarmById } from "../services/farmsService";

import FieldDrawer from "../../fields/components/FieldDrawer";
import type { Field, PolygonGeometry } from "../../fields/types/field";
import {
  createField,
  deleteField,
  getFieldsByFarm,
} from "../../fields/services/fieldsService";

function getStatusLabel(status: Field["status"]) {
  if (status === "healthy") return "Saudável";
  if (status === "attention") return "Atenção";
  return "Crítico";
}

function getStatusClass(status: Field["status"]) {
  if (status === "healthy") return "bg-green-100 text-green-700";
  if (status === "attention") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function FarmDetailsPage() {
  const { farmId } = useParams();

  const [farm, setFarm] = useState<Farm | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [selectedGeometry, setSelectedGeometry] =
    useState<PolygonGeometry | null>(null);
  const [calculatedArea, setCalculatedArea] = useState(0);
  const [loadingFarm, setLoadingFarm] = useState(true);
  const [loadingFields, setLoadingFields] = useState(true);

  useEffect(() => {
    async function loadFarm() {
      if (!farmId) return;

      try {
        setLoadingFarm(true);
        const data = await getFarmById(farmId);
        setFarm(data);
      } catch (error) {
        console.error("FARM LOAD ERROR:", error);
        setFarm(null);
      } finally {
        setLoadingFarm(false);
      }
    }

    loadFarm();
  }, [farmId]);

  useEffect(() => {
    async function loadFields() {
      if (!farmId) return;

      try {
        setLoadingFields(true);
        const data = await getFieldsByFarm(farmId);
        setFields(data);
      } catch (error) {
        console.error("FIELDS LOAD ERROR:", error);
        alert("Erro ao carregar talhões.");
      } finally {
        setLoadingFields(false);
      }
    }

    loadFields();
  }, [farmId]);

  function handleStartDrawing() {
    setSelectedGeometry(null);
    setCalculatedArea(0);
    setDrawingMode(true);
    alert("Clique no mapa para desenhar o talhão. Faça pelo menos 3 cliques e depois clique em Concluir.");
  }

  function handlePolygonCreated(geometry: PolygonGeometry, area: number) {
    setSelectedGeometry(geometry);
    setCalculatedArea(area);
    setDrawingMode(false);
    setDrawerOpen(true);
  }

  async function handleCreateField(field: Omit<Field, "id" | "created_at">) {
    const createdField = await createField(field);
    setFields((current) => [createdField, ...current]);
    setSelectedGeometry(null);
    setCalculatedArea(0);
  }

  async function handleDeleteField(fieldId: string) {
    const confirmDelete = window.confirm(
      "Tem a certeza que pretende apagar este talhão?"
    );

    if (!confirmDelete) return;

    try {
      await deleteField(fieldId);
      setFields((current) => current.filter((field) => field.id !== fieldId));
    } catch (error) {
      console.error("DELETE FIELD ERROR:", error);
      alert("Erro ao apagar talhão.");
    }
  }

  if (loadingFarm) {
    return (
      <section className="space-y-6">
        <p className="text-slate-500">A carregar exploração...</p>
      </section>
    );
  }

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
            <p className="mt-3 text-sm text-slate-500">Talhões</p>
            <h3 className="text-2xl font-bold">{fields.length}</h3>
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
                {drawingMode
                  ? "Modo desenho ativo: clique no mapa para criar o talhão."
                  : "Localização, talhões e operações da propriedade."}
              </p>
            </div>

            <button
              onClick={handleStartDrawing}
              className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800"
            >
              <Plus size={18} />
              Adicionar Talhão
            </button>
          </div>

          <div className="h-125">
            <MapView
              farms={[farm]}
              fields={fields}
              drawingMode={drawingMode}
              onPolygonCreated={handlePolygonCreated}
            />
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

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Talhões da Exploração
            </h2>

            <p className="mt-1 text-slate-500">
              Áreas produtivas cadastradas para esta exploração.
            </p>
          </div>

          <button
            onClick={handleStartDrawing}
            className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800"
          >
            <Plus size={18} />
            Novo Talhão
          </button>
        </div>

        {loadingFields ? (
          <p className="mt-6 text-slate-500">A carregar talhões...</p>
        ) : fields.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <h3 className="font-bold text-slate-900">
              Nenhum talhão cadastrado
            </h3>

            <p className="mt-2 text-slate-500">
              Clique em “Novo Talhão” e desenhe a área no mapa.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fields.map((field) => (
              <div
                key={field.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      🌱 {field.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {field.crop}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                      field.status
                    )}`}
                  >
                    {getStatusLabel(field.status)}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    📐 <strong>{field.area.toFixed(2)} ha</strong>
                  </p>

                  <p>🌾 {field.crop}</p>
                </div>

                <div className="mt-5 flex gap-3">
                  <button className="flex-1 rounded-xl border border-slate-200 py-2 hover:bg-slate-100">
                    Editar
                  </button>

                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FieldDrawer
        open={drawerOpen}
        farmId={farm.id}
        geometry={selectedGeometry}
        calculatedArea={calculatedArea}
        onClose={() => setDrawerOpen(false)}
        onCreateField={handleCreateField}
      />
    </section>
  );
}