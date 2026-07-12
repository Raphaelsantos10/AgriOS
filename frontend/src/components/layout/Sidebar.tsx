import {
  BarChart3,
  Bot,
  Boxes,
  CloudSun,
  ClipboardCheck,
  Home,
  Map,
  MapPinned,
  Settings,
  Sprout,
  Tractor,
  UserCircle,
  Wallet,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const items = [
  {
    icon: Home,
    text: "Dashboard",
    path: "/",
  },
  {
    icon: MapPinned,
    text: "Explorações",
    path: "/exploracoes",
  },
  {
    icon: Map,
    text: "Talhões",
    path: "/talhoes",
  },
  {
    icon: ClipboardCheck,
    text: "Missões",
    path: "/missoes",
  },
  {
    icon: Tractor,
    text: "Máquinas",
    path: "/maquinas",
  },
  {
    icon: CloudSun,
    text: "Clima",
    path: "/clima",
  },
  {
    icon: Bot,
    text: "IA",
    path: "/ia",
  },
  {
    icon: Sprout,
    text: "Culturas",
    path: "/culturas",
  },
  {
    icon: Boxes,
    text: "Estoque",
    path: "/estoque",
  },
  {
    icon: Wallet,
    text: "Financeiro",
    path: "/financeiro",
  },
  {
    icon: BarChart3,
    text: "Relatórios",
    path: "/relatorios",
  },
  {
    icon: Settings,
    text: "Configurações",
    path: "/configuracoes",
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col bg-gradient-to-b from-green-900 via-green-800 to-green-950 text-white shadow-2xl">
      <div className="border-b border-green-700 p-8">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🌾</div>

          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              AgriOS
            </h1>

            <p className="text-sm text-green-200">
              Smart Farming Platform
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.text}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left transition-all duration-300 ${
                  isActive
                    ? "bg-green-600 shadow-lg"
                    : "hover:bg-green-700/70"
                }`
              }
            >
              <Icon size={22} />

              <span className="font-medium">{item.text}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-green-700 p-6">
        <div className="flex items-center gap-4">
          <UserCircle size={44} className="text-green-200" />

          <div>
            <h3 className="font-semibold">Raphael</h3>

            <p className="text-sm text-green-200">
              Administrador
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}