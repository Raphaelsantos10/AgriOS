import { useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, HelpCircle, LockKeyhole, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { Button, Checkbox, FormMessage, Input } from "../../design-system";
import FarphaLogo from "../../components/brand/FarphaLogo";
import heroImage from "../../assets/marketing/farpha-agriculture-hero-v2.webp";
import { REMEMBER_SESSION_KEY } from "../../services/supabase";
import { useAuth } from "./AuthContext";
import { emailValidationMessage, isValidEmail, normalizeAuthError } from "./utils/loginExperience";
import { supportConfig } from "../support/supportConfig";
import { LOCAL_ACCESS_KEY, LOCAL_ACCESS_VERSION } from "./utils/localAccess";
import { readSelectedPlan } from "./utils/marketingExperience";

export type AuthView = "login" | "signup";

export default function AuthExperience({ initialView, onBack }: { initialView: AuthView; onBack: () => void }) {
  const { mode, signIn, signUp, signInSocial, requestReset, error, socialProviders, refreshSocialProviders } = useAuth();
  const [view, setView] = useState<AuthView>(initialView);
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [fullName, setFullName] = useState("");
  const [operationType, setOperationType] = useState("producer");
  const [email, setEmail] = useState(() => localStorage.getItem("farpha-remembered-email") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [remember, setRemember] = useState(() => localStorage.getItem(REMEMBER_SESSION_KEY) === "true");
  const [terms, setTerms] = useState(false);
  const [selectedPlan] = useState(() => readSelectedPlan(localStorage));

  const emailError = emailValidationMessage(email, emailTouched);
  const google = socialProviders.google !== "disabled";
  const microsoft = socialProviders.azure !== "disabled";
  const passwordValid = password.length >= 10 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);

  function changeView(next: AuthView) {
    setView(next);
    setStep(1);
    setNotice("");
    setFormError("");
    window.history.replaceState(null, "", next === "signup" ? "#criar-conta" : "#entrar");
  }

  function detectCaps(event: KeyboardEvent<HTMLInputElement>) { setCapsLock(event.getModifierState("CapsLock")); }

  async function login(event: FormEvent) {
    event.preventDefault();
    setEmailTouched(true);
    setNotice("");
    setFormError("");
    if (!isValidEmail(email) || !password) {
      setFormError("Preencha um email válido e a palavra-passe.");
      return;
    }
    localStorage.setItem(REMEMBER_SESSION_KEY, String(remember));
    if (remember) localStorage.setItem("farpha-remembered-email", email.trim());
    else localStorage.removeItem("farpha-remembered-email");
    setBusy(true);
    await signIn(email.trim(), password);
    setBusy(false);
  }

  async function register(event: FormEvent) {
    event.preventDefault();
    setEmailTouched(true);
    setNotice("");
    setFormError("");
    if (step === 1) {
      if (fullName.trim().length < 2 || !isValidEmail(email)) {
        setFormError("Indique o seu nome completo e um email válido.");
        return;
      }
      setStep(2);
      return;
    }
    if (!passwordValid || !terms) {
      setFormError(!passwordValid ? "A palavra-passe ainda não cumpre todos os requisitos." : "Aceite os Termos de Utilização e a Política de Privacidade para continuar.");
      return;
    }
    setBusy(true);
    const result = await signUp({ email: email.trim(), password, fullName: fullName.trim(), operationType, selectedPlan });
    setBusy(false);
    if (result.ok) setNotice(result.needsConfirmation ? "Conta criada. Consulte o email e confirme a ligação para entrar no FARPHA." : "Conta criada. A preparar o seu espaço FARPHA vazio…");
  }

  async function reset() {
    setEmailTouched(true);
    setFormError("");
    if (!isValidEmail(email)) {
      setFormError("Introduza um email válido para recuperar o acesso.");
      return;
    }
    setBusy(true);
    if (await requestReset(email.trim())) setNotice("Se existir uma conta, receberá uma ligação segura para alterar a palavra-passe.");
    setBusy(false);
  }

  async function social(provider: "google" | "azure") {
    setNotice("");
    setFormError("");
    setBusy(true);
    await signInSocial(provider);
    setBusy(false);
  }

  function demo() {
    localStorage.setItem(LOCAL_ACCESS_KEY, LOCAL_ACCESS_VERSION);
    window.location.assign("/");
  }

  const socialButtons = <div className="grid gap-2">
    {google && <SocialButton provider="google" state={socialProviders.google} busy={busy} onClick={() => void social("google")}/>}
    {microsoft && <SocialButton provider="azure" state={socialProviders.azure} busy={busy} onClick={() => void social("azure")}/>}
    {[socialProviders.google, socialProviders.azure].some((state) => state === "not_enabled" || state === "unreachable") && <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900"><p>Um método externo ainda não está disponível. Pode entrar por email ou pedir ao administrador para concluir a configuração.</p><button type="button" onClick={() => void refreshSocialProviders()} className="mt-1 font-black underline decoration-amber-500 underline-offset-2">Verificar novamente</button></div>}
  </div>;

  return <main className="grid min-h-dvh bg-[#f7f5ed] text-[#142a1c] lg:h-dvh lg:grid-cols-[minmax(0,.96fr)_minmax(500px,1.04fr)] lg:overflow-hidden">
    <section className="relative hidden h-dvh overflow-hidden text-white lg:flex lg:flex-col lg:justify-between" aria-label="Apresentação FARPHA">
      <img src={heroImage} alt="Exploração agrícola gerida com tecnologia FARPHA" className="absolute inset-0 h-full w-full object-cover"/>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,16,8,.25),rgba(3,16,8,.88)),linear-gradient(90deg,rgba(3,16,8,.64),transparent)]"/>
      <div className="relative p-8 xl:p-10"><span className="inline-flex rounded-xl bg-white px-3 py-2"><FarphaLogo eager className="h-11"/></span></div>
      <div className="relative max-w-2xl p-8 xl:p-14"><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#c8ef43] backdrop-blur"><Sparkles size={15}/>Comece com uma exploração vazia</span><h1 className="mt-6 font-serif text-5xl leading-[.98] tracking-[-.05em] text-white xl:text-6xl">A sua operação começa no mapa.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-white/70">Crie o seu espaço, configure a primeira exploração e deixe a Inteligência FARPHA orientar os próximos passos.</p><div className="mt-8 grid gap-3 text-sm font-bold text-white/75">{["Dados separados por utilizador com RLS", "Onboarding guiado sem dados fictícios", "Acesso em computador, tablet e telemóvel"].map((item) => <p key={item} className="flex items-center gap-2"><Check className="text-[#c8ef43]" size={17}/>{item}</p>)}</div></div>
      <p className="relative p-8 text-xs text-white/40 xl:p-10">FARPHA · Intelligence for Agriculture</p>
    </section>

    <section className="min-h-dvh overflow-y-auto pb-28 sm:pb-10 lg:h-dvh lg:min-h-0 lg:px-10 lg:py-8">
      <div className="relative h-24 overflow-hidden lg:hidden"><img src={heroImage} alt="" className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-r from-[#0b2b1d]/75 to-transparent"/><span className="absolute bottom-3 left-4 inline-flex rounded-xl bg-white px-2.5 py-2"><FarphaLogo eager className="h-9"/></span></div>
      <div className="mx-auto flex min-h-full w-full max-w-[510px] flex-col justify-center px-4 py-4 sm:px-8 lg:px-0 lg:py-2">
        <button onClick={onBack} className="mb-4 inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-3 font-bold text-[#315d3c] hover:bg-white" aria-label="Voltar ao site"><ArrowLeft size={17}/>Voltar ao site</button>
        <div className="rounded-[28px] border border-[#173c2a]/10 bg-white p-5 shadow-[0_30px_90px_rgba(15,49,29,.12)] sm:p-7 xl:p-8">
          <div className="grid grid-cols-2 rounded-xl bg-[#edf1e9] p-1" role="tablist" aria-label="Acesso FARPHA"><button type="button" role="tab" aria-selected={view === "login"} onClick={() => changeView("login")} className={`min-h-11 rounded-lg text-sm font-black ${view === "login" ? "bg-white text-[#173c2a] shadow-sm" : "text-[#718078]"}`}>Entrar</button><button type="button" role="tab" aria-selected={view === "signup"} onClick={() => changeView("signup")} className={`min-h-11 rounded-lg text-sm font-black ${view === "signup" ? "bg-white text-[#173c2a] shadow-sm" : "text-[#718078]"}`}>Criar conta</button></div>

          {mode === "local" ? <div className="mt-7"><h2 className="text-2xl font-black">Explorar neste dispositivo</h2><p className="mt-2 text-sm leading-6 text-[#657168]">A autenticação Supabase está desativada. Utilize a demonstração local sem cadastro real.</p><Button onClick={demo} size="lg" className="mt-6 w-full">Entrar na demonstração <ArrowRight size={18}/></Button></div> : view === "login" ? <>
            <div className="mt-6"><p className="text-xs font-black uppercase tracking-[.18em] text-[#568020]">Bem-vindo de volta</p><h2 className="mt-2 font-serif text-4xl tracking-tight">Entre na sua conta</h2><p className="mt-2 text-sm text-[#657168]">Continue exatamente de onde parou.</p></div>
            {(google || microsoft) && <div className="mt-5">{socialButtons}<Divider/></div>}
            <form onSubmit={login} onInput={() => setFormError("")} className="mt-4 space-y-4" noValidate>
              <Input label="Email" type="email" inputMode="email" autoComplete="email" required value={email} onChange={(event) => { setEmail(event.target.value); setNotice(""); }} onBlur={() => setEmailTouched(true)} error={emailError} leadingIcon={<Mail size={17}/>} placeholder="nome@empresa.pt"/>
              <Password value={password} setValue={setPassword} visible={showPassword} setVisible={setShowPassword} caps={capsLock} detectCaps={detectCaps} autoComplete="current-password"/>
              <div className="flex flex-wrap items-start justify-between gap-3"><Checkbox checked={remember} onChange={(event) => setRemember(event.target.checked)} label="Lembrar-me"/><button type="button" onClick={() => void reset()} className="text-sm font-bold text-[#315d3c] hover:underline">Recuperar acesso</button></div>
              {formError && <FormMessage tone="danger">{formError}</FormMessage>}{error && <FormMessage tone="danger">{normalizeAuthError(error)}</FormMessage>}{notice && <FormMessage tone="success">{notice}</FormMessage>}
              <Button type="submit" size="lg" loading={busy} className="w-full">Entrar no FARPHA <ArrowRight size={18}/></Button>
            </form>
            <p className="mt-5 text-center text-sm text-[#657168]">Ainda não tem conta? <button type="button" onClick={() => changeView("signup")} className="font-black text-[#315d3c] hover:underline">Começar gratuitamente</button></p>
          </> : <>
            <div className="mt-6 flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.18em] text-[#568020]">Configuração {step} de 2</p><h2 className="mt-2 font-serif text-4xl leading-tight tracking-tight">{step === 1 ? "Crie o seu espaço FARPHA" : "Proteja a sua conta"}</h2></div><span className="shrink-0 text-sm font-black text-[#6d7b71]">{step}/2</span></div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#edf1e9]"><div className="h-full rounded-full bg-[#85b629] transition-all" style={{ width: step === 1 ? "50%" : "100%" }}/></div>
            {selectedPlan && <p className="mt-3 inline-flex rounded-full bg-[#edf5df] px-3 py-1.5 text-xs font-black text-[#477627]">Plano selecionado: {selectedPlan}</p>}
            {step === 1 && (google || microsoft) && <div className="mt-5">{socialButtons}<Divider/></div>}
            <form onSubmit={register} onInput={() => setFormError("")} className="mt-4 space-y-4" noValidate>
              {step === 1 ? <><Input label="Nome completo" autoComplete="name" required value={fullName} onChange={(event) => setFullName(event.target.value)} leadingIcon={<UserRound size={17}/>} placeholder="Como devemos tratá-lo?"/><Input label="Email profissional" type="email" inputMode="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} onBlur={() => setEmailTouched(true)} error={emailError} leadingIcon={<Mail size={17}/>} placeholder="nome@empresa.pt"/><label className="block text-sm font-bold text-[#304337]">O seu perfil agrícola<select value={operationType} onChange={(event) => setOperationType(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#ced8d0] bg-white px-3"><option value="producer">Produtor ou proprietário</option><option value="manager">Gestor de exploração</option><option value="technician">Técnico ou agrónomo</option><option value="cooperative">Cooperativa ou organização</option><option value="service">Prestador de serviços agrícolas</option></select></label></> : <><Password value={password} setValue={setPassword} visible={showPassword} setVisible={setShowPassword} caps={capsLock} detectCaps={detectCaps} autoComplete="new-password"/><div className="grid grid-cols-2 gap-2 text-[11px]">{[[password.length >= 10, "10 caracteres"], [/[A-Z]/.test(password), "Uma maiúscula"], [/[a-z]/.test(password), "Uma minúscula"], [/\d/.test(password), "Um número"]].map(([valid, label]) => <span key={String(label)} className={`flex items-center gap-1.5 ${valid ? "text-emerald-700" : "text-[#879289]"}`}><Check size={13}/>{String(label)}</span>)}</div><Checkbox checked={terms} onChange={(event) => setTerms(event.target.checked)} label="Aceito os Termos de Utilização e a Política de Privacidade" hint="Pode consultar e gerir os seus dados a qualquer momento."/></>}
              {formError && <FormMessage tone="danger">{formError}</FormMessage>}{error && <FormMessage tone="danger">{normalizeAuthError(error)}</FormMessage>}{notice && <FormMessage tone="success">{notice}</FormMessage>}
              <div className="flex gap-2">{step === 2 && <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)}>Voltar</Button>}<Button type="submit" size="lg" loading={busy} className="flex-1">{step === 1 ? "Continuar" : "Criar conta"}<ArrowRight size={18}/></Button></div>
            </form>
            <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#657168]"><ShieldCheck className="mt-0.5 shrink-0 text-[#477627]" size={15}/>O FARPHA não cria dados agrícolas automaticamente. O seu espaço começa vazio e protegido.</p>
          </>}
        </div>
        <a href={`mailto:${supportConfig.email}?subject=Ajuda%20no%20acesso%20FARPHA`} className="mx-auto mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold text-[#315d3c] hover:bg-white"><HelpCircle size={17}/>Precisa de ajuda para entrar?</a>
      </div>
    </section>
  </main>;
}

