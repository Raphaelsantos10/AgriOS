import { supabase } from "../../../services/supabase";
import type {
  DiagnosticCategory,
  DiagnosticItem,
  DiagnosticReport,
  DiagnosticStatus,
} from "../types/diagnostics";

type TableCheck = {
  id: string;
  label: string;
  description: string;
  table: string;
  category?: DiagnosticCategory;
};

const tableChecks: TableCheck[] = [
  {
    id: "farms",
    label: "Explorações",
    description: "Leitura da tabela farms.",
    table: "farms",
  },
  {
    id: "fields",
    label: "Talhões",
    description: "Leitura da tabela fields.",
    table: "fields",
  },
  {
    id: "field-history",
    label: "Histórico GIS",
    description: "Snapshots e versões dos talhões.",
    table: "field_history",
  },
  {
    id: "crop-catalog",
    label: "Culturas",
    description: "Catálogo do Universal Crop Engine.",
    table: "crop_catalog",
  },
  {
    id: "environment",
    label: "Perfil ambiental",
    description: "Perfis ambientais associados aos talhões.",
    table: "field_environment_profiles",
  },
  {
    id: "irrigation-systems",
    label: "Sistemas de rega",
    description: "Configuração dos sistemas de irrigação.",
    table: "irrigation_systems",
  },
  {
    id: "irrigation-events",
    label: "Histórico de rega",
    description: "Eventos e consumos de irrigação.",
    table: "irrigation_events",
  },
  {
    id: "fire-risk",
    label: "Fire Intelligence",
    description: "Avaliações de risco de incêndio.",
    table: "fire_risk_assessments",
  },
  {
    id: "missions",
    label: "Missões",
    description: "Centro de missões e calendário agrícola.",
    table: "missions",
  },
];

function nowIso() {
  return new Date().toISOString();
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }
  return "Erro desconhecido.";
}

function aggregateStatus(items: DiagnosticItem[]): DiagnosticStatus {
  if (items.some((item) => item.status === "error")) return "error";
  if (items.some((item) => item.status === "warning")) return "warning";
  if (items.some((item) => item.status === "pending")) return "pending";
  return "operational";
}

async function checkTable(check: TableCheck): Promise<DiagnosticItem> {
  const startedAt = performance.now();
  const checkedAt = nowIso();

  try {
    const { error, count } = await supabase
      .from(check.table)
      .select("*", { count: "exact", head: true });

    const latencyMs = Math.round(performance.now() - startedAt);

    if (error) {
      const missingTable = error.code === "PGRST205" || error.code === "42P01";
      return {
        id: check.id,
        label: check.label,
        description: check.description,
        category: check.category ?? "data",
        status: missingTable ? "error" : "warning",
        latencyMs,
        details: `${error.code ?? "SUPABASE"}: ${error.message}`,
        checkedAt,
      };
    }

    return {
      id: check.id,
      label: check.label,
      description: check.description,
      category: check.category ?? "data",
      status: "operational",
      latencyMs,
      details: `${count ?? 0} registo(s) acessível(eis).`,
      checkedAt,
    };
  } catch (error) {
    return {
      id: check.id,
      label: check.label,
      description: check.description,
      category: check.category ?? "data",
      status: "error",
      latencyMs: Math.round(performance.now() - startedAt),
      details: errorMessage(error),
      checkedAt,
    };
  }
}

async function checkSupabaseConnection(): Promise<DiagnosticItem> {
  const startedAt = performance.now();
  const checkedAt = nowIso();

  try {
    const { error } = await supabase.from("farms").select("id").limit(1);
    const latencyMs = Math.round(performance.now() - startedAt);

    if (error) {
      return {
        id: "supabase",
        label: "Supabase",
        description: "Ligação principal à API e base de dados.",
        category: "core",
        status: "error",
        latencyMs,
        details: `${error.code ?? "SUPABASE"}: ${error.message}`,
        checkedAt,
      };
    }

    return {
      id: "supabase",
      label: "Supabase",
      description: "Ligação principal à API e base de dados.",
      category: "core",
      status: "operational",
      latencyMs,
      details: "Ligação estabelecida com sucesso.",
      checkedAt,
    };
  } catch (error) {
    return {
      id: "supabase",
      label: "Supabase",
      description: "Ligação principal à API e base de dados.",
      category: "core",
      status: "error",
      latencyMs: Math.round(performance.now() - startedAt),
      details: errorMessage(error),
      checkedAt,
    };
  }
}

function pendingIntegration(
  id: string,
  label: string,
  description: string,
): DiagnosticItem {
  return {
    id,
    label,
    description,
    category: "integration",
    status: "pending",
    details: "Integração ainda não configurada nesta versão.",
    checkedAt: nowIso(),
  };
}

export async function runDiagnostics(): Promise<DiagnosticReport> {
  const startedAt = nowIso();
  const startedPerformance = performance.now();

  const [supabaseResult, ...databaseResults] = await Promise.all([
    checkSupabaseConnection(),
    ...tableChecks.map(checkTable),
  ]);

  const items = [
    supabaseResult,
    ...databaseResults,
    pendingIntegration(
      "storage",
      "Storage",
      "Fotografias, documentos e anexos da exploração.",
    ),
    pendingIntegration(
      "weather-api",
      "Meteorologia",
      "Previsões e alertas meteorológicos externos.",
    ),
    pendingIntegration(
      "satellite",
      "Satélite",
      "Copernicus, Sentinel e índices de vegetação.",
    ),
    pendingIntegration(
      "iot",
      "Sensores IoT",
      "Sensores de solo, água, clima e equipamentos.",
    ),
    pendingIntegration(
      "drones",
      "Drones",
      "Missões, mapeamento e inspeções aéreas.",
    ),
  ];

  const finishedAt = nowIso();
  return {
    status: aggregateStatus(items),
    items,
    startedAt,
    finishedAt,
    durationMs: Math.round(performance.now() - startedPerformance),
  };
}
