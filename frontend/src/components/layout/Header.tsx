import {
  Bell,
  ChevronDown,
  Command,
  HelpCircle,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import { navigationGroups } from "../../app/navigation";

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
  const pageTitle = resolvePageTitle(location.pathname);

  return (
    <header className="z-30 flex h-[72px] shrink-0 items-center gap-3 border-b border-[var(--farpha-border)] bg-[color:var(--farpha-surface)]/95 px-4 shadow-sm backdrop-blur-xl md:px-6 xl:px-8">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#173321]">Saltar para o conteúdo</a>
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
        <button type="button" onClick={onOpenCommand} className="hidden rounded-xl border border-[var(--farpha-border)] p-2.5 text-[var(--farpha-text-muted)] transition hover:bg-[var(--farpha-surface-muted)] md:block" aria-label="Ajuda e comandos" title="Ajuda e atalhos"><HelpCircle size={19} /></button>
        <button type="button" onClick={onToggleTheme} className="rounded-xl border border-[var(--farpha-border)] p-2.5 text-[var(--farpha-text-muted)] transition hover:bg-[var(--farpha-surface-muted)]" aria-label={darkMode ? "Ativar tema claro" : "Ativar tema escuro"} title={darkMode ? "Tema claro" : "Tema escuro"}>{darkMode ? <Sun size={19} /> : <Moon size={19} />}</button>
        <button type="button" className="hidden rounded-xl border border-[var(--farpha-border)] p-2.5 text-[var(--farpha-brand-600)] transition hover:bg-[var(--farpha-surface-muted)] md:block" aria-label="Abrir FARPHA Intelligence" title="Assistente inteligente"><Sparkles size={19} /></button>
        <button type="button" className="relative rounded-xl border border-[var(--farpha-border)] p-2.5 text-[var(--farpha-text-muted)] transition hover:bg-[var(--farpha-surface-muted)]" aria-label="Notificações: 3 novas"><Bell size={19} /><span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--farpha-danger)] px-1 text-[10px] font-bold text-white">3</span></button>
        <button type="button" className="flex items-center gap-2 rounded-2xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-1.5 pr-2 text-left transition hover:bg-[var(--farpha-surface-muted)]" aria-label="Abrir menu do perfil">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--farpha-brand-700)] text-xs font-extrabold text-white">RS</div>
          <div className="hidden max-w-28 sm:block"><p className="truncate text-xs font-bold text-[var(--farpha-text)]">Raphael</p><p className="truncate text-[10px] text-[var(--farpha-text-muted)]">Administrador</p></div>
          <ChevronDown size={15} className="hidden text-[var(--farpha-text-muted)] sm:block" />
        </button>
      </div>
    </header>
  );
}
