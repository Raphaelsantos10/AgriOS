import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Bot, CheckCircle2, ChevronRight, Clock3, Cloud, CloudOff, ExternalLink,
  Headphones, LoaderCircle, Mail, MessageCircle, MessagesSquare, Phone, Plus,
  RefreshCw, RotateCcw, Send, ShieldCheck, Sparkles, Ticket, UserRound, X,
} from "lucide-react";
import { useAuth } from "../auth";
import { useNotifications } from "../notifications/context/useNotifications";
import { supportConfig } from "./supportConfig";
import {
  askFarphaIntelligence,
  currentIntelligenceContext,
  FARPHA_AI_CONVERSATION_KEY,
  intelligenceErrorMessage,
} from "./farphaIntelligence";
import {
  checkSupportAdmin,
  changeSyncedTicketStatus,
  listSupportConversation,
  listSyncedSupportTickets,
  sendSupportConversationMessage,
  subscribeToSupportChanges,
  supportSyncErrorMessage,
  syncSupportTicket,
  type SupportConversationMessage,
} from "./supportCenterService";
import {
  answerSupportQuestion,
  changeSupportTicketStatus,
  makeSupportTicket,
  mergeSupportTickets,
  OPEN_SUPPORT_EVENT,
  readSupportTickets,
  saveSupportTickets,
  supportEmailHref,
  supportWhatsappHref,
  type SupportTicket,
  type SupportTicketStatus,
} from "./supportCenterUtils";

type Message = { id: number; author: "assistant" | "user"; text: string; path?: string; action?: string; source?: "online" | "local" };
type Tab = "assistant" | "tickets" | "contact";
type TicketFilter = "Todos" | SupportTicketStatus;

const quickActions = ["Começar no FARPHA", "Encontrar um módulo", "Resolver um problema", "Conta e segurança", "Planos e subscrição"];
const ticketFilters: TicketFilter[] = ["Todos", "Aberto", "Em análise", "Aguardando utilizador", "Resolvido", "Encerrado"];
const adminStatuses: SupportTicketStatus[] = ["Aberto", "Em análise", "Aguardando utilizador", "Resolvido", "Encerrado"];

function statusStyle(status: SupportTicketStatus) {
  if (status === "Resolvido" || status === "Encerrado") return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
  if (status === "Em análise" || status === "Enviado") return "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200";
  if (status === "Aguardando utilizador") return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200";
  return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200";
}

function syncLabel(ticket: SupportTicket) {
  if (ticket.syncState === "synced") return { label: "Sincronizado", Icon: Cloud };
  if (ticket.syncState === "syncing") return { label: "A sincronizar", Icon: LoaderCircle };
  if (ticket.syncState === "error") return { label: "Pendente", Icon: CloudOff };
  return { label: "Neste dispositivo", Icon: CloudOff };
}

