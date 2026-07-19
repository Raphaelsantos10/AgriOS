import { BarChart3, Gauge, MapPinned, MoreHorizontal, Sprout } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { label: "Início", path: "/", icon: Gauge },
  { label: "Explorações", path: "/exploracoes", icon: MapPinned },
  { label: "Culturas", path: "/culturas", icon: Sprout },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Mais", path: "/diagnostico", icon: MoreHorizontal },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[22px] border border-white/80 bg-white/95 p-1.5 shadow-[0_18px_55px_rgba(17,52,33,0.22)] backdrop-blur-xl lg:hidden" aria-label="Navegação móvel">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-bold transition ${
                isActive ? "bg-[#214f39] text-white shadow-sm" : "text-[#6f8276] hover:bg-[#eef5f0] hover:text-[#214f39]"
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            <span className="w-full truncate text-center">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
