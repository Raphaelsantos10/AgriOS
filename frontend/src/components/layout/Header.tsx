import {
  Bell,
  ChevronDown,
  Command,
  Menu,
  Search,
  Sparkles,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import { navigationGroups } from "../../app/navigation";

type HeaderProps = {
  onOpenMobileMenu: () => void;
};

function resolvePageTitle(pathname: string) {
  if (pathname.startsWith("/exploracoes/")) {
    return "Detalhe da exploração";
  }

  const item = navigationGroups
    .flatMap((group) => group.items)
    .find((entry) => entry.path === pathname);

  return item?.label ?? "FARPHA";
}

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const location = useLocation();
  const pageTitle = resolvePageTitle(location.pathname);

  return (
    <header className="z-30 flex h-20 shrink-0 items-center gap-4 border-b border-[#dce5df] bg-white/95 px-4 shadow-sm backdrop-blur-xl md:px-6 xl:px-8">
      <button
        type="button"
        aria-label="Abrir menu"
        onClick={onOpenMobileMenu}
        className="rounded-xl border border-[#dce5df] p-2.5 text-[#214f39] transition hover:bg-[#f2f8f4] lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="min-w-0 shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a8c80]">
          FARPHA Workspace
        </p>
        <h1 className="truncate text-lg font-bold text-[#173321] md:text-xl">
          {pageTitle}
        </h1>
      </div>

      <div className="mx-auto hidden w-full max-w-xl lg:block">
        <label className="relative block">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8c80]"
          />
          <input
            type="search"
            placeholder="Pesquisar explorações, talhões ou missões..."
            className="h-11 w-full rounded-2xl border border-[#dce5df] bg-[#f5f8f6] pl-11 pr-20 text-sm text-[#1b2a21] outline-none transition placeholder:text-[#839188] focus:border-[#4e8b65] focus:bg-white focus:ring-4 focus:ring-[#377d57]/10"
          />
          <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-lg border border-[#dce5df] bg-white px-2 py-1 text-[11px] font-semibold text-[#68766d]">
            <Command size={12} /> K
          </span>
        </label>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-[#dce5df] bg-[#f5f8f6] px-3 py-2 text-xs font-semibold text-[#325e43] xl:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
          Sistema online
        </div>

        <button
          type="button"
          className="hidden rounded-xl border border-[#dce5df] p-2.5 text-[#356247] transition hover:bg-[#f2f8f4] md:block"
          aria-label="Abrir FARPHA Intelligence"
        >
          <Sparkles size={19} />
        </button>

        <button
          type="button"
          className="relative rounded-xl border border-[#dce5df] p-2.5 text-[#356247] transition hover:bg-[#f2f8f4]"
          aria-label="Notificações"
        >
          <Bell size={19} />
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c84a4a] px-1 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-2xl border border-[#dce5df] bg-white p-1.5 pr-2 text-left transition hover:bg-[#f7faf8]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#214f39] text-xs font-extrabold text-white">
            RS
          </div>
          <div className="hidden max-w-28 sm:block">
            <p className="truncate text-xs font-bold text-[#183423]">Raphael</p>
            <p className="truncate text-[10px] text-[#76847b]">Administrador</p>
          </div>
          <ChevronDown size={15} className="hidden text-[#76847b] sm:block" />
        </button>
      </div>
    </header>
  );
}
