import {
  Command,
  HelpCircle,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { navigationGroups } from "../../app/navigation";
import AccountMenu from "../../features/account/components/AccountMenu";
import NotificationBell from "../../features/notifications/components/NotificationBell";
import { openSupportAssistant } from "../../features/support/supportCenterUtils";

type HeaderProps = {
  onOpenMobileMenu: () => void;
  onOpenCommand: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
};

function resolvePageTitle(pathname: string) {
  if (pathname.startsWith("/exploracoes/")) return "Detalhe da exploração";
  const item = navigationGroups.flatMap((group) => group.items).find((entry) => entry.path === pathname);
  return item?.label ?? "FARPHA";
}

export default function Header({ onOpenMobileMenu, onOpenCommand, darkMode, onToggleTheme }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = resolvePageTitle(location.pathname);

  return (
    <header className="z-30 flex h-[72px] shrink-0 items-center gap-3 border-b border-[var(--farpha-border)] bg-[color:var(--farpha-surface)]/95 px-4 shadow-sm backdrop-blur-xl md:px-6 xl:px-8">
      <button type="button" aria-label="Abrir menu principal" onClick={onOpenMobileMenu} className="rounded-xl border border-[var(--farpha-border)] p-2.5 text-[var(--farpha-brand-700)] transition hover:bg-[var(--farpha-surface-muted)] lg:hidden">
        <Menu size={20} />
      </button>

      <div className="min-w-0 shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--farpha-text-muted)]">Centro de trabalho</p>
        <h1 className="truncate text-lg font-extrabold tracking-[-0.02em] text-[var(--farpha-text)] md:text-xl">{pageTitle}</h1>
      </div>

      <div className="mx-auto hidden w-full max-w-xl lg:block">
        <button type="button" onClick={onOpenCommand} aria-label="Abrir pesquisa global" className="relative block h-11 w-full rounded-2xl border border-[var(--farpha-border)] bg-[var(--farpha-surface-muted)] pl-11 pr-20 text-left text-sm text-[var(--farpha-text-muted)] outline-none transition hover:border-[var(--farpha-border-strong)] hover:bg-[var(--farpha-surface)] hover:shadow-sm">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" />
          Pesquisar explorações, talhões ou operações…
          <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-lg border border-[var(--farpha-border)] bg-[var(--farpha-surface)] px-2 py-1 text-[11px] font-semibold"><Command size={12} /> K</span>
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-[var(--farpha-border)] bg-[var(--farpha-surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--farpha-brand-600)] xl:flex" title="Todos os serviços estão operacionais">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" /> Online
        </div>
        <button type="button" onClick={openSupportAssistant} className="hidden rounded-xl border border-[var(--farpha-border)] p-2.5 text-[var(--farpha-text-muted)] transition hover:bg-[var(--farpha-surface-muted)] md:block" aria-label="Abrir ajuda e suporte" title="Ajuda e suporte"><HelpCircle size={19} /></button>
        <button type="button" onClick={onToggleTheme} className="rounded-xl border border-[var(--farpha-border)] p-2.5 text-[var(--farpha-text-muted)] transition hover:bg-[var(--farpha-surface-muted)]" aria-label={darkMode ? "Ativar tema claro" : "Ativar tema escuro"} title={darkMode ? "Tema claro" : "Tema escuro"}>{darkMode ? <Sun size={19} /> : <Moon size={19} />}</button>
        <button type="button" onClick={() => navigate("/intelligence")} className="hidden rounded-xl border border-[var(--farpha-border)] p-2.5 text-[var(--farpha-brand-600)] transition hover:bg-[var(--farpha-surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--farpha-brand-500)] md:block" aria-label="Abrir FARPHA Intelligence" title="Abrir assistente inteligente"><Sparkles size={19} /></button>
        <NotificationBell />
        <AccountMenu />
      </div>
    </header>
  );
}
