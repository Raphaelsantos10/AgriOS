import { useCallback, useEffect, useState } from "react";
import { KeyRound, LoaderCircle, ShieldCheck, ShieldOff, Smartphone } from "lucide-react";
import Button from "../../../design-system/components/Button";
import { supabase } from "../../../services/supabase";

type Factor = { id: string; friendly_name?: string; status: string; created_at: string };
type Enrollment = { id: string; qr: string; secret: string };

export default function MfaSettingsCard({ enabled }: { enabled: boolean }) {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadFactors = useCallback(async () => {
    if (!enabled) return;
    const result = await supabase.auth.mfa.listFactors();
    if (result.error) setMessage(result.error.message);
    else setFactors(result.data.totp.filter((factor) => factor.status === "verified"));
  }, [enabled]);
  useEffect(() => { queueMicrotask(() => void loadFactors()); }, [loadFactors]);

  async function startEnrollment() {
    setBusy(true); setMessage("");
    const result = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "FARPHA Authenticator" });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else setEnrollment({ id: result.data.id, qr: result.data.totp.qr_code, secret: result.data.totp.secret });
  }
  async function confirmEnrollment() {
    if (!enrollment || !/^\d{6}$/.test(code)) { setMessage("Introduza o código de seis algarismos."); return; }
    setBusy(true); setMessage("");
    const result = await supabase.auth.mfa.challengeAndVerify({ factorId: enrollment.id, code });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else { setEnrollment(null); setCode(""); setMessage("Autenticação em dois fatores ativada."); await loadFactors(); }
  }
  async function cancelEnrollment() {
    if (enrollment) await supabase.auth.mfa.unenroll({ factorId: enrollment.id });
    setEnrollment(null); setCode("");
  }
  async function removeFactor(factorId: string) {
    if (!window.confirm("Desativar a autenticação em dois fatores neste autenticador?")) return;
    setBusy(true); setMessage("");
    const result = await supabase.auth.mfa.unenroll({ factorId });
    setBusy(false);
    setMessage(result.error ? result.error.message : "Autenticador removido.");
    if (!result.error) await loadFactors();
  }

  return <article className="rounded-2xl border border-[var(--farpha-border)] p-5 lg:col-span-2"><div className="flex flex-wrap items-start justify-between gap-3"><div><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><ShieldCheck/></span><h3 className="mt-4 font-black">Autenticação em dois fatores</h3><p className="mt-2 max-w-xl text-sm text-[var(--farpha-text-muted)]">Use Google Authenticator, Microsoft Authenticator, Authy ou qualquer aplicativo TOTP compatível.</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-black ${factors.length ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{factors.length ? "Ativa" : "Inativa"}</span></div>
    {!enabled && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Disponível quando a autenticação Supabase estiver ativa.</p>}
    {enabled && !enrollment && <div className="mt-5 space-y-3">{factors.map((factor) => <div key={factor.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--farpha-border)] bg-[var(--farpha-surface-muted)] p-3"><div className="flex items-center gap-3"><Smartphone className="text-emerald-700"/><div><p className="font-bold">{factor.friendly_name || "Aplicativo autenticador"}</p><p className="text-xs text-[var(--farpha-text-muted)]">Adicionado em {new Date(factor.created_at).toLocaleDateString("pt-PT")}</p></div></div><button type="button" onClick={() => void removeFactor(factor.id)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50"><ShieldOff size={16}/>Remover</button></div>)}<Button onClick={() => void startEnrollment()} disabled={busy}><KeyRound size={17}/>{factors.length ? "Adicionar outro autenticador" : "Ativar dois fatores"}</Button></div>}
    {enrollment && <div className="mt-5 grid gap-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 md:grid-cols-[200px_1fr]"><img src={enrollment.qr} alt="QR Code para configurar o autenticador" className="aspect-square w-[200px] rounded-xl border bg-white p-2"/><div><h4 className="font-black">Digitalize o QR Code</h4><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700"><li>Abra o aplicativo autenticador.</li><li>Adicione uma conta por QR Code.</li><li>Introduza abaixo o código de seis algarismos.</li></ol><details className="mt-3 text-xs text-slate-600"><summary className="cursor-pointer font-bold">Não consegue digitalizar?</summary><code className="mt-2 block break-all rounded-lg bg-white p-2">{enrollment.secret}</code></details><input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="000000" className="mt-4 w-full max-w-xs rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-xl font-black tracking-[.35em] text-slate-950"/><div className="mt-3 flex flex-wrap gap-2"><Button onClick={() => void confirmEnrollment()} disabled={busy || code.length !== 6}>{busy && <LoaderCircle className="animate-spin" size={17}/>}Confirmar e ativar</Button><Button variant="secondary" onClick={() => void cancelEnrollment()} disabled={busy}>Cancelar</Button></div></div></div>}
    {message && <p role="status" className="mt-4 rounded-xl bg-[var(--farpha-surface-muted)] p-3 text-sm font-semibold">{message}</p>}
  </article>;
}
