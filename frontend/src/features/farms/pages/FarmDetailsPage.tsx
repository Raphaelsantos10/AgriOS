import { useEffect, useRef, useState } from "react";
import * as turf from "@turf/turf";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  AlertTriangle,
  BarChart3,
  Brain,
  CalendarDays,
  CloudSun,
  Download,
  MapPin,
  Plus,
  Sprout,
  Tractor,
  Upload,
} from "lucide-react";

import MapView from "../../maps/components/MapView";
import {
  exportFieldAsGeoJSON,
  exportFieldsAsGeoJSON,
} from "../../maps/utils/geojsonExport";
import {
  exportFieldAsKML,
  exportFieldsAsKML,
} from "../../maps/utils/kml";
import GeoJSONImportDialog from "../../maps/components/GeoJSONImportDialog";
import SplitFieldDialog from "../../maps/components/SplitFieldDialog";
import MergeFieldDialog from "../../maps/components/MergeFieldDialog";
import { splitPolygonByLine } from "../../maps/utils/splitPolygon";
import { mergePolygonGeometries } from "../../maps/utils/mergePolygons";
import type { ImportedFieldCandidate } from "../../maps/utils/geojsonImport";

import FieldDrawer from "../../fields/components/FieldDrawer";
import FieldDetailsPanel from "../../fields/components/FieldDetailsPanel";
import FieldHistoryDialog from "../../fields/components/FieldHistoryDialog";

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
import { createFieldHistorySnapshot } from "../../fields/services/fieldHistoryService";
import type { FieldHistory } from "../../fields/types/fieldHistory";
import { downloadFieldIntegratedReport } from "../../fields/utils/fieldIntegratedReport";
import { getEnvironmentProfile } from "../../environment/services/environmentService";
import { getIrrigationEvents, getIrrigationSystem } from "../../irrigation/services/irrigationService";
import { getLatestFireAssessment } from "../../fire/services/fireService";
import {
  buildFarmOverview,
  downloadFarmOverviewCsv,
  type FieldModuleCoverage,
} from "../utils/farmOverview";
import {
  buildAgriculturalAlerts,
  downloadAgriculturalAlertsCsv,
} from "../utils/agriculturalAlerts";

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

type GeometryHistoryEntry = {
  geometry: PolygonGeometry;
  area: number;
};

function cloneGeometry(geometry: PolygonGeometry): PolygonGeometry {
  return {
    type: "Polygon",
    coordinates: geometry.coordinates.map((ring) =>
      ring.map((coordinate) => [...coordinate])
    ),
  };
}

function geometriesAreEqual(
  first: PolygonGeometry,
  second: PolygonGeometry
) {
  return JSON.stringify(first.coordinates) === JSON.stringify(second.coordinates);
}

function isValidPolygonGeometry(geometry: PolygonGeometry | null): geometry is PolygonGeometry {
  const ring = geometry?.coordinates?.[0];
  if (!ring || ring.length < 4) return false;

  return ring.every(
    (coordinate) =>
      coordinate.length >= 2 &&
      Number.isFinite(coordinate[0]) &&
      Number.isFinite(coordinate[1])
  );
}

