import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { KeyRound, LoaderCircle, ShieldCheck } from "lucide-react";
import { supabase } from "../../services/supabase";

export default function MfaGate({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      const assurance = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (!active) return;
      if (assurance.error) { setError(assurance.error.message); setChecking(false); return; }
      if (assurance.data.nextLevel === "aal2" && assurance.data.currentLevel !== "aal2") {
        const factors = await supabase.auth.mfa.listFactors();
        if (!active) return;
        if (factors.error) setError(factors.error.message);
        else setFactorId(factors.data.totp.find((factor) => factor.status === "verified")?.id || "");
      }
      setChecking(false);
    })();
    return () => { active = false; };
  }, []);

  async function verify(event: FormEvent) {
    event.preventDefault();
    if (!factorId || !/^\d{6}$/.test(code)) { setError("Introduza o código de seis algarismos do aplicativo autenticador."); return; }
    setBusy(true); setError("");
    const result = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
    setBusy(false);
    if (result.error) setError(result.error.message);
    else setFactorId("");
  }

  if (checking) return <MfaFrame><LoaderCircle className="animate-spin text-emerald-700"/><p className="font-bold">A verificar proteção da conta…</p></MfaFrame>;
  if (!factorId) return <>{children}</>;
  return <MfaFrame><ShieldCheck size={40} className="text-emerald-700"/><h1 className="mt-4 text-2xl font-black text-slate-950">Confirmação em dois fatores</h1><p className="mt-2 text-sm text-slate-600">Abra o aplicativo autenticador e introduza o código atual.</p><form onSubmit={verify} className="mt-6 space-y-4"><label className="block text-sm font-bold text-slate-700">Código de segurança<div className="mt-1 flex items-center rounded-xl border border-slate-300 px-3"><KeyRound size={18} className="text-slate-400"/><input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} autoFocus value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} className="w-full bg-transparent px-3 py-3 text-center text-xl font-black tracking-[.35em] outline-none"/></div></label>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}<button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#214d32] px-4 py-3 font-extrabold text-white disabled:opacity-60">{busy && <LoaderCircle className="animate-spin" size={18}/>}Confirmar acesso</button></form></MfaFrame>;
}

function MfaFrame({ children }: { children: ReactNode }) { return <main className="grid min-h-dvh place-items-center bg-[radial-gradient(circle_at_top,#315d3c,#10271a_65%)] p-5"><section className="w-full max-w-md rounded-3xl border border-white/15 bg-white p-7 shadow-2xl">{children}</section></main>; }
