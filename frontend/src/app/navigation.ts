import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  CloudSun,
  ClipboardCheck,
  CircleDollarSign,
  ListChecks,
  Gauge,
  Flame,
  Layers3,
  MapPinned,
  Package,
  RadioTower,
  Satellite,
  ShieldCheck,
  Settings,
  Stethoscope,
  Sprout,
  Tractor,
  Workflow,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    label: "Início",
    items: [
      {
        label: "Centro de Operações",
        path: "/",
        icon: Gauge,
      },
      {
        label: "Operações Inteligentes",
        path: "/centro-operacoes",
        icon: Activity,
      },
    ],
  },
  {
    label: "Operações",
    items: [
      {
        label: "Explorações",
        path: "/exploracoes",
        icon: MapPinned,
      },
      {
        label: "Missões",
        path: "/missoes",
        icon: ClipboardCheck,
      },
      {
        label: "Ordens de Trabalho",
        path: "/ordens",
        icon: ListChecks,
      },
      {
        label: "Custos agrícolas",
        path: "/custos",
        icon: CircleDollarSign,
      },
      {
        label: "Relatório financeiro",
        path: "/financeiro",
        icon: BarChart3,
      },
      {
        label: "Inventário",
        path: "/inventario",
        icon: Package,
      },
      {
        label: "Diário do talhão",
        path: "/diario-talhao",
        icon: BookOpen,
      },
      {
        label: "Produção e colheita",
        path: "/colheitas",
        icon: Sprout,
      },
      {
        label: "Rastreabilidade",
        path: "/rastreabilidade",
        icon: ShieldCheck,
      },
      {
        label: "Produtividade",
        path: "/produtividade",
        icon: BarChart3,
      },
      {
        label: "Calendário",
        path: "/calendario",
        icon: CalendarDays,
      },
      {
        label: "Culturas",
        path: "/culturas",
        icon: Sprout,
      },
    ],
  },
  {
    label: "Inteligência",
    items: [
      {
        label: "Analytics",
        path: "/analytics",
        icon: BarChart3,
      },
      {
        label: "Digital Twin",
        path: "/digital-twin",
        icon: Layers3,
      },
      {
        label: "Agricultura de Precisão",
        path: "/precisao",
        icon: Satellite,
      },
      {
        label: "FARPHA Intelligence",
        path: "/intelligence",
        icon: Bot,
      },
      {
        label: "Recomendações",
        path: "/recomendacoes",
        icon: Bot,
      },
      {
        label: "Solo Inteligente",
        path: "/solo-inteligente",
        icon: Layers3,
      },
    ],
  },
  {
    label: "Monitorização",
    items: [
      {
        label: "Clima",
        path: "/clima",
        icon: CloudSun,
      },
      {
        label: "Risco de incêndio",
        path: "/risco-incendio-oficial",
        icon: Flame,
      },
      {
        label: "Sensores",
        path: "/sensores",
        icon: RadioTower,
      },
      {
        label: "Máquinas",
        path: "/maquinas",
        icon: Tractor,
      },
    ],
  },
  {
    label: "Sistema",
    items: [
      {
        label: "Automações",
        path: "/automacoes",
        icon: Workflow,
      },
      {
        label: "Diagnóstico",
        path: "/diagnostico",
        icon: Stethoscope,
      },
      {
        label: "Definições",
        path: "/configuracoes",
        icon: Settings,
      },
    ],
  },
];
