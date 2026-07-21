import { useState, type FormEvent, type ReactNode } from "react";
import { Leaf, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "./AuthContext";

function Frame({ children }: { children: ReactNode }) {
  return <main className="grid min-h-dvh place-items-center bg-[radial-gradient(circle_at_top,#315d3c,#10271a_65%)] p-5"><section className="w-full max-w-md rounded-3xl border border-white/15 bg-white p-7 shadow-2xl"><div className="mb-7 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#214d32] text-[#c7ef45]"><Leaf /></span><div><p className="text-xl font-black text-[#173321]">FARPHA</p><p className="text-xs font-semibold uppercase tracking-[.16em] text-slate-500">Agricultura inteligente</p></div></div>{children}</section></main>;
}

function Login() {
  const { signIn, signInSocial, requestReset, error } = useAuth();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false); const [notice, setNotice] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); await signIn(email.trim(), password); setBusy(false); }
  async function reset() { if (!email.trim()) { setNotice("Introduza primeiro o seu e-mail."); return; } setBusy(true); if (await requestReset(email.trim())) setNotice("Enviámos as instruções de recuperação. Consulte o seu e-mail."); setBusy(false); }
  const google = import.meta.env.VITE_GOOGLE_AUTH_ENABLED === "true"; const microsoft = import.meta.env.VITE_MICROSOFT_AUTH_ENABLED === "true";
  return <Frame><h1 className="text-2xl font-black text-slate-900">Entrar na exploração</h1><p className="mt-2 text-sm text-slate-600">Acesso protegido pela conta FARPHA da sua organização.</p>{(google || microsoft) && <div className="mt-6 grid gap-2">{google && <button onClick={()=>void signInSocial("google")} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-50">Continuar com Google</button>}{microsoft && <button onClick={()=>void signInSocial("azure")} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-50">Continuar com Microsoft</button>}<div className="flex items-center gap-3 py-1 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200"/>ou com e-mail<span className="h-px flex-1 bg-slate-200"/></div></div>}<form onSubmit={submit} className={`${google || microsoft ? "mt-2" : "mt-6"} space-y-4`}><label className="block text-sm font-bold text-slate-700">E-mail<div className="mt-1 flex items-center rounded-xl border border-slate-300 px-3"><Mail size={17} className="text-slate-400"/><input className="w-full bg-transparent px-3 py-3 outline-none" type="email" required autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)}/></div></label><label className="block text-sm font-bold text-slate-700">Palavra-passe<div className="mt-1 flex items-center rounded-xl border border-slate-300 px-3"><LockKeyhole size={17} className="text-slate-400"/><input className="w-full bg-transparent px-3 py-3 outline-none" type="password" required autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)}/></div></label>{(error || notice) && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{error || notice}</p>}<button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#214d32] px-4 py-3 font-extrabold text-white disabled:opacity-60">{busy && <LoaderCircle className="animate-spin" size={18}/>}Entrar</button><button type="button" onClick={reset} disabled={busy} className="w-full text-sm font-bold text-[#315d3c]">Recuperar palavra-passe</button></form></Frame>;
}

function Recovery() {
  const { updatePassword, error } = useAuth(); const [password,setPassword]=useState(""); const [done,setDone]=useState(false);
  return <Frame><h1 className="text-2xl font-black">Nova palavra-passe</h1><form className="mt-6 space-y-4" onSubmit={async(e)=>{e.preventDefault();setDone(await updatePassword(password));}}><input className="w-full rounded-xl border border-slate-300 px-4 py-3" type="password" minLength={10} required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Mínimo de 10 caracteres"/>{error&&<p className="text-sm text-red-700">{error}</p>}{done&&<p className="text-sm text-emerald-700">Palavra-passe atualizada.</p>}<button className="w-full rounded-xl bg-[#214d32] px-4 py-3 font-bold text-white">Guardar</button></form></Frame>;
}

export default function AuthGate({ children }: { children: ReactNode }) {
  const { mode, loading, session, profile, recovery, signOut, error } = useAuth();
  if (mode === "local") return <>{children}</>;
  if (mode === "misconfigured") return <Frame><ShieldCheck className="mb-4 text-amber-600" size={34}/><h1 className="text-xl font-black">Autenticação por configurar</h1><p className="mt-3 text-sm text-slate-600">Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ficheiro frontend/.env.local ou desative VITE_AUTH_REQUIRED.</p></Frame>;
  if (loading) return <Frame><div className="flex items-center gap-3 font-bold"><LoaderCircle className="animate-spin"/>A validar sessão segura…</div></Frame>;
  if (recovery) return <Recovery/>;
  if (!session) return <Login/>;
  if (!profile || !profile.active) return <Frame><ShieldCheck className="mb-4 text-amber-600"/><h1 className="text-xl font-black">Acesso pendente</h1><p className="mt-3 text-sm text-slate-600">O administrador deve ativar o seu perfil. {error && `Detalhe: ${error}`}</p><button onClick={()=>void signOut()} className="mt-6 font-bold text-[#315d3c]">Terminar sessão</button></Frame>;
  return <>{children}</>;
}