function Divider() { return <div className="my-4 flex items-center gap-3 text-xs text-[#879289]"><span className="h-px flex-1 bg-[#dce3dc]"/><span>ou continue com email</span><span className="h-px flex-1 bg-[#dce3dc]"/></div>; }

function SocialButton({ provider, state, busy, onClick }: { provider: "google" | "azure"; state: "disabled" | "checking" | "ready" | "not_enabled" | "unreachable"; busy: boolean; onClick: () => void }) {
  const microsoft = provider === "azure";
  const providerName = microsoft ? "Microsoft" : "Google";
  const disabled = busy || state !== "ready";
  const label = state === "checking" ? `A verificar ${providerName}…` : state === "ready" ? `Continuar com ${providerName}` : `${providerName} indisponível`;
  return <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className="flex min-h-12 items-center justify-center gap-3 rounded-xl border border-[#173c2a]/15 bg-white px-4 font-black text-[#173c2a] transition hover:bg-[#f4f7f1] disabled:cursor-not-allowed disabled:bg-[#f7f8f5] disabled:text-[#7b867e] disabled:opacity-80">{microsoft ? <span aria-hidden="true" className="grid grid-cols-2 gap-px">{["#f25022", "#7fba00", "#00a4ef", "#ffb900"].map((color) => <i key={color} className="h-2 w-2" style={{ background: color }}/>)}</span> : <span aria-hidden="true" className="text-lg font-black text-blue-600">G</span>}{label}</button>;
}

function Password({ value, setValue, visible, setVisible, caps, detectCaps, autoComplete }: { value: string; setValue: (value: string) => void; visible: boolean; setVisible: (value: boolean) => void; caps: boolean; detectCaps: (event: KeyboardEvent<HTMLInputElement>) => void; autoComplete: string }) {
  return <Input label="Palavra-passe" type={visible ? "text" : "password"} autoComplete={autoComplete} required value={value} onChange={(event) => setValue(event.target.value)} onKeyUp={detectCaps} onKeyDown={detectCaps} leadingIcon={<LockKeyhole size={17}/>} hint={caps ? "Caps Lock está ativo." : undefined} trailingAction={<button type="button" className="farpha-touch-target grid place-items-center rounded-lg text-[#657168]" onClick={() => setVisible(!visible)} aria-label={visible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"} aria-pressed={visible}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button>}/>;
}
