import {
  Home,
  Map,
  Tractor,
  CloudSun,
  Brain,
  BarChart3,
  Settings
} from "lucide-react";

const items = [
  { icon: Home, text: "Dashboard" },
  { icon: Map, text: "Mapas" },
  { icon: Tractor, text: "Máquinas" },
  { icon: CloudSun, text: "Clima" },
  { icon: Brain, text: "IA" },
  { icon: BarChart3, text: "Relatórios" },
  { icon: Settings, text: "Configurações" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-green-900 text-white">

      <div className="p-8">

        <h1 className="text-3xl font-bold">

            🌾 AgriOS

        </h1>

      </div>

      <nav>

        {items.map((item) => (
          <button
            key={item.text}
            className="flex w-full items-center gap-4 px-8 py-4 hover:bg-green-800 transition"
          >
            <item.icon size={22} />

            {item.text}

          </button>
        ))}

      </nav>

    </aside>
  );
}