export default function SupportAssistant() {
  const { mode, session } = useAuth();
  const userId = session?.user.id;
  const { push } = useNotifications();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("assistant");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, author: "assistant", text: "Olá! Sou a Inteligência FARPHA. Posso orientar a utilização, esclarecer dúvidas, localizar recursos, preparar um diagnóstico ou encaminhar para a equipa." },
  ]);
  const [intelligenceBusy, setIntelligenceBusy] = useState(false);
  const [intelligenceNotice, setIntelligenceNotice] = useState("");
  const [remainingQuestions, setRemainingQuestions] = useState<number | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>(() => readSupportTickets(localStorage));
  const [filter, setFilter] = useState<TicketFilter>("Todos");
  const [creating, setCreating] = useState(false);
  const [createdId, setCreatedId] = useState("");
  const [supportAdmin, setSupportAdmin] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState("");
  const [conversationTicketId, setConversationTicketId] = useState("");
  const [conversation, setConversation] = useState<SupportConversationMessage[]>([]);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [reply, setReply] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageId = useRef(2);
  const intelligenceBusyRef = useRef(false);
  const filteredTickets = useMemo(
    () => filter === "Todos" ? tickets : tickets.filter((ticket) => ticket.status === filter),
    [filter, tickets],
  );

  const updateTickets = useCallback((next: SupportTicket[]) => {
    setTickets(next);
    saveSupportTickets(localStorage, next);
  }, []);

  const refreshRemote = useCallback(async (silent = false) => {
    if (mode !== "required" || !userId) return;
    if (!silent) setSyncing(true);
    try {
      const [remoteTickets, isAdmin] = await Promise.all([
        listSyncedSupportTickets(),
        checkSupportAdmin(),
      ]);
      setSupportAdmin(isAdmin);
      const localTickets = readSupportTickets(localStorage);
      const remoteReferences = new Set(remoteTickets.map((ticket) => ticket.id));
      const pending = localTickets.filter((ticket) => !ticket.remoteId && !remoteReferences.has(ticket.id));
      const migrated: SupportTicket[] = [];
      for (const ticket of pending) migrated.push(await syncSupportTicket({ ...ticket, syncState: "syncing" }, userId));
      const merged = mergeSupportTickets(localTickets, [...remoteTickets, ...migrated]);
      updateTickets(merged);
      setSyncNotice(isAdmin ? "Caixa de entrada administrativa sincronizada." : "Pedidos sincronizados com a sua conta.");
    } catch (error) {
      setSyncNotice(supportSyncErrorMessage(error));
    } finally {
      setSyncing(false);
    }
  }, [mode, updateTickets, userId]);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const openSupport = () => setOpen(true);
    window.addEventListener("keydown", escape);
    window.addEventListener(OPEN_SUPPORT_EVENT, openSupport);
    return () => {
      window.removeEventListener("keydown", escape);
      window.removeEventListener(OPEN_SUPPORT_EVENT, openSupport);
    };
  }, []);

  useEffect(() => { if (open && tab === "assistant") window.setTimeout(() => inputRef.current?.focus(), 80); }, [open, tab]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "nearest" }); }, [messages.length]);

  useEffect(() => {
    if (!open || tab !== "tickets" || mode !== "required" || !userId) return;
    const initialRefresh = window.setTimeout(() => { void refreshRemote(); }, 0);
    const unsubscribe = subscribeToSupportChanges(() => {
      void refreshRemote(true);
      push({ title: "Central de Apoio atualizada", message: "Existe uma alteração num pedido de suporte.", tone: "info" });
    });
    return () => {
      window.clearTimeout(initialRefresh);
      unsubscribe();
    };
  }, [mode, open, push, refreshRemote, tab, userId]);

  async function ask(text: string) {
    const clean = text.trim();
    if (!clean || intelligenceBusyRef.current) return;
    const base = messageId.current;
    messageId.current += 2;
    setMessages((current) => [...current, { id: base, author: "user", text: clean }]);
    setQuestion("");
    const onlineEnabled = import.meta.env.VITE_FARPHA_AI_ENABLED !== "false";
    if (mode !== "required" || !session || !onlineEnabled || !navigator.onLine) {
      setMessages((current) => [...current, { id: base + 1, author: "assistant", source: "local", ...answerSupportQuestion(clean) }]);
      setIntelligenceNotice(
        mode !== "required"
          ? "Guia local ativo. Ative a autenticação Supabase para utilizar a Inteligência online."
          : !navigator.onLine
            ? "Sem ligação. O guia local respondeu neste dispositivo."
            : "Inteligência online desativada pela configuração pública.",
      );
      return;
    }

    intelligenceBusyRef.current = true;
    setIntelligenceBusy(true);
    setIntelligenceNotice("");
    try {
      const storageKey = `${FARPHA_AI_CONVERSATION_KEY}:${session.user.id}`;
      const conversationId = sessionStorage.getItem(storageKey) || undefined;
      const context = currentIntelligenceContext(
        window.location,
        document.title,
        navigator.language,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
      const result = await askFarphaIntelligence(clean, conversationId, context);
      sessionStorage.setItem(storageKey, result.conversationId);
      setRemainingQuestions(result.remaining);
      setMessages((current) => [...current, { id: base + 1, author: "assistant", source: "online", text: result.answer }]);
      setIntelligenceNotice(`Resposta protegida · ${result.remaining} perguntas disponíveis nesta hora.`);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { id: base + 1, author: "assistant", source: "local", ...answerSupportQuestion(clean) },
      ]);
      setIntelligenceNotice(intelligenceErrorMessage(error));
    } finally {
      intelligenceBusyRef.current = false;
      setIntelligenceBusy(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(question);
  }

  function navigate(path: string) {
    setOpen(false);
    window.location.assign(path);
  }

  async function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const ticket = makeSupportTicket({
      subject: String(data.get("subject")),
      category: String(data.get("category")),
      priority: String(data.get("priority")),
      description: String(data.get("description")),
    });
    updateTickets([ticket, ...tickets]);
    setCreatedId(ticket.id);
    setCreating(false);
    setFilter("Todos");
    form.reset();
    if (mode === "required" && userId && navigator.onLine) {
      try {
        const synced = await syncSupportTicket({ ...ticket, syncState: "syncing" }, userId);
        updateTickets(mergeSupportTickets([ticket, ...tickets], [synced]));
        setSyncNotice("Pedido sincronizado com a sua conta.");
      } catch (error) {
        updateTickets([{ ...ticket, syncState: "error" }, ...tickets]);
        setSyncNotice(supportSyncErrorMessage(error));
      }
    } else {
      setSyncNotice(mode === "required" ? "Sem ligação. O pedido será sincronizado quando voltar a estar online." : "Modo local: o pedido permanece neste dispositivo.");
    }
  }

  async function setStatus(id: string, status: SupportTicketStatus) {
    const ticket = tickets.find((item) => item.id === id);
    if (!ticket) return;
    const localUpdate = changeSupportTicketStatus(ticket, status);
    updateTickets(tickets.map((item) => item.id === id ? localUpdate : item));
    if (!ticket.remoteId || mode !== "required") return;
    try {
      const remoteUpdate = await changeSyncedTicketStatus(ticket.remoteId, status);
      updateTickets(tickets.map((item) => item.id === id ? remoteUpdate : item));
    } catch (error) {
      setSyncNotice(supportSyncErrorMessage(error));
    }
  }

  async function openConversation(ticket: SupportTicket) {
    setConversationTicketId(ticket.id);
    setConversation([]);
    if (!ticket.remoteId) {
      setSyncNotice("Sincronize o pedido com o Supabase para utilizar a conversa.");
      return;
    }
    setConversationLoading(true);
    try {
      setConversation(await listSupportConversation(ticket.remoteId));
    } catch (error) {
      setSyncNotice(supportSyncErrorMessage(error));
    } finally {
      setConversationLoading(false);
    }
  }

  async function sendReply(event: FormEvent<HTMLFormElement>, ticket: SupportTicket) {
    event.preventDefault();
    if (!userId || !ticket.remoteId || !reply.trim()) return;
    setConversationLoading(true);
    try {
      const sent = await sendSupportConversationMessage(ticket.remoteId, userId, reply, supportAdmin);
      setConversation((current) => [...current, sent]);
      setReply("");
      push({ title: "Mensagem enviada", message: `Pedido ${ticket.id} atualizado.`, tone: "success" });
    } catch (error) {
      setSyncNotice(supportSyncErrorMessage(error));
    } finally {
      setConversationLoading(false);
    }
  }

  const generalWhatsapp = `https://wa.me/${supportConfig.whatsapp}?text=${encodeURIComponent("Olá, preciso de ajuda com o FARPHA.")}`;

  return <>
    <button type="button" onClick={() => setOpen(true)} className="fixed bottom-20 right-4 z-[var(--farpha-z-assistant)] flex min-h-14 items-center gap-2 rounded-2xl bg-[#173c2a] px-4 font-black text-white shadow-[0_18px_45px_rgba(7,35,20,.28)] transition hover:-translate-y-0.5 hover:bg-[#245b3e] sm:bottom-6 sm:right-6" aria-label="Abrir Centro de Ajuda FARPHA" aria-haspopup="dialog">
      <Headphones size={22}/><span className="hidden xl:inline">Ajuda e suporte</span>
    </button>

    {open && <section role="dialog" aria-modal="true" aria-labelledby="support-title" className="fixed inset-2 z-[var(--farpha-z-assistant)] flex flex-col overflow-hidden rounded-3xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] shadow-[0_30px_100px_rgba(5,30,17,.35)] sm:inset-auto sm:bottom-5 sm:right-6 sm:h-[min(800px,calc(100dvh-2.5rem))] sm:w-[min(520px,calc(100vw-3rem))]">
      <header className="bg-[#102d1e] p-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#b4e533] text-[#102d1e]"><Sparkles size={23}/></span><div className="min-w-0"><h2 id="support-title" className="font-black text-white">Centro de Ajuda FARPHA</h2><p className="truncate text-xs text-white/55">{supportAdmin ? "Caixa administrativa e Inteligência" : "Orientação, pedidos e atendimento"}</p></div></div>
          <button onClick={() => setOpen(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl hover:bg-white/10" aria-label="Fechar centro de ajuda"><X size={20}/></button>
        </div>
        <nav className="mt-4 grid grid-cols-3 gap-1 rounded-xl bg-black/20 p-1" aria-label="Áreas do suporte">
          {([["assistant", "Inteligência", Bot], ["tickets", "Pedidos", Ticket], ["contact", "Equipa", UserRound]] as const).map(([id, label, Icon]) => <button key={id} onClick={() => setTab(id)} className={`flex min-h-11 items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-black sm:text-xs ${tab === id ? "bg-white text-[#173c2a]" : "text-white/65 hover:text-white"}`} aria-current={tab === id ? "page" : undefined}><Icon size={15}/>{label}</button>)}
        </nav>
      </header>

      {tab === "assistant" && <>
        <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--farpha-background)] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] font-black uppercase tracking-[.16em] text-[var(--farpha-text-muted)]">Área atual · {window.location.pathname}</p>
            <span className={`rounded-full px-2 py-1 text-[10px] font-black ${mode === "required" && import.meta.env.VITE_FARPHA_AI_ENABLED !== "false" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>
              {intelligenceBusy ? "A analisar…" : mode === "required" && import.meta.env.VITE_FARPHA_AI_ENABLED !== "false" ? "Inteligência segura" : "Guia local"}
            </span>
          </div>
          <div className="space-y-3">{messages.map((message) => <article key={message.id} className={`max-w-[90%] rounded-2xl p-3 text-sm leading-6 ${message.author === "user" ? "ml-auto bg-[#276545] text-white" : "border border-[var(--farpha-border)] bg-[var(--farpha-surface)] text-[var(--farpha-text)] shadow-sm"}`}>{message.author === "assistant" && message.source && <p className="mb-1 text-[9px] font-black uppercase tracking-[.14em] text-[var(--farpha-text-muted)]">{message.source === "online" ? "Inteligência online" : "Guia local verificado"}</p>}<p>{message.text}</p>{message.path && <button onClick={() => navigate(message.path!)} className="mt-2 inline-flex items-center gap-1 font-black text-emerald-700 dark:text-emerald-300">{message.action}<ChevronRight size={15}/></button>}</article>)}</div>
          {intelligenceBusy && <div role="status" className="mt-3 flex max-w-[90%] items-center gap-2 rounded-2xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-3 text-xs text-[var(--farpha-text-muted)]"><LoaderCircle size={16} className="animate-spin"/>A Inteligência FARPHA está a preparar uma resposta segura…</div>}
          {intelligenceNotice && <p role="status" className="mt-3 rounded-xl bg-[var(--farpha-surface-muted)] p-2 text-[10px] leading-4 text-[var(--farpha-text-muted)]">{intelligenceNotice}</p>}
          {messages.length === 1 && <div className="mt-4 grid gap-2">{quickActions.map((item) => <button key={item} disabled={intelligenceBusy} onClick={() => void ask(item)} className="flex min-h-11 items-center justify-between rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] px-3 text-left text-xs font-bold text-[var(--farpha-text)] hover:border-emerald-500 disabled:opacity-50">{item}<ChevronRight size={15}/></button>)}</div>}
          <button onClick={() => { setTab("tickets"); setCreating(true); }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-600/40 p-3 text-sm font-black text-emerald-700 dark:text-emerald-300"><Ticket size={17}/>Ainda precisa de ajuda? Criar pedido</button>
          <div ref={endRef}/>
        </div>
        <form onSubmit={submit} className="border-t border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-3"><div className="flex gap-2"><input ref={inputRef} value={question} onChange={(event) => setQuestion(event.target.value)} disabled={intelligenceBusy} maxLength={2000} placeholder="Descreva o que pretende fazer" aria-label="Pergunta para a Inteligência FARPHA" className="min-w-0 flex-1 rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface-muted)] px-3 py-3 text-sm text-[var(--farpha-text)] outline-none focus:border-emerald-500 disabled:opacity-60"/><button disabled={intelligenceBusy || !question.trim()} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#276545] text-white disabled:opacity-45" aria-label="Enviar pergunta">{intelligenceBusy ? <LoaderCircle size={18} className="animate-spin"/> : <Send size={18}/>}</button></div><p className="mt-2 flex items-start gap-1 text-[10px] text-[var(--farpha-text-muted)]"><ShieldCheck size={12} className="mt-0.5 shrink-0"/>Sessão autenticada, histórico protegido e fallback local. Não introduza palavras-passe, dados bancários ou chaves. {remainingQuestions !== null ? `Limite restante: ${remainingQuestions}.` : ""}</p></form>
      </>}

      {tab === "tickets" && <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className={`mb-4 flex items-start gap-3 rounded-2xl p-3 text-xs ${mode === "required" ? "bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-100" : "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100"}`}>
          {mode === "required" ? <Cloud size={17} className="shrink-0"/> : <CloudOff size={17} className="shrink-0"/>}
          <div className="min-w-0"><p className="font-black">{mode === "required" ? supportAdmin ? "Caixa administrativa Supabase" : "Sincronização Supabase" : "Modo local"}</p><p className="mt-1">{syncNotice || (mode === "required" ? "Os pedidos desta conta serão sincronizados depois de executar o SQL da Sprint 107.4." : "Os pedidos permanecem apenas neste dispositivo.")}</p></div>
          {mode === "required" && <button onClick={() => void refreshRemote()} disabled={syncing} className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/60" aria-label="Atualizar pedidos"><RefreshCw size={15} className={syncing ? "animate-spin" : ""}/></button>}
        </div>
        {createdId && <div role="status" className="mb-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"><p className="flex items-center gap-2 font-black"><CheckCircle2 size={18}/>Pedido criado</p><p className="mt-1">Referência {createdId}. {mode === "required" ? "O FARPHA tentará sincronizá-lo automaticamente." : "Pode enviá-lo por email ou WhatsApp."}</p></div>}
        <div className="flex items-center justify-between gap-3"><div><h3 className="font-black">{supportAdmin ? "Caixa de entrada do suporte" : "Pedidos de suporte"}</h3><p className="text-xs text-[var(--farpha-text-muted)]">{supportAdmin ? "Acompanhe os pedidos dos utilizadores." : "Prepare, envie e acompanhe cada situação."}</p></div><button onClick={() => setCreating(!creating)} className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-[#173c2a] px-3 text-xs font-black text-white"><Plus size={16}/>Novo</button></div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar pedidos">{ticketFilters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-black ${filter === item ? "bg-[#173c2a] text-white" : "bg-[var(--farpha-surface-muted)] text-[var(--farpha-text-muted)]"}`}>{item}</button>)}</div>
        {creating && <form onSubmit={(event) => void createTicket(event)} className="mt-4 grid gap-3 rounded-2xl border border-[var(--farpha-border)] bg-[var(--farpha-background)] p-4">
          <label className="text-xs font-bold">Assunto<input required name="subject" minLength={2} maxLength={100} className="mt-1.5 w-full rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-3 text-[var(--farpha-text)]"/></label>
          <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold">Categoria<select name="category" className="mt-1.5 w-full rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-3 text-[var(--farpha-text)]"><option>Problema técnico</option><option>Conta e acesso</option><option>Subscrição</option><option>Dúvida de utilização</option><option>Sugestão</option></select></label><label className="text-xs font-bold">Prioridade<select name="priority" className="mt-1.5 w-full rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-3 text-[var(--farpha-text)]"><option>Normal</option><option>Alta</option><option>Urgente</option></select></label></div>
          <label className="text-xs font-bold">Descrição<textarea required name="description" minLength={2} rows={4} maxLength={1200} placeholder="Página, ação e mensagem apresentada" className="mt-1.5 w-full resize-none rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-3 text-[var(--farpha-text)]"/></label>
          <button className="rounded-xl bg-[#276545] p-3 font-black text-white">Criar pedido</button>
        </form>}
        <div className="mt-4 space-y-3">
          {filteredTickets.length === 0 && !creating && <div className="rounded-2xl border border-dashed border-[var(--farpha-border)] p-8 text-center"><Ticket className="mx-auto text-[var(--farpha-text-muted)]"/><p className="mt-3 font-black">Nenhum pedido neste estado</p></div>}
          {filteredTickets.map((ticket) => {
            const sync = syncLabel(ticket);
            const conversationOpen = conversationTicketId === ticket.id;
            return <article key={ticket.id} className="rounded-2xl border border-[var(--farpha-border)] p-4">
              <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="break-words font-black">{ticket.subject}</p><p className="mt-1 text-[11px] text-[var(--farpha-text-muted)]">{ticket.id} · {new Date(ticket.createdAt).toLocaleString("pt-PT")}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${statusStyle(ticket.status)}`}>{ticket.status}</span></div>
              <p className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[var(--farpha-text-muted)]"><sync.Icon size={13} className={ticket.syncState === "syncing" ? "animate-spin" : ""}/>{sync.label}</p>
              <p className="mt-2 text-xs font-bold text-[var(--farpha-text-muted)]">{ticket.category} · prioridade {ticket.priority}</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{ticket.description}</p>
              {supportAdmin && ticket.remoteId && <label className="mt-4 block text-xs font-black">Estado do atendimento<select value={ticket.status === "Enviado" ? "Aberto" : ticket.status} onChange={(event) => void setStatus(ticket.id, event.target.value as SupportTicketStatus)} className="mt-1.5 w-full rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-3 text-[var(--farpha-text)]">{adminStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>}
              <button onClick={() => void openConversation(ticket)} disabled={!ticket.remoteId} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--farpha-border)] px-3 text-xs font-black disabled:opacity-45"><MessagesSquare size={15}/>{conversationOpen ? "Atualizar conversa" : "Abrir conversa"}</button>
              {conversationOpen && <div className="mt-3 rounded-2xl bg-[var(--farpha-background)] p-3">
                {conversationLoading && <p className="flex items-center gap-2 text-xs text-[var(--farpha-text-muted)]"><LoaderCircle size={15} className="animate-spin"/>A carregar conversa…</p>}
                {!conversationLoading && conversation.length === 0 && <p className="text-xs text-[var(--farpha-text-muted)]">Ainda não existem mensagens neste pedido.</p>}
                <div className="space-y-2">{conversation.map((item) => <div key={item.id} className={`rounded-xl p-3 text-xs leading-5 ${item.authorKind === "support" ? "bg-[#173c2a] text-white" : "border border-[var(--farpha-border)] bg-[var(--farpha-surface)]"}`}><p className="font-black">{item.authorKind === "support" ? "Equipa FARPHA" : "Utilizador"}</p><p className="mt-1 whitespace-pre-wrap">{item.body}</p><p className="mt-1 opacity-55">{new Date(item.createdAt).toLocaleString("pt-PT")}</p></div>)}</div>
                {ticket.status !== "Encerrado" && <form onSubmit={(event) => void sendReply(event, ticket)} className="mt-3 flex gap-2"><input value={reply} onChange={(event) => setReply(event.target.value)} required maxLength={4000} placeholder={supportAdmin ? "Responder ao utilizador" : "Escrever uma mensagem"} className="min-w-0 flex-1 rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] px-3 text-xs"/><button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#276545] text-white" aria-label="Enviar mensagem"><Send size={16}/></button></form>}
              </div>}
              {!supportAdmin && ticket.status !== "Resolvido" && ticket.status !== "Encerrado" ? <div className="mt-3 grid gap-2 sm:grid-cols-2"><a href={supportEmailHref(ticket, supportConfig.email)} onClick={() => void setStatus(ticket.id, "Enviado")} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#173c2a] px-3 text-xs font-black text-white"><Mail size={15}/>Email</a><a href={supportWhatsappHref(ticket, supportConfig.whatsapp)} target="_blank" rel="noreferrer" onClick={() => void setStatus(ticket.id, "Enviado")} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-xs font-black text-white"><MessageCircle size={15}/>WhatsApp</a><button onClick={() => void setStatus(ticket.id, "Resolvido")} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--farpha-border)] px-3 text-xs font-black sm:col-span-2"><CheckCircle2 size={15}/>Marcar como resolvido</button></div> : !supportAdmin && ticket.status === "Resolvido" && <button onClick={() => void setStatus(ticket.id, "Aberto")} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--farpha-border)] px-3 text-xs font-black"><RotateCcw size={15}/>Reabrir pedido</button>}
            </article>;
          })}
        </div>
      </div>}

      {tab === "contact" && <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="rounded-2xl bg-[#edf5e7] p-4 dark:bg-emerald-950"><h3 className="flex items-center gap-2 font-black text-[#173c2a] dark:text-emerald-100"><UserRound size={19}/>Falar com o administrador</h3><p className="mt-2 text-sm leading-6 text-[#52645a] dark:text-emerald-100/70">Use a conversa sincronizada para manter o histórico, WhatsApp para orientação rápida, telefone para situações urgentes e email para documentos.</p></div>
        <div className="mt-4 grid gap-3"><a href={generalWhatsapp} target="_blank" rel="noreferrer" className="flex min-h-16 items-center gap-4 rounded-2xl border border-[var(--farpha-border)] p-4 hover:border-emerald-500"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><MessageCircle/></span><span><strong className="block">WhatsApp</strong><small className="text-[var(--farpha-text-muted)]">Iniciar conversa com o atendimento</small></span><ExternalLink size={15} className="ml-auto"/></a><a href={`mailto:${supportConfig.email}?subject=Ajuda%20FARPHA`} className="flex min-h-16 items-center gap-4 rounded-2xl border border-[var(--farpha-border)] p-4 hover:border-emerald-500"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700"><Mail/></span><span className="min-w-0"><strong className="block break-all">{supportConfig.email}</strong><small className="text-[var(--farpha-text-muted)]">Resposta e envio de documentação</small></span></a><a href={`tel:${supportConfig.phoneHref}`} className="flex min-h-16 items-center gap-4 rounded-2xl border border-[var(--farpha-border)] p-4 hover:border-emerald-500"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700"><Phone/></span><span><strong className="block">{supportConfig.phone}</strong><small className="text-[var(--farpha-text-muted)]">Atendimento telefónico</small></span></a></div>
        <p className="mt-5 flex items-start gap-2 rounded-xl bg-[var(--farpha-background)] p-3 text-xs text-[var(--farpha-text-muted)]"><Clock3 size={16} className="shrink-0"/>{supportConfig.hours}.</p>
        <p className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[var(--farpha-text-muted)]"><ShieldCheck size={15} className="mt-0.5 shrink-0"/>A sincronização utiliza a conta autenticada e as políticas RLS. Não introduza credenciais ou dados bancários.</p>
      </div>}
    </section>}
  </>;
}
