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

import FieldDrawer from "../../fields/components/FieldDrawer";
import FieldDetailsPanel from "../../fields/components/FieldDetailsPanel";

import type {
  Field,
  PolygonGeometry,
} from "../../fields/types/field";

import {
  createField,
  deleteField,
  getFieldsByFarm,
  updateField,
} from "../../fields/services/fieldsService";

import type { Farm } from "../types/farm";

import {
  getFarmById,
} from "../services/farmsService";

function getStatusLabel(
  status: Field["status"]
) {
  if (status === "healthy") {
    return "Saudável";
  }

  if (status === "attention") {
    return "Atenção";
  }

  return "Crítico";
}

function getStatusClass(
  status: Field["status"]
) {
  if (status === "healthy") {
    return "bg-green-100 text-green-700";
  }

  if (status === "attention") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-red-100 text-red-700";
}

export default function FarmDetailsPage() {
  const { farmId } = useParams<{
    farmId: string;
  }>();

  const [farm, setFarm] =
    useState<Farm | null>(null);

  const [fields, setFields] =
    useState<Field[]>([]);

  const [loadingFarm, setLoadingFarm] =
    useState(true);

  const [
    loadingFields,
    setLoadingFields,
  ] = useState(true);

  const [
    fieldDrawerOpen,
    setFieldDrawerOpen,
  ] = useState(false);

  const [
    editingField,
    setEditingField,
  ] = useState<Field | null>(null);

  const [
    selectedField,
    setSelectedField,
  ] = useState<Field | null>(null);

  const [
    focusFieldId,
    setFocusFieldId,
  ] = useState<string | null>(null);

  const [
    drawingMode,
    setDrawingMode,
  ] = useState(false);

  const [
    selectedGeometry,
    setSelectedGeometry,
  ] = useState<PolygonGeometry | null>(
    null
  );

  const [
    calculatedArea,
    setCalculatedArea,
  ] = useState(0);

  const [editGeometryMode, setEditGeometryMode] = useState(false);
  const [editableGeometry, setEditableGeometry] = useState<PolygonGeometry | null>(null);
  const [editableArea, setEditableArea] = useState(0);
  const [savingGeometry, setSavingGeometry] = useState(false);

  /*
   * CARREGAR EXPLORAÇÃO
   */
  useEffect(() => {
    let active = true;

    async function loadFarm() {
      if (!farmId) {
        if (active) {
          setLoadingFarm(false);
        }

        return;
      }

      try {
        const data =
          await getFarmById(farmId);

        if (active) {
          setFarm(data);
        }
      } catch (error) {
        console.error(
          "FARM LOAD ERROR:",
          error
        );

        if (active) {
          setFarm(null);
        }
      } finally {
        if (active) {
          setLoadingFarm(false);
        }
      }
    }

    loadFarm();

    return () => {
      active = false;
    };
  }, [farmId]);

  /*
   * CARREGAR TALHÕES
   */
  useEffect(() => {
    let active = true;

    async function loadFields() {
      if (!farmId) {
        if (active) {
          setLoadingFields(false);
        }

        return;
      }

      try {
        const data =
          await getFieldsByFarm(farmId);

        if (active) {
          setFields(data);
        }
      } catch (error) {
        console.error(
          "FIELDS LOAD ERROR:",
          error
        );

        if (active) {
          alert(
            "Não foi possível carregar os talhões."
          );
        }
      } finally {
        if (active) {
          setLoadingFields(false);
        }
      }
    }

    loadFields();

    return () => {
      active = false;
    };
  }, [farmId]);

  /*
   * INICIAR DESENHO
   */
  function handleStartDrawing() {
    setEditGeometryMode(false);
    setEditableGeometry(null);
    setSelectedField(null);
    setFocusFieldId(null);
    setEditingField(null);
    setSelectedGeometry(null);
    setCalculatedArea(0);
    setFieldDrawerOpen(false);
    setDrawingMode(true);
  }

  /*
   * POLÍGONO CONCLUÍDO
   */
  function handlePolygonCreated(
    geometry: PolygonGeometry,
    area: number
  ) {
    setSelectedGeometry(geometry);
    setCalculatedArea(area);
    setDrawingMode(false);
    setEditingField(null);
    setFieldDrawerOpen(true);
  }

  /*
   * CRIAR TALHÃO
   */
  async function handleCreateField(
    field: Omit<
      Field,
      "id" | "created_at"
    >
  ) {
    try {
      const createdField =
        await createField(field);

      setFields((current) => [
        createdField,
        ...current,
      ]);

      setSelectedGeometry(null);
      setCalculatedArea(0);
      setDrawingMode(false);
      setFieldDrawerOpen(false);

      setSelectedField(
        createdField
      );

      setFocusFieldId(
        createdField.id
      );
    } catch (error) {
      console.error(
        "FIELD CREATE ERROR:",
        error
      );

      throw error;
    }
  }

  /*
   * ABRIR EDIÇÃO DO TALHÃO
   */
  function handleEditField(
    field: Field
  ) {
    setDrawingMode(false);
    setSelectedGeometry(null);
    setCalculatedArea(0);
    setEditingField(field);
    setSelectedField(field);
    setFieldDrawerOpen(true);
  }

  /*
   * ATUALIZAR TALHÃO
   */
  async function handleUpdateField(
    field: Field
  ) {
    try {
      const updatedField =
        await updateField(field);

      setFields((current) =>
        current.map((item) =>
          item.id === updatedField.id
            ? updatedField
            : item
        )
      );

      setSelectedField(
        updatedField
      );

      setEditingField(null);
      setFieldDrawerOpen(false);
    } catch (error) {
      console.error(
        "FIELD UPDATE ERROR:",
        error
      );

      throw error;
    }
  }

  function handleStartGeometryEdit(field: Field) {
    if (!field.geometry) {
      alert("Este talhão ainda não possui limites válidos.");
      return;
    }

    setDrawingMode(false);
    setFieldDrawerOpen(false);
    setEditingField(null);
    setSelectedField(field);
    setEditableGeometry(field.geometry);
    setEditableArea(Number(field.area) || 0);
    setEditGeometryMode(true);
    setFocusFieldId(field.id);
  }

  function handleGeometryChange(geometry: PolygonGeometry, area: number) {
    setEditableGeometry(geometry);
    setEditableArea(area);
    setSelectedField((current) =>
      current ? { ...current, geometry, area } : current
    );
  }

  function handleCancelGeometryEdit() {
    const original = fields.find((field) => field.id === selectedField?.id) ?? null;
    setSelectedField(original);
    setEditableGeometry(null);
    setEditableArea(0);
    setEditGeometryMode(false);
  }

  async function handleSaveGeometryEdit() {
    if (!selectedField || !editableGeometry) return;

    try {
      setSavingGeometry(true);
      const updatedField = await updateField({
        ...selectedField,
        geometry: editableGeometry,
        area: editableArea,
      });

      setFields((current) =>
        current.map((item) => item.id === updatedField.id ? updatedField : item)
      );
      setSelectedField(updatedField);
      setEditableGeometry(null);
      setEditableArea(0);
      setEditGeometryMode(false);
    } catch (error) {
      console.error("FIELD GEOMETRY UPDATE ERROR:", error);
      alert("Não foi possível guardar os novos limites do talhão.");
    } finally {
      setSavingGeometry(false);
    }
  }

  /*
   * APAGAR TALHÃO
   */
  async function handleDeleteField(
    field: Field
  ) {
    const confirmed =
      window.confirm(
        `Tem a certeza que pretende apagar o talhão "${field.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteField(field.id);

      setFields((current) =>
        current.filter(
          (item) =>
            item.id !== field.id
        )
      );

      if (
        selectedField?.id ===
        field.id
      ) {
        setSelectedField(null);
      }

      if (
        editingField?.id ===
        field.id
      ) {
        setEditingField(null);
        setFieldDrawerOpen(false);
      }

      if (
        focusFieldId === field.id
      ) {
        setFocusFieldId(null);
      }
    } catch (error) {
      console.error(
        "FIELD DELETE ERROR:",
        error
      );

      alert(
        "Não foi possível apagar o talhão."
      );
    }
  }

  /*
   * SELECIONAR TALHÃO NO MAPA
   */
  function handleFieldSelect(
    field: Field | null
  ) {
    if (drawingMode) {
      return;
    }

    setSelectedField(field);

    if (!field) {
      setFocusFieldId(null);
    }
  }

  /*
   * CENTRALIZAR TALHÃO
   */
  function handleCenterField(
    field: Field
  ) {
    setSelectedField(field);

    /*
     * Limpa primeiro para permitir
     * centralizar novamente o mesmo talhão.
     */
    setFocusFieldId(null);

    window.setTimeout(() => {
      setFocusFieldId(field.id);
    }, 0);
  }

  /*
   * FECHAR DRAWER
   */
  function handleCloseFieldDrawer() {
    setFieldDrawerOpen(false);
    setEditingField(null);

    if (!editingField) {
      setSelectedGeometry(null);
      setCalculatedArea(0);
    }
  }

  /*
   * ESTADO DE CARREGAMENTO
   */
  if (loadingFarm) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-500">
            A carregar exploração...
          </p>
        </div>
      </section>
    );
  }

  /*
   * EXPLORAÇÃO NÃO ENCONTRADA
   */
  if (!farm) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Exploração não encontrada
          </h1>

          <p className="mt-2 text-slate-500">
            A exploração pode ter sido
            apagada ou o endereço está
            incorreto.
          </p>

          <button
            type="button"
            onClick={() =>
              window.history.back()
            }
            className="mt-6 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Voltar
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="space-y-6">
        {/* VOLTAR */}
        <button
          type="button"
          onClick={() =>
            window.history.back()
          }
          className="flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800"
        >
          <ArrowLeft size={18} />
          Voltar às explorações
        </button>

        {/* CABEÇALHO DA EXPLORAÇÃO */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-green-700">
                Exploração agrícola
              </p>

              <h1 className="mt-2 text-4xl font-bold text-slate-900">
                🌾 {farm.name}
              </h1>

              <p className="mt-2 text-slate-500">
                {farm.owner} •{" "}
                {farm.crop}
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
              Online
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-green-50 p-5">
              <Sprout className="text-green-700" />

              <p className="mt-3 text-sm text-slate-500">
                Cultura principal
              </p>

              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                {farm.crop}
              </h3>
            </div>

            <div className="rounded-2xl bg-blue-50 p-5">
              <MapPin className="text-blue-700" />

              <p className="mt-3 text-sm text-slate-500">
                Área declarada
              </p>

              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                {farm.area} ha
              </h3>
            </div>

            <div className="rounded-2xl bg-orange-50 p-5">
              <Tractor className="text-orange-700" />

              <p className="mt-3 text-sm text-slate-500">
                Máquinas
              </p>

              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                0
              </h3>
            </div>

            <div className="rounded-2xl bg-violet-50 p-5">
              <Brain className="text-violet-700" />

              <p className="mt-3 text-sm text-slate-500">
                Talhões
              </p>

              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                {fields.length}
              </h3>
            </div>
          </div>
        </div>

        {/* MAPA E PAINÉIS */}
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Mapa da Exploração
                </h2>

                <p className="mt-1 text-slate-500">
                  {drawingMode
                    ? "Modo de desenho ativo. Marque os limites do novo talhão."
                    : selectedField
                      ? `Talhão selecionado: ${selectedField.name}`
                      : "Selecione um talhão no mapa para visualizar os seus detalhes."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleStartDrawing
                }
                disabled={drawingMode || editGeometryMode}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={18} />

                {drawingMode
                  ? "A desenhar..."
                  : "Adicionar Talhão"}
              </button>
            </div>

            <div className="h-150">
              <MapView
                farms={[farm]}
                fields={fields}
                drawingMode={
                  drawingMode
                }
                selectedFieldId={
                  selectedField?.id ??
                  null
                }
                focusFieldId={
                  focusFieldId
                }
                editGeometryMode={editGeometryMode}
                editableGeometry={editableGeometry}
                onGeometryChange={handleGeometryChange}
                onFieldSelect={
                  handleFieldSelect
                }
                onPolygonCreated={
                  handlePolygonCreated
                }
              />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <CloudSun className="text-blue-700" />
                Clima
              </h2>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                22°C
              </p>

              <p className="text-slate-500">
                Céu limpo
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <CalendarDays className="text-green-700" />
                Agenda
              </h2>

              <p className="mt-4 text-slate-500">
                Nenhuma tarefa cadastrada.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <BarChart3 className="text-emerald-700" />
                Financeiro
              </h2>

              <p className="mt-4 text-3xl font-bold text-slate-900">
                €0
              </p>

              <p className="text-slate-500">
                Resultado atual
              </p>
            </div>
          </aside>
        </div>

        {/* LISTA DE TALHÕES */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Talhões da Exploração
              </h2>

              <p className="mt-1 text-slate-500">
                Áreas produtivas cadastradas
                nesta propriedade.
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleStartDrawing
              }
              disabled={drawingMode}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} />
              Novo Talhão
            </button>
          </div>

          {loadingFields ? (
            <p className="mt-6 text-slate-500">
              A carregar talhões...
            </p>
          ) : fields.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <h3 className="font-bold text-slate-900">
                Nenhum talhão cadastrado
              </h3>

              <p className="mt-2 text-slate-500">
                Clique em “Novo Talhão” e
                desenhe os limites no mapa.
              </p>

              <button
                type="button"
                onClick={
                  handleStartDrawing
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                <Plus size={18} />
                Criar primeiro talhão
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {fields.map((field) => {
                const isSelected =
                  selectedField?.id ===
                  field.id;

                return (
                  <article
                    key={field.id}
                    onClick={() => {
                      setSelectedField(
                        field
                      );

                      handleCenterField(
                        field
                      );
                    }}
                    className={`cursor-pointer rounded-2xl border p-5 transition duration-300 ${
                      isSelected
                        ? "border-green-500 bg-green-50 shadow-lg ring-4 ring-green-100"
                        : "border-slate-200 bg-slate-50 hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
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
                        {getStatusLabel(
                          field.status
                        )}
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl bg-white px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Área
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {Number(
                          field.area
                        ).toFixed(2)}{" "}
                        ha
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={(
                          event
                        ) => {
                          event.stopPropagation();

                          handleEditField(
                            field
                          );
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={(
                          event
                        ) => {
                          event.stopPropagation();

                          handleDeleteField(
                            field
                          );
                        }}
                        className="rounded-xl border border-red-200 bg-white px-4 py-2.5 font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Apagar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* DRAWER CRIAR/EDITAR TALHÃO */}
        <FieldDrawer
          open={fieldDrawerOpen}
          farmId={farm.id}
          geometry={selectedGeometry}
          calculatedArea={
            calculatedArea
          }
          editingField={editingField}
          onClose={
            handleCloseFieldDrawer
          }
          onCreateField={
            handleCreateField
          }
          onUpdateField={
            handleUpdateField
          }
        />
      </section>

      {/* PAINEL GIS DO TALHÃO */}
      <FieldDetailsPanel
        field={selectedField}
        onClose={() => {
          if (editGeometryMode) return;
          setSelectedField(null);
          setFocusFieldId(null);
        }}
        onEdit={
          handleEditField
        }
        isEditingGeometry={editGeometryMode}
        isSavingGeometry={savingGeometry}
        onEditGeometry={handleStartGeometryEdit}
        onSaveGeometry={handleSaveGeometryEdit}
        onCancelGeometry={handleCancelGeometryEdit}
        onCenter={
          handleCenterField
        }
        onDelete={
          handleDeleteField
        }
      />
    </>
  );
}