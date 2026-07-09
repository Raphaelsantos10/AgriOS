import {
  Bell,
  UserCircle,
  Search,
  Sun,
  Globe,
} from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">

      {/* Barra de Pesquisa */}
      <div className="relative w-[420px]">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Pesquisar exploração, talhão ou máquina..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-green-600 focus:bg-white"
        />
      </div>

      {/* Ações */}
      <div className="flex items-center gap-6">

        <button className="rounded-xl p-2 transition hover:bg-slate-100">
          <Bell size={22} />
        </button>

        <button className="rounded-xl p-2 transition hover:bg-slate-100">
          <Sun size={22} />
        </button>

        <button className="rounded-xl p-2 transition hover:bg-slate-100">
          <Globe size={22} />
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">

          <UserCircle
            size={40}
            className="text-green-700"
          />

          <div>
            <h3 className="font-semibold text-slate-800">
              Raphael
            </h3>

            <p className="text-sm text-slate-500">
              Administrador
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}