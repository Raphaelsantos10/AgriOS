import { useEffect, useState } from "react";
import { Bell, Check, KeyRound, LockKeyhole, Mail, MonitorSmartphone, Save, ShieldCheck, UserRound } from "lucide-react";
import Button from "../../../design-system/components/Button";
import Card from "../../../design-system/components/Card";
import { useAuth } from "../../auth";
import MfaSettingsCard from "../components/MfaSettingsCard";
import { supabase } from "../../../services/supabase";
import SubscriptionPanel from "../components/SubscriptionPanel";

type Preferences = { emailAlerts: boolean; operationalAlerts: boolean; weeklyDigest: boolean; compactMode: boolean };
const preferenceKey = "farpha.account.preferences.v1";
const defaults: Preferences = { emailAlerts: true, operationalAlerts: true, weeklyDigest: false, compactMode: false };

export default function AccountSettingsPage() {
  const { mode, profile, requestReset } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>(() => { try { return { ...defaults, ...JSON.parse(localStorage.getItem(preferenceKey) || "{}") }; } catch { return defaults; } });
  const [message, setMessage] = useState("");
  const displayName = profile?.fullName || "Raphael";
  const role = profile ? ({ owner: "Proprietário", manager: "Gestor", operator: "Operador", viewer: "Consulta" }[profile.role]) : "Administrador local";

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }, []);

  function savePreferences() { localStorage.setItem(preferenceKey, JSON.stringify(preferences)); setMessage("Preferências guardadas neste dispositivo."); }
  async function sendPasswordEmail() {
    if (!profile?.email) { setMessage("Ative a autenticação e associe um email antes de alterar a palavra-passe."); return; }
    const ok = await requestReset(profile.email);
    setMessage(ok ? `Enviámos as instruções para ${profile.email}.` : "Não foi possível enviar o email. Confirme a configuração do Supabase.");
  }
  async function closeOtherSessions() {
    if (mode !== "required") { setMessage("Disponível quando a autenticação estiver ativa."); return; }
    const result = await supabase.auth.signOut({ scope: "others" });
    setMessage(result.error ? "Não foi possível encerrar as outras sessões." : "As outras sessões foram encerradas. Este dispositivo continua ligado.");
  }

  return <div className="mx-auto max-w-[1200px] space-y-6">
    <header><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">Conta FARPHA</p><h1 className="mt-1 text-3xl font-black">Configurações do utilizador</h1><p className="mt-2 max-w-3xl text-sm text-[var(--farpha-text-muted)]">Perfil, segurança, comunicações e subscrição num único local.</p></header>
    {message && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-900"><Check size={18}/>{message}</p>}

    <Card id="perfil" className="scroll-mt-24 p-5"><h2 className="flex items-center gap-2 text-xl font-black"><UserRound className="text-emerald-700"/> Perfil</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><Info label="Nome" value={displayName}/><Info label="Função" value={role}/><Info label="Email" value={profile?.email || "Não associado no modo local"}/><Info label="Estado da conta" value={profile?.active === false ? "Aguardando ativação" : "Ativa"}/></div><p className="mt-4 text-xs text-[var(--farpha-text-muted)]">A edição do nome e da organização será ligada ao perfil remoto quando as políticas RLS forem publicadas.</p></Card>

    <Card id="seguranca" className="scroll-mt-24 p-5"><h2 className="flex items-center gap-2 text-xl font-black"><ShieldCheck className="text-emerald-700"/> Segurança e acesso</h2><div className="mt-5 grid gap-4 lg:grid-cols-2"><SecurityCard icon={<Mail/>} title="Palavra-passe por email" detail="Receba uma ligação segura para criar uma nova palavra-passe." action={<Button onClick={() => void sendPasswordEmail()} disabled={mode !== "required"}><KeyRound size={17}/> Enviar email</Button>}/><SecurityCard icon={<MonitorSmartphone/>} title="Outras sessões" detail="Encerra os acessos nos outros dispositivos e mantém este navegador ligado." action={<Button variant="secondary" onClick={() => void closeOtherSessions()} disabled={mode !== "required"}><LockKeyhole size={17}/> Encerrar outras sessões</Button>}/><MfaSettingsCard enabled={mode === "required"}/></div></Card>

    <Card className="p-5"><h2 className="flex items-center gap-2 text-xl font-black"><Bell className="text-emerald-700"/> Notificações e preferências</h2><div className="mt-5 grid gap-3 md:grid-cols-2"> <Toggle label="Alertas por email" detail="Avisos importantes enviados para o email da conta." checked={preferences.emailAlerts} onChange={(value) => setPreferences((p) => ({ ...p, emailAlerts: value }))}/><Toggle label="Alertas operacionais" detail="Risco, clima e tarefas dentro do FARPHA." checked={preferences.operationalAlerts} onChange={(value) => setPreferences((p) => ({ ...p, operationalAlerts: value }))}/><Toggle label="Resumo semanal" detail="Relatório consolidado da exploração." checked={preferences.weeklyDigest} onChange={(value) => setPreferences((p) => ({ ...p, weeklyDigest: value }))}/><Toggle label="Interface compacta" detail="Reduz o espaçamento em tabelas e listas." checked={preferences.compactMode} onChange={(value) => setPreferences((p) => ({ ...p, compactMode: value }))}/></div><div className="mt-5"><Button onClick={savePreferences}><Save size={17}/> Guardar preferências</Button></div></Card>

    <SubscriptionPanel enabled={mode === "required"}/>
  </div>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface-muted)] p-4"><p className="text-xs font-bold uppercase tracking-wide text-[var(--farpha-text-muted)]">{label}</p><p className="mt-1 font-black text-[var(--farpha-text)]">{value}</p></div>; }
function SecurityCard({ icon, title, detail, action, badge }: { icon: React.ReactNode; title: string; detail: string; action?: React.ReactNode; badge?: string }) { return <article className="flex min-h-52 flex-col rounded-2xl border border-[var(--farpha-border)] p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-800">{icon}</span><h3 className="mt-4 font-black">{title}</h3><p className="mt-2 flex-1 text-sm text-[var(--farpha-text-muted)]">{detail}</p><div className="mt-4">{action || <span className="rounded-full bg-[var(--farpha-surface-muted)] px-3 py-1.5 text-xs font-black text-[var(--farpha-text-muted)]">{badge}</span>}</div></article>; }
function Toggle({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-[var(--farpha-border)] p-4"><span className="min-w-0 flex-1"><span className="block font-black">{label}</span><span className="block text-xs text-[var(--farpha-text-muted)]">{detail}</span></span><input type="checkbox" className="h-5 w-5" checked={checked} onChange={(event) => onChange(event.target.checked)}/></label>; }
