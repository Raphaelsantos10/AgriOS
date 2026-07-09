import {
  Home,
  Map,
  MapPinned,
  Tractor,
  CloudSun,
  BarChart3,
  Settings,
  Sprout,
  Wallet,
  Boxes,
  Bot,
  UserCircle,
} from "lucide-react";

const items = [
  {
    icon: Home,
    text: "Dashboard",
    active: true,
  },
  {
    icon: MapPinned,
    text: "Explorações",
  },
  {
    icon: Map,
    text: "Talhões",
  },
  {
    icon: Tractor,
    text: "Máquinas",
  },
  {
    icon: CloudSun,
    text: "Clima",
  },
  {
    icon: Bot,
    text: "IA",
  },
  {
    icon: Sprout,
    text: "Culturas",
  },
  {
    icon: Boxes,
    text: "Estoque",
  },
  {
    icon: Wallet,
    text: "Financeiro",
  },
  {
    icon: BarChart3,
    text: "Relatórios",
  },
  {
    icon: Settings,
    text: "Configurações",
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col bg-gradient-to-b from-green-900 via-green-800 to-green-950 text-white shadow-2xl">

      {/* LOGO */}

      <div className="border-b border-green-700 p-8">

        <div className="flex items-center gap-3">

          <div className="text-4xl">
            🌾
          </div>

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

      {/* MENU */}

      <nav className="flex-1 px-4 py-6 space-y-2">

        {items.map((item) => (
          <button
            key={item.text}
            className={`flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left transition-all duration-300

            ${
              item.active
                ? "bg-green-600 shadow-lg"
                : "hover:bg-green-700/70"
            }`}
          >
            <item.icon size={22} />

            <span className="font-medium">
              {item.text}
            </span>
          </button>
        ))}

      </nav>

      {/* RODAPÉ */}

      <div className="border-t border-green-700 p-6">

        <div className="flex items-center gap-4">

          <UserCircle
            size={44}
            className="text-green-200"
          />

          <div>

            <h3 className="font-semibold">
              Raphael
            </h3>

            <p className="text-sm text-green-200">
              Administrador
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}