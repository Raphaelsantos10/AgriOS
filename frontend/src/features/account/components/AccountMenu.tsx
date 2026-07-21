import { useEffect, useRef, useState } from "react";
import { ChevronDown, CircleHelp, CreditCard, LogOut, Settings, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";

const roleLabels = { owner: "Proprietário", manager: "Gestor", operator: "Operador", viewer: "Consulta" } as const;

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { mode, profile, signOut } = useAuth();
  const displayName = profile?.fullName || "Raphael";
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";
  const roleLabel = profile ? roleLabels[profile.role] : "Administrador local";

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); }
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", closeOnOutside); document.removeEventListener("keydown", closeOnEscape); };
  }, []);

  function go(section: string) {
    setOpen(false);
    navigate(`/configuracoes${section ? `#${section}` : ""}`);
  }

  async function handleSignOut() {
    if (!window.confirm("Tem a certeza de que pretende terminar a sessão?")) return;
    setOpen(false);
    await signOut();
  }
  function leaveLocalDemo() {
    if (!window.confirm("Sair do modo de demonstração e voltar ao site inicial?")) return;
    localStorage.setItem("farpha-local-access", "signed-out");
    window.location.assign("/");
  }

  return <div ref={rootRef} className="relative">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu" className="flex items-center gap-2 rounded-2xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-1.5 pr-2 text-left transition hover:bg-[var(--farpha-surface-muted)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--farpha-brand-700)] text-xs font-extrabold text-white">{initials}</div>
      <div className="hidden max-w-32 sm:block"><p className="truncate text-xs font-bold text-[var(--farpha-text)]">{displayName}</p><p className="truncate text-[10px] text-[var(--farpha-text-muted)]">{roleLabel}</p></div>
      <ChevronDown size={15} className={`hidden text-[var(--farpha-text-muted)] transition sm:block ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <section role="menu" aria-label="Menu da conta" className="absolute right-0 top-14 z-[1100] w-[min(92vw,320px)] overflow-hidden rounded-2xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] shadow-2xl">
      <div className="border-b border-[var(--farpha-border)] p-4"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--farpha-brand-700)] font-black text-white">{initials}</div><div className="min-w-0"><p className="truncate font-black text-[var(--farpha-text)]">{displayName}</p><p className="truncate text-xs text-[var(--farpha-text-muted)]">{profile?.email || "Conta local neste dispositivo"}</p></div></div><p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-800"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> {roleLabel}</p></div>
      <div className="p-2">
        <MenuItem icon={<UserRound size={17}/>} label="Meu perfil" onClick={() => go("perfil")} />
        <MenuItem icon={<Settings size={17}/>} label="Configurações" onClick={() => go("")} />
        <MenuItem icon={<ShieldCheck size={17}/>} label="Segurança" onClick={() => go("seguranca")} />
        <MenuItem icon={<CreditCard size={17}/>} label="Plano e subscrição" onClick={() => go("subscricao")} />
        <MenuItem icon={<CircleHelp size={17}/>} label="Ajuda" onClick={() => { setOpen(false); navigate("/diagnostico"); }} />
      </div>
      <div className="border-t border-[var(--farpha-border)] p-2"><MenuItem danger icon={<LogOut size={17}/>} label={mode === "required" ? "Terminar sessão" : "Sair da demonstração"} onClick={mode === "required" ? () => void handleSignOut() : leaveLocalDemo} /></div>
    </section>}
  </div>;
}

function MenuItem({ icon, label, onClick, danger = false }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return <button type="button" role="menuitem" onClick={onClick} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition hover:bg-[var(--farpha-surface-muted)] ${danger ? "text-red-700" : "text-[var(--farpha-text)]"}`}>{icon}<span>{label}</span></button>;
}
