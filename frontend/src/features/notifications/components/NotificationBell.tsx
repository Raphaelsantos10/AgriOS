import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, ExternalLink, RefreshCw, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOperationsCenter } from "../../operations/hooks/useOperationsCenter";
import { alertFingerprint, relativeNotificationTime, resolveAlertPath, unreadAlerts, visibleAlerts } from "../utils/notificationInbox";

const readKey = "farpha-read-operational-alerts";
const dismissedKey = "farpha-dismissed-operational-alerts";
const severityClass = { critical: "bg-red-500", warning: "bg-amber-500", info: "bg-sky-500", success: "bg-emerald-500" };

function loadList(key: string) { try { const value = JSON.parse(localStorage.getItem(key) ?? "[]"); return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; } catch { return []; } }

export default function NotificationBell() {
  const [refreshToken, setRefreshToken] = useState(0);
  const { alerts } = useOperationsCenter(refreshToken);
  const navigate = useNavigate(); const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false); const [tab, setTab] = useState<"new" | "all">("new");
  const [read, setRead] = useState<string[]>(() => loadList(readKey));
  const [dismissed, setDismissed] = useState<string[]>(() => loadList(dismissedKey));
  const visible = useMemo(() => visibleAlerts(alerts, dismissed), [alerts, dismissed]);
  const unread = useMemo(() => unreadAlerts(visible, read), [read, visible]);
  const shown = tab === "new" ? unread : visible;

  function saveRead(items: string[]) { const unique = Array.from(new Set(items)); setRead(unique); localStorage.setItem(readKey, JSON.stringify(unique)); }
  function saveDismissed(items: string[]) { const unique = Array.from(new Set(items)); setDismissed(unique); localStorage.setItem(dismissedKey, JSON.stringify(unique)); }
  function openAlert(alert: (typeof alerts)[number]) { saveRead([...read, alertFingerprint(alert)]); setOpen(false); navigate(resolveAlertPath(alert)); }
  function dismiss(alert: (typeof alerts)[number]) { saveDismissed([...dismissed, alertFingerprint(alert)]); }
  function refresh() { setRefreshToken((value) => value + 1); setTab("new"); }

  useEffect(() => {
    if (!open) return;
    function close(event: MouseEvent) { if (!panelRef.current?.contains(event.target as Node)) setOpen(false); }
    function escape(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, [open]);

  return <div ref={panelRef} className="relative">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="dialog" className="relative rounded-xl border border-[var(--farpha-border)] p-2.5 text-[var(--farpha-text-muted)] transition hover:bg-[var(--farpha-surface-muted)]" aria-label={`Notificações: ${unread.length} não lidas`}><Bell size={19}/>{unread.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--farpha-danger)] px-1 text-[10px] font-bold text-white">{unread.length > 99 ? "99+" : unread.length}</span>}</button>
    {open && <section role="dialog" aria-label="Notificações agrícolas" className="absolute right-0 top-12 z-[var(--farpha-z-dropdown)] w-[min(94vw,430px)] overflow-hidden rounded-2xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] shadow-2xl">
      <header className="flex items-center justify-between border-b border-[var(--farpha-border)] p-4"><div><h2 className="font-black text-[var(--farpha-text)]">Notificações</h2><p className="text-xs text-[var(--farpha-text-muted)]">{unread.length} nova(s) · {visible.length} no histórico</p></div><div className="flex"><button onClick={refresh} aria-label="Atualizar notificações" title="Procurar novos alertas" className="rounded-lg p-2 hover:bg-[var(--farpha-surface-muted)]"><RefreshCw size={17}/></button><button onClick={() => setOpen(false)} aria-label="Fechar notificações" className="rounded-lg p-2 hover:bg-[var(--farpha-surface-muted)]"><X size={18}/></button></div></header>
      <nav className="flex gap-1 border-b border-[var(--farpha-border)] p-2" aria-label="Filtros de notificações"><button onClick={()=>setTab("new")} className={`rounded-lg px-3 py-2 text-xs font-black ${tab === "new" ? "bg-[var(--farpha-brand-700)] text-white" : "text-[var(--farpha-text-muted)] hover:bg-[var(--farpha-surface-muted)]"}`}>Novas ({unread.length})</button><button onClick={()=>setTab("all")} className={`rounded-lg px-3 py-2 text-xs font-black ${tab === "all" ? "bg-[var(--farpha-brand-700)] text-white" : "text-[var(--farpha-text-muted)] hover:bg-[var(--farpha-surface-muted)]"}`}>Todas ({visible.length})</button></nav>
      <div className="max-h-[min(62vh,500px)] overflow-y-auto">{shown.length === 0 ? <div className="p-8 text-center"><CheckCheck className="mx-auto text-emerald-600"/><p className="mt-3 font-bold text-[var(--farpha-text)]">{tab === "new" ? "Está tudo em dia" : "Sem notificações"}</p><p className="mt-1 text-xs text-[var(--farpha-text-muted)]">{tab === "new" ? "Os alertas lidos continuam disponíveis em Todas." : "Novos alertas aparecerão aqui."}</p></div> : shown.map((alert) => { const isUnread = unread.some((item)=>item.id===alert.id); return <article key={alertFingerprint(alert)} className={`group flex gap-3 border-b border-[var(--farpha-border)] p-4 ${isUnread ? "bg-amber-500/5" : "opacity-75"}`}><button onClick={() => openAlert(alert)} className="flex min-w-0 flex-1 gap-3 text-left"><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${severityClass[alert.severity]}`}/><span className="min-w-0 flex-1"><span className="flex items-center gap-2"><strong className="truncate text-sm text-[var(--farpha-text)]">{alert.title}</strong>{isUnread && <span className="rounded-full bg-[var(--farpha-danger)] px-1.5 py-0.5 text-[9px] font-black uppercase text-white">Nova</span>}</span><span className="mt-1 block text-xs leading-5 text-[var(--farpha-text-muted)]">{alert.description}</span><span className="mt-2 flex items-center gap-2 text-[11px] font-bold text-[var(--farpha-brand-500)]">{relativeNotificationTime(alert.createdAt)} · {alert.actionLabel || "Abrir alerta"}<ExternalLink size={11}/></span></span></button><button onClick={()=>dismiss(alert)} aria-label={`Dispensar ${alert.title}`} title="Remover do histórico" className="h-fit rounded-lg p-2 text-[var(--farpha-text-muted)] opacity-60 hover:bg-red-500/10 hover:text-red-600 group-hover:opacity-100"><Trash2 size={15}/></button></article>; })}</div>
      {visible.length > 0 && <footer className="flex gap-2 p-3"><button onClick={() => saveRead([...read, ...visible.map(alertFingerprint)])} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--farpha-surface-muted)] px-3 py-2 text-xs font-bold text-[var(--farpha-text)]"><CheckCheck size={15}/>Marcar tudo como lido</button><button onClick={() => saveDismissed([...dismissed, ...visible.filter((alert)=>!unread.some((item)=>item.id===alert.id)).map(alertFingerprint)])} className="rounded-xl border border-[var(--farpha-border)] px-3 py-2 text-xs font-bold text-[var(--farpha-text-muted)]">Limpar lidas</button></footer>}
    </section>}
  </div>;
}
