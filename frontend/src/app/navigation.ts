import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  CalendarDays,
  CloudSun,
  ClipboardCheck,
  Gauge,
  MapPinned,
  RadioTower,
  Settings,
  Tractor,
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
        label: "Calendário",
        path: "/calendario",
        icon: CalendarDays,
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
        label: "FARPHA Intelligence",
        path: "/intelligence",
        icon: Bot,
        disabled: true,
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
        disabled: true,
      },
      {
        label: "Sensores",
        path: "/sensores",
        icon: RadioTower,
        disabled: true,
      },
      {
        label: "Máquinas",
        path: "/maquinas",
        icon: Tractor,
        disabled: true,
      },
    ],
  },
  {
    label: "Sistema",
    items: [
      {
        label: "Definições",
        path: "/configuracoes",
        icon: Settings,
        disabled: true,
      },
    ],
  },
];