export default function FarmDetailsPage() {
  const navigate = useNavigate();
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
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importingGeoJSON, setImportingGeoJSON] = useState(false);
  const [canUndoGeometry, setCanUndoGeometry] = useState(false);
  const [canRedoGeometry, setCanRedoGeometry] = useState(false);
  const [splitMode, setSplitMode] = useState(false);
  const [splitField, setSplitField] = useState<Field | null>(null);
  const [splitGeometries, setSplitGeometries] = useState<[PolygonGeometry, PolygonGeometry] | null>(null);
  const [splitAreas, setSplitAreas] = useState<[number, number] | null>(null);
  const [splitFirstName, setSplitFirstName] = useState("");
  const [splitSecondName, setSplitSecondName] = useState("");
  const [savingSplit, setSavingSplit] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [mergeSourceField, setMergeSourceField] = useState<Field | null>(null);
  const [mergeTargetFieldId, setMergeTargetFieldId] = useState("");
  const [mergeName, setMergeName] = useState("");
  const [savingMerge, setSavingMerge] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyField, setHistoryField] = useState<Field | null>(null);
  const [restoringHistory, setRestoringHistory] = useState(false);
  const [moduleCoverage, setModuleCoverage] = useState<FieldModuleCoverage[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(true);

  const geometryHistoryRef = useRef<GeometryHistoryEntry[]>([]);
  const geometryHistoryIndexRef = useRef(-1);

  function updateGeometryHistoryControls() {
    const index = geometryHistoryIndexRef.current;
    const history = geometryHistoryRef.current;

    setCanUndoGeometry(index > 0);
    setCanRedoGeometry(index >= 0 && index < history.length - 1);
  }

  function resetGeometryHistory(geometry?: PolygonGeometry, area = 0) {
    if (!geometry) {
      geometryHistoryRef.current = [];
      geometryHistoryIndexRef.current = -1;
    } else {
      geometryHistoryRef.current = [
        { geometry: cloneGeometry(geometry), area },
      ];
      geometryHistoryIndexRef.current = 0;
    }

    updateGeometryHistoryControls();
  }

  function applyGeometryHistoryEntry(entry: GeometryHistoryEntry) {
    const geometry = cloneGeometry(entry.geometry);

    setEditableGeometry(geometry);
    setEditableArea(entry.area);
    setSelectedField((current) =>
      current
        ? { ...current, geometry, area: entry.area }
        : current
    );
  }

  function handleUndoGeometry() {
    const nextIndex = geometryHistoryIndexRef.current - 1;

    if (nextIndex < 0) {
      return;
    }

    geometryHistoryIndexRef.current = nextIndex;
    applyGeometryHistoryEntry(geometryHistoryRef.current[nextIndex]);
    updateGeometryHistoryControls();
  }

  function handleRedoGeometry() {
    const nextIndex = geometryHistoryIndexRef.current + 1;

    if (nextIndex >= geometryHistoryRef.current.length) {
      return;
    }

    geometryHistoryIndexRef.current = nextIndex;
    applyGeometryHistoryEntry(geometryHistoryRef.current[nextIndex]);
    updateGeometryHistoryControls();
  }

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

  useEffect(() => {
    let active = true;

    async function loadModuleCoverage() {
      if (loadingFields) return;
      setLoadingOverview(true);

      const result = await Promise.all(fields.map(async (field) => {
        const [environment, irrigation, fire] = await Promise.all([
          getEnvironmentProfile(field.id).catch(() => null),
          getIrrigationSystem(field.id).catch(() => null),
          getLatestFireAssessment(field.id).catch(() => null),
        ]);

        return {
          fieldId: field.id,
          environment: Boolean(environment),
          irrigation: Boolean(irrigation),
          fireAssessment: Boolean(fire),
          fireRiskLevel: fire?.risk_level ?? null,
          irrigationActive: irrigation?.active ?? null,
          reservoirLevelPercent: irrigation?.reservoir_level_percent ?? null,
          climateComplete: Boolean(
            environment &&
            environment.annual_rainfall_mm !== null &&
            environment.average_humidity_percent !== null &&
            environment.min_temperature_c !== null &&
            environment.max_temperature_c !== null
          ),
        } satisfies FieldModuleCoverage;
      }));

      if (active) {
        setModuleCoverage(result);
        setLoadingOverview(false);
      }
    }

    loadModuleCoverage();
    return () => { active = false; };
  }, [fields, loadingFields]);

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

  /* Mantém o painel e o mapa sincronizados após criar, editar ou remover talhões. */
  useEffect(() => {
    if (!selectedField || editGeometryMode) return;

    const currentField = fields.find((field) => field.id === selectedField.id) ?? null;
    const task = window.setTimeout(() => {
      if (!currentField) {
        setSelectedField(null);
        setFocusFieldId(null);
        setFieldDrawerOpen(false);
        setEditingField(null);
        return;
      }

      if (currentField !== selectedField) {
        setSelectedField(currentField);
      }
    }, 0);

    return () => window.clearTimeout(task);
  }, [editGeometryMode, fields, selectedField]);

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

      await createFieldHistorySnapshot(
        createdField,
        "CREATE",
        "Versão inicial do talhão"
      );

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
      const currentField = fields.find((item) => item.id === field.id);
      if (currentField) {
        await createFieldHistorySnapshot(
          currentField,
          "UPDATE",
          "Estado anterior à alteração dos dados"
        );
      }

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
    const initialArea = Number(field.area) || 0;

    setEditableGeometry(cloneGeometry(field.geometry));
    setEditableArea(initialArea);
    resetGeometryHistory(field.geometry, initialArea);
    setEditGeometryMode(true);
    setFocusFieldId(field.id);
  }

  function handleGeometryChange(geometry: PolygonGeometry, area: number) {
    const clonedGeometry = cloneGeometry(geometry);

    setEditableGeometry(clonedGeometry);
    setEditableArea(area);
    setSelectedField((current) =>
      current ? { ...current, geometry: clonedGeometry, area } : current
    );
  }

  function handleGeometryCommit(geometry: PolygonGeometry, area: number) {
    const clonedGeometry = cloneGeometry(geometry);
    const currentEntry =
      geometryHistoryRef.current[geometryHistoryIndexRef.current];

    if (currentEntry && geometriesAreEqual(currentEntry.geometry, clonedGeometry)) {
      return;
    }

    const nextHistory = geometryHistoryRef.current.slice(
      0,
      geometryHistoryIndexRef.current + 1
    );

    nextHistory.push({
      geometry: clonedGeometry,
      area,
    });

    const limitedHistory = nextHistory.slice(-60);
    geometryHistoryRef.current = limitedHistory;
    geometryHistoryIndexRef.current = limitedHistory.length - 1;
    updateGeometryHistoryControls();
  }

  function handleCancelGeometryEdit() {
    const original = fields.find((field) => field.id === selectedField?.id) ?? null;
    setSelectedField(original);
    setEditableGeometry(null);
    setEditableArea(0);
    setEditGeometryMode(false);
    resetGeometryHistory();
  }

  async function handleSaveGeometryEdit() {
    if (!selectedField || !isValidPolygonGeometry(editableGeometry)) {
      alert("Os limites do talhão não são válidos. Confirme os vértices antes de guardar.");
      return;
    }

    if (!Number.isFinite(editableArea) || editableArea <= 0) {
      alert("Não foi possível calcular uma área válida para este talhão.");
      return;
    }

    try {
      setSavingGeometry(true);
      const persistedField = fields.find((item) => item.id === selectedField.id);
      if (persistedField) {
        await createFieldHistorySnapshot(
          persistedField,
          "GEOMETRY",
          "Estado anterior à edição dos limites"
        );
      }

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
      resetGeometryHistory();
    } catch (error) {
      console.error("FIELD GEOMETRY UPDATE ERROR:", error);
      alert("Não foi possível guardar os novos limites do talhão.");
    } finally {
      setSavingGeometry(false);
    }
  }

  useEffect(() => {
    if (!editGeometryMode) {
      return;
    }

    function handleKeyboardShortcut(event: KeyboardEvent) {
      const modifierPressed = event.ctrlKey || event.metaKey;

      if (!modifierPressed) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "z" && event.shiftKey) {
        event.preventDefault();
        handleRedoGeometry();
        return;
      }

      if (key === "z") {
        event.preventDefault();
        handleUndoGeometry();
        return;
      }

      if (key === "y") {
        event.preventDefault();
        handleRedoGeometry();
      }
    }

    window.addEventListener("keydown", handleKeyboardShortcut);

    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
    // Os controladores usam refs mutáveis para manter o histórico atual.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editGeometryMode]);

  async function handleImportGeoJSON(
    candidates: ImportedFieldCandidate[]
  ) {
    if (!farmId || candidates.length === 0) {
      return;
    }

    try {
      setImportingGeoJSON(true);

      const createdFields: Field[] = [];

      for (const candidate of candidates) {
        const createdField = await createField({
          farm_id: farmId,
          name: candidate.name.trim(),
          crop: candidate.crop.trim(),
          area: candidate.area,
          status: candidate.status,
          geometry: candidate.geometry,
        });

        createdFields.push(createdField);
      }

      setFields((current) => [...createdFields, ...current]);
      setImportDialogOpen(false);

      const firstCreated = createdFields[0] ?? null;
      setSelectedField(firstCreated);
      setFocusFieldId(firstCreated?.id ?? null);

      alert(
        `${createdFields.length} talhão(ões) importado(s) com sucesso.`
      );
    } catch (error) {
      console.error("GEOJSON IMPORT ERROR:", error);
      alert(
        "A importação foi interrompida. Verifique os dados e tente novamente."
      );

      const refreshedFields = await getFieldsByFarm(farmId);
      setFields(refreshedFields);
    } finally {
      setImportingGeoJSON(false);
    }
  }

  /*
   * DUPLICAR TALHÃO
   */
  async function handleDuplicateField(field: Field) {
    if (!farmId || !field.geometry) {
      alert("Este talhão não possui limites válidos para duplicar.");
      return;
    }

    const suggestedName = `${field.name} - Cópia`;
    const name = window.prompt("Nome do novo talhão:", suggestedName)?.trim();

    if (!name) {
      return;
    }

    try {
      const originalPolygon = turf.polygon(field.geometry.coordinates);
      const translatedPolygon = turf.transformTranslate(originalPolygon, 8, 45, {
        units: "meters",
      });

      const geometry: PolygonGeometry = {
        type: "Polygon",
        coordinates: translatedPolygon.geometry.coordinates,
      };

      const area = turf.area(translatedPolygon) / 10000;

      const duplicatedField = await createField({
        farm_id: farmId,
        name,
        crop: field.crop,
        area,
        status: field.status,
        geometry,
      });

      setFields((current) => [duplicatedField, ...current]);
      setSelectedField(duplicatedField);
      setFocusFieldId(null);

      window.setTimeout(() => {
        setFocusFieldId(duplicatedField.id);
      }, 0);
    } catch (error) {
      console.error("FIELD DUPLICATE ERROR:", error);
      alert("Não foi possível duplicar o talhão.");
    }
  }

  /*
   * DIVIDIR TALHÃO
   */
  function resetSplitState(keepMode = false) {
    setSplitGeometries(null);
    setSplitAreas(null);
    setSplitFirstName("");
    setSplitSecondName("");

    if (!keepMode) {
      setSplitMode(false);
      setSplitField(null);
    }
  }

  function handleStartSplitField(field: Field) {
    if (!field.geometry) {
      alert("Este talhão não possui limites válidos para dividir.");
      return;
    }

    setDrawingMode(false);
    setEditGeometryMode(false);
    setFieldDrawerOpen(false);
    setEditingField(null);
    setSelectedField(field);
    setSplitField(field);
    setSplitMode(true);
    setSplitGeometries(null);
    setSplitAreas(null);
    setSplitFirstName(`${field.name} A`);
    setSplitSecondName(`${field.name} B`);
    setFocusFieldId(null);

    window.setTimeout(() => setFocusFieldId(field.id), 0);
  }

  function handleSplitLineCreated(coordinates: [number, number][]) {
    if (!splitField?.geometry) {
      return;
    }

    try {
      const result = splitPolygonByLine(splitField.geometry, coordinates);
      setSplitGeometries(result.geometries);
      setSplitAreas(result.areas);
    } catch (error) {
      console.error("FIELD SPLIT PREVIEW ERROR:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível dividir o talhão com esta linha."
      );
    }
  }

  function handleCancelSplitPreview() {
    setSplitGeometries(null);
    setSplitAreas(null);
  }

  function handleCancelSplitMode() {
    resetSplitState();
  }

  async function handleSaveSplit() {
    if (
      !farmId ||
      !splitField ||
      !splitGeometries ||
      !splitAreas
    ) {
      return;
    }

    const firstName = splitFirstName.trim();
    const secondName = splitSecondName.trim();

    if (!firstName || !secondName || firstName.toLowerCase() === secondName.toLowerCase()) {
      alert("Defina dois nomes diferentes para os novos talhões.");
      return;
    }

    const createdIds: string[] = [];

    try {
      setSavingSplit(true);

      const firstField = await createField({
        farm_id: farmId,
        name: firstName,
        crop: splitField.crop,
        area: splitAreas[0],
        status: splitField.status,
        geometry: splitGeometries[0],
      });
      createdIds.push(firstField.id);

      const secondField = await createField({
        farm_id: farmId,
        name: secondName,
        crop: splitField.crop,
        area: splitAreas[1],
        status: splitField.status,
        geometry: splitGeometries[1],
      });
      createdIds.push(secondField.id);

      await deleteField(splitField.id);

      setFields((current) => [
        firstField,
        secondField,
        ...current.filter((field) => field.id !== splitField.id),
      ]);
      setSelectedField(firstField);
      resetSplitState();
      setFocusFieldId(null);
      window.setTimeout(() => setFocusFieldId(firstField.id), 0);
    } catch (error) {
      console.error("FIELD SPLIT SAVE ERROR:", error);

      for (const createdId of createdIds) {
        try {
          await deleteField(createdId);
        } catch (rollbackError) {
          console.error("FIELD SPLIT ROLLBACK ERROR:", rollbackError);
        }
      }

      try {
        const refreshedFields = await getFieldsByFarm(farmId);
        setFields(refreshedFields);
        setSelectedField(
          refreshedFields.find((field) => field.id === splitField.id) ?? null
        );
      } catch (refreshError) {
        console.error("FIELD SPLIT REFRESH ERROR:", refreshError);
      }

      alert("Não foi possível concluir a divisão. O talhão original foi preservado.");
    } finally {
      setSavingSplit(false);
    }
  }

  /*
   * UNIR TALHÕES
   */
  function handleStartMergeField(field: Field) {
    if (!field.geometry) {
      alert("Este talhão não possui limites válidos para unir.");
      return;
    }

    const candidates = fields.filter(
      (candidate) => candidate.id !== field.id && candidate.geometry
    );

    if (candidates.length === 0) {
      alert("Não existem outros talhões com limites válidos para unir.");
      return;
    }

    setMergeSourceField(field);
    setMergeTargetFieldId("");
    setMergeName(`${field.name} +`);
    setMergeDialogOpen(true);
  }

  function handleCloseMergeDialog() {
    if (savingMerge) return;
    setMergeDialogOpen(false);
    setMergeSourceField(null);
    setMergeTargetFieldId("");
    setMergeName("");
  }

  async function handleSaveMerge() {
    if (!farmId || !mergeSourceField?.geometry) return;

    const targetField = fields.find(
      (field) => field.id === mergeTargetFieldId
    );

    if (!targetField?.geometry) {
      alert("Selecione um segundo talhão válido.");
      return;
    }

    const name = mergeName.trim();
    if (!name) {
      alert("Defina o nome do novo talhão.");
      return;
    }

    let createdField: Field | null = null;

    try {
      setSavingMerge(true);
      const result = mergePolygonGeometries(
        mergeSourceField.geometry,
        targetField.geometry
      );

      createdField = await createField({
        farm_id: farmId,
        name,
        crop:
          mergeSourceField.crop === targetField.crop
            ? mergeSourceField.crop
            : `${mergeSourceField.crop} / ${targetField.crop}`,
        area: result.area,
        status:
          mergeSourceField.status === "critical" || targetField.status === "critical"
            ? "critical"
            : mergeSourceField.status === "attention" || targetField.status === "attention"
              ? "attention"
              : "healthy",
        geometry: result.geometry,
      });

      await deleteField(mergeSourceField.id);
      await deleteField(targetField.id);

      setFields((current) => [
        createdField as Field,
        ...current.filter(
          (field) =>
            field.id !== mergeSourceField.id && field.id !== targetField.id
        ),
      ]);
      setSelectedField(createdField);
      setFocusFieldId(null);
      setMergeDialogOpen(false);
      setMergeSourceField(null);
      setMergeTargetFieldId("");
      setMergeName("");
      window.setTimeout(() => setFocusFieldId(createdField?.id ?? null), 0);
    } catch (error) {
      console.error("FIELD MERGE ERROR:", error);

      if (createdField) {
        try {
          await deleteField(createdField.id);
        } catch (rollbackError) {
          console.error("FIELD MERGE ROLLBACK ERROR:", rollbackError);
        }
      }

      try {
        const refreshedFields = await getFieldsByFarm(farmId);
        setFields(refreshedFields);
        setSelectedField(
          refreshedFields.find((field) => field.id === mergeSourceField.id) ?? null
        );
      } catch (refreshError) {
        console.error("FIELD MERGE REFRESH ERROR:", refreshError);
      }

      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível unir os talhões."
      );
    } finally {
      setSavingMerge(false);
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
      await createFieldHistorySnapshot(
        field,
        "DELETE",
        "Última versão antes da eliminação"
      );
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
    if (drawingMode || splitMode) {
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

  function handleOpenFieldHistory(field: Field) {
    setHistoryField(field);
    setHistoryDialogOpen(true);
  }

  function handleCloseFieldHistory() {
    if (restoringHistory) return;
    setHistoryDialogOpen(false);
    setHistoryField(null);
  }

  async function handleRestoreFieldHistory(version: FieldHistory) {
    if (!historyField) return;

    const confirmed = window.confirm(
      `Restaurar a versão de ${new Date(version.created_at).toLocaleString("pt-PT")}?`
    );
    if (!confirmed) return;

    try {
      setRestoringHistory(true);
      await createFieldHistorySnapshot(
        historyField,
        "RESTORE",
        "Estado anterior ao restauro de uma versão"
      );

      const restoredField = await updateField({
        ...historyField,
        name: version.field_name,
        crop: version.crop,
        area: Number(version.area),
        status: version.status,
        geometry: version.geometry,
      });

      setFields((current) =>
        current.map((item) => item.id === restoredField.id ? restoredField : item)
      );
      setSelectedField(restoredField);
      setHistoryField(restoredField);
      setHistoryDialogOpen(false);
      setFocusFieldId(null);
      window.setTimeout(() => setFocusFieldId(restoredField.id), 0);
      alert("Versão restaurada com sucesso.");
    } catch (error) {
      console.error("FIELD HISTORY RESTORE ERROR:", error);
      alert("Não foi possível restaurar esta versão.");
    } finally {
      setRestoringHistory(false);
    }
  }

  function handleExportAllFields() {
    if (!farm) {
      return;
    }

    try {
      exportFieldsAsGeoJSON(fields, farm);
    } catch (error) {
      console.error("GEOJSON EXPORT ERROR:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Não foi possível exportar os talhões."
      );
    }
  }

  function handleExportField(field: Field) {
    if (!farm) {
      return;
    }

    try {
      exportFieldAsGeoJSON(field, farm);
    } catch (error) {
      console.error("GEOJSON FIELD EXPORT ERROR:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Não foi possível exportar o talhão."
      );
    }
  }

  function handleExportAllFieldsKML() {
    if (!farm) {
      return;
    }

    try {
      exportFieldsAsKML(fields, farm);
    } catch (error) {
      console.error("KML EXPORT ERROR:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Não foi possível exportar os talhões em KML."
      );
    }
  }

  function handleExportFieldKML(field: Field) {
    if (!farm) {
      return;
    }

    try {
      exportFieldAsKML(field, farm);
    } catch (error) {
      console.error("KML FIELD EXPORT ERROR:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Não foi possível exportar o talhão em KML."
      );
    }
  }

  async function handleExportFieldReport(field: Field) {
    if (!farm) return;

    try {
      const [environment, irrigationSystem, irrigationEvents, fireAssessment] = await Promise.all([
        getEnvironmentProfile(field.id).catch(() => null),
        getIrrigationSystem(field.id).catch(() => null),
        getIrrigationEvents(field.id).catch(() => []),
        getLatestFireAssessment(field.id).catch(() => null),
      ]);

      downloadFieldIntegratedReport({
        farm,
        field,
        environment,
        irrigationSystem,
        irrigationEvents,
        fireAssessment,
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("FIELD INTEGRATED REPORT ERROR:", error);
      window.alert("Não foi possível gerar o relatório integrado do talhão.");
    }
  }

  const farmOverview = buildFarmOverview(fields, moduleCoverage);
  const agriculturalAlerts = buildAgriculturalAlerts(fields, moduleCoverage);
  const alertTotals = {
    critical: agriculturalAlerts.filter((alert) => alert.severity === "critical").length,
    warning: agriculturalAlerts.filter((alert) => alert.severity === "warning").length,
    info: agriculturalAlerts.filter((alert) => alert.severity === "info").length,
  };
  const coveragePercent = (value: number) =>
    farmOverview.totalFields ? Math.round((value / farmOverview.totalFields) * 100) : 0;

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

        {/* VISÃO CONSOLIDADA */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">Sprint 56</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Visão consolidada da exploração</h2>
              <p className="mt-1 text-slate-500">
                Cobertura baseada nos registos reais de cada talhão. Ausência de dados é identificada como parcial.
              </p>
            </div>
            <button
              type="button"
              onClick={() => downloadFarmOverviewCsv(farm, fields, moduleCoverage, new Date().toISOString())}
              disabled={loadingOverview}
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
            >
              <Download size={18} />
              Exportar diagnóstico CSV
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Talhões acompanhados", farmOverview.totalFields, `${farmOverview.totalArea} ha`],
              ["Perfis ambientais", farmOverview.environmentConfigured, `${coveragePercent(farmOverview.environmentConfigured)}% coberto`],
              ["Sistemas de rega", farmOverview.irrigationConfigured, `${coveragePercent(farmOverview.irrigationConfigured)}% coberto`],
              ["Risco avaliado", farmOverview.fireAssessed, `${coveragePercent(farmOverview.fireAssessed)}% coberto`],
            ].map(([label, value, detail]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{loadingOverview ? "—" : value}</p>
                <p className="mt-1 text-sm text-slate-500">{loadingOverview ? "A consultar dados..." : detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900">Estado dos talhões</h3>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
                <span className="rounded-full bg-green-100 px-3 py-1.5 text-green-700">Saudáveis: {farmOverview.healthy}</span>
                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-amber-700">Atenção: {farmOverview.attention}</span>
                <span className="rounded-full bg-red-100 px-3 py-1.5 text-red-700">Críticos: {farmOverview.critical}</span>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cadastro e cálculos: funcional · Dados ausentes: parcial · Sem dados ocultos ou apresentados como reais
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle size={18} /> Prioridades operacionais
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-amber-900">
                {farmOverview.priorities.slice(0, 4).map((priority) => (
                  <li key={priority}>• {priority}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ALERTAS AGRÍCOLAS */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-orange-700">Sprint 57</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Central de alertas agrícolas</h2>
              <p className="mt-1 text-slate-500">Rega, incêndio, clima, ambiente e estado operacional num único local.</p>
            </div>
            <button
              type="button"
              onClick={() => downloadAgriculturalAlertsCsv(farm, agriculturalAlerts, new Date().toISOString())}
              disabled={loadingOverview}
              className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 font-semibold text-orange-700 transition hover:bg-orange-100 disabled:opacity-50"
            >
              <Download size={18} /> Exportar alertas CSV
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
            <span className="rounded-full bg-red-100 px-3 py-1.5 text-red-700">Críticos: {alertTotals.critical}</span>
            <span className="rounded-full bg-amber-100 px-3 py-1.5 text-amber-700">Atenção: {alertTotals.warning}</span>
            <span className="rounded-full bg-blue-100 px-3 py-1.5 text-blue-700">Informativos: {alertTotals.info}</span>
          </div>

          <div className="mt-5 space-y-3">
            {loadingOverview ? (
              <p className="rounded-2xl bg-slate-50 p-5 text-slate-500">A consultar os dados operacionais...</p>
            ) : agriculturalAlerts.length === 0 ? (
              <p className="rounded-2xl bg-green-50 p-5 font-semibold text-green-800">Sem alertas ativos. Continue a monitorização.</p>
            ) : agriculturalAlerts.slice(0, 8).map((alert) => {
              const classes = alert.severity === "critical"
                ? "border-red-200 bg-red-50 text-red-900"
                : alert.severity === "warning"
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-blue-200 bg-blue-50 text-blue-900";
              return (
                <article key={alert.id} className={`rounded-2xl border p-4 ${classes}`}>
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide">{alert.category} · {alert.fieldName}</p>
                      <h3 className="mt-1 font-bold">{alert.title}</h3>
                      <p className="mt-1 text-sm">{alert.action}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold">Origem: {alert.source}</span>
                  </div>
                </article>
              );
            })}
          </div>
          {agriculturalAlerts.length > 8 && (
            <p className="mt-3 text-sm text-slate-500">Mais {agriculturalAlerts.length - 8} alerta(s) disponíveis no CSV.</p>
          )}
        </section>

        {/* MAPA E PAINÉIS */}
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Mapa da Exploração
                </h2>

                <p className="mt-1 text-slate-500">
                  {splitMode
                    ? "Modo de divisão ativo. Desenhe uma linha que atravesse o talhão."
                    : drawingMode
                      ? "Modo de desenho ativo. Marque os limites do novo talhão."
                      : selectedField
                      ? `Talhão selecionado: ${selectedField.name}`
                      : "Selecione um talhão no mapa para visualizar os seus detalhes."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleExportAllFields}
                  disabled={
                    drawingMode ||
                    editGeometryMode ||
                    splitMode ||
                    !fields.some((field) => field.geometry)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download size={18} />
                  Exportar GeoJSON
                </button>

                <button
                  type="button"
                  onClick={handleExportAllFieldsKML}
                  disabled={
                    drawingMode ||
                    editGeometryMode ||
                    splitMode ||
                    !fields.some((field) => field.geometry)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 font-semibold text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download size={18} />
                  Exportar KML
                </button>

                <button
                  type="button"
                  onClick={() => setImportDialogOpen(true)}
                  disabled={drawingMode || editGeometryMode || splitMode}
                  className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload size={18} />
                  Importar GIS
                </button>

                <button
                  type="button"
                  onClick={handleStartDrawing}
                  disabled={drawingMode || editGeometryMode || splitMode}
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={18} />

                  {drawingMode
                    ? "A desenhar..."
                    : "Adicionar Talhão"}
                </button>
              </div>
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
                splitMode={splitMode}
                splitFieldGeometry={splitField?.geometry ?? null}
                splitPreview={splitGeometries}
                onSplitLineCreated={handleSplitLineCreated}
                onSplitCancel={handleCancelSplitMode}
                onGeometryChange={handleGeometryChange}
                onGeometryCommit={handleGeometryCommit}
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

      <GeoJSONImportDialog
        open={importDialogOpen}
        existingFields={fields}
        importing={importingGeoJSON}
        onClose={() => {
          if (!importingGeoJSON) {
            setImportDialogOpen(false);
          }
        }}
        onImport={handleImportGeoJSON}
      />

      <MergeFieldDialog
        open={mergeDialogOpen}
        sourceField={mergeSourceField}
        fields={fields}
        selectedFieldId={mergeTargetFieldId}
        name={mergeName}
        saving={savingMerge}
        onSelectedFieldIdChange={setMergeTargetFieldId}
        onNameChange={setMergeName}
        onSave={handleSaveMerge}
        onClose={handleCloseMergeDialog}
      />

      <SplitFieldDialog
        open={Boolean(splitGeometries && splitAreas)}
        field={splitField}
        geometries={splitGeometries}
        areas={splitAreas}
        firstName={splitFirstName}
        secondName={splitSecondName}
        saving={savingSplit}
        onFirstNameChange={setSplitFirstName}
        onSecondNameChange={setSplitSecondName}
        onSave={handleSaveSplit}
        onCancel={handleCancelSplitPreview}
      />

      <FieldHistoryDialog
        open={historyDialogOpen}
        field={historyField}
        restoring={restoringHistory}
        onClose={handleCloseFieldHistory}
        onRestore={handleRestoreFieldHistory}
      />

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
        canUndoGeometry={canUndoGeometry}
        canRedoGeometry={canRedoGeometry}
        onEditGeometry={handleStartGeometryEdit}
        onUndoGeometry={handleUndoGeometry}
        onRedoGeometry={handleRedoGeometry}
        onSaveGeometry={handleSaveGeometryEdit}
        onCancelGeometry={handleCancelGeometryEdit}
        onCenter={
          handleCenterField
        }
        onDelete={
          handleDeleteField
        }
        onDuplicate={handleDuplicateField}
        onSplit={handleStartSplitField}
        onMerge={handleStartMergeField}
        onExport={handleExportField}
        onExportKML={handleExportFieldKML}
        onExportReport={handleExportFieldReport}
        onHistory={handleOpenFieldHistory}
        onEnvironment={(field) => {
          if (!farmId) return;
          navigate(`/exploracoes/${farmId}/talhoes/${field.id}/ambiente`);
        }}
        onSuitability={(field) => {
          if (!farmId) return;
          navigate(`/exploracoes/${farmId}/talhoes/${field.id}/aptidao`);
        }}
        onIrrigation={(field) => {
          if (!farmId) return;
          navigate(`/exploracoes/${farmId}/talhoes/${field.id}/irrigacao`);
        }}
        onFire={(field) => {
          if (!farmId) return;
          navigate(`/exploracoes/${farmId}/talhoes/${field.id}/incendio`);
        }}
      />
    </>
  );
}
