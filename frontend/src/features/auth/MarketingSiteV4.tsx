import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  ArrowRight, Check, CloudSun, Coins, Droplets, Flame,
  Gauge, MapPinned, Menu, MessageCircle, ShieldCheck,
  Sparkles, Sprout, Target, Timer, TrendingUp, X,
} from "lucide-react";
import FarphaLogo from "../../components/brand/FarphaLogo";
import heroImage from "../../assets/marketing/farpha-agriculture-hero-v2.webp";
import PwaStatus from "../pwa/components/PwaStatus";
import { supportConfig } from "../support/supportConfig";
import {
  animatedResult, clampProgress, journeyStages, publicNavigation,
  type FarphaPlan, type JourneyStage,
} from "./utils/marketingExperience";

type Props = { onEnter: () => void; onStart: (plan?: FarphaPlan) => void };
type Icon = ComponentType<{ size?: number; className?: string }>;

const solutions: Array<{ icon: Icon; title: string; text: string; href: string }> = [
  { icon: MapPinned, title: "Exploração e GIS", text: "Talhões, culturas, camadas e decisões ligadas ao território.", href: "#mapa" },
  { icon: CloudSun, title: "Clima e risco", text: "Previsão, água, incêndio e ambiente no contexto de cada área.", href: "#mapa" },
  { icon: Target, title: "Operação coordenada", text: "Prioridades, missões e responsáveis num fluxo verificável.", href: "#jornada" },
  { icon: Coins, title: "Custos e conformidade", text: "Resultados, documentos e obrigações organizados num só lugar.", href: "#resultados" },
];

const layers = [
  { id: "weather", label: "Clima", icon: CloudSun, value: "24 °C · chuva 18%", text: "Janela favorável até às 16:00", color: "#55c9ff" },
  { id: "fire", label: "Incêndio", icon: Flame, value: "Risco baixo", text: "Fonte oficial e contexto do talhão", color: "#ff8a3d" },
  { id: "health", label: "Saúde", icon: Sprout, value: "Índice 82/100", text: "Sem anomalias críticas detetadas", color: "#b8e62e" },
  { id: "water", label: "Rega", icon: Droplets, value: "61% humidade", text: "Rega recomendada amanhã às 06:00", color: "#5da8ff" },
  { id: "yield", label: "Produtividade", icon: TrendingUp, value: "+12% estimado", text: "Comparação com a campanha anterior", color: "#d7b44a" },
] as const;

const plans: Array<{ name: FarphaPlan; price: string; items: string[]; featured?: boolean }> = [
  { name: "Free", price: "€0", items: ["Mapa e primeira exploração", "Talhões essenciais", "Aplicação responsiva"] },
  { name: "Plus", price: "€19,90", items: ["Operações e alertas", "Custos e relatórios", "30 dias de teste"], featured: true },
  { name: "Pro", price: "€49,90", items: ["Inteligência e precisão", "Automação e conformidade", "Toda a plataforma"] },
];

function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      const node = ref.current;
      if (!node) return;
      if (reduced) { setProgress(1); return; }
      const rect = node.getBoundingClientRect();
      setProgress(clampProgress((window.innerHeight * 0.82 - rect.top) / (window.innerHeight * 0.72)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return { ref, progress };
}

export default function MarketingSiteV4({ onEnter, onStart }: Props) {
  const [menu, setMenu] = useState(false);
  const [stage, setStage] = useState<JourneyStage>(journeyStages[0]);
  const [layer, setLayer] = useState<(typeof layers)[number]>(layers[0]);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = previous; };
  }, []);

  return <main className="min-h-dvh scroll-smooth overflow-x-hidden bg-[#f5f3eb] text-[#123022] [scroll-padding-top:7rem] selection:bg-[#b8e62e]">
    <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-5 focus:py-3">Saltar para o conteúdo</a>
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between rounded-2xl border border-white/60 bg-[#fbfaf5]/85 px-4 shadow-[0_16px_60px_rgba(14,45,28,.10)] backdrop-blur-2xl">
        <a href="#inicio" aria-label="FARPHA — página inicial"><FarphaLogo eager className="h-10"/></a>
        <nav className="hidden items-center gap-6 text-xs font-black text-[#5d6c62] xl:flex" aria-label="Navegação principal">
          {publicNavigation.map((item) => <a key={item.href} href={item.href} className="rounded-lg px-1 py-3 transition hover:text-[#173c2a] focus-visible:outline-2 focus-visible:outline-[#568020]">{item.label}</a>)}
        </nav>
        <div className="hidden items-center gap-2 lg:flex"><PwaStatus/><button onClick={onEnter} className="min-h-11 rounded-xl px-4 text-sm font-black">Entrar</button><button onClick={() => onStart()} className="min-h-11 rounded-xl bg-[#173c2a] px-5 text-sm font-black text-white">Experimentar</button></div>
        <button type="button" onClick={() => setMenu((value) => !value)} className="grid h-11 w-11 place-items-center rounded-xl border border-[#173c2a]/10 lg:hidden" aria-expanded={menu} aria-label={menu ? "Fechar menu" : "Abrir menu"}>{menu ? <X/> : <Menu/>}</button>
      </div>
      {menu && <nav className="mx-auto mt-2 max-w-[1320px] rounded-2xl border border-[#173c2a]/10 bg-white p-4 shadow-2xl lg:hidden" aria-label="Navegação móvel">
        {publicNavigation.map((item) => <a key={item.href} href={item.href} onClick={() => setMenu(false)} className="block min-h-11 rounded-xl px-4 py-3 font-bold hover:bg-[#eef4e6]">{item.label}</a>)}
        <div className="mt-3 grid gap-2"><PwaStatus/><button onClick={onEnter} className="min-h-12 rounded-xl border font-black">Entrar</button><button onClick={() => onStart()} className="min-h-12 rounded-xl bg-[#b8e62e] font-black">Criar conta</button></div>
      </nav>}
    </header>

    <div id="conteudo">
      <section id="inicio" className="relative flex min-h-[900px] items-end overflow-hidden bg-[#07150d] px-5 pb-20 pt-36 text-white lg:min-h-dvh lg:pb-16">
        <img src={heroImage} alt="Paisagem agrícola portuguesa acompanhada pelo FARPHA" className="absolute inset-0 h-full w-full scale-[1.03] object-cover motion-safe:animate-[pulse_14s_ease-in-out_infinite]"/>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,246,238,.96)_0%,rgba(248,246,238,.84)_38%,rgba(7,21,13,.18)_70%),linear-gradient(0deg,rgba(7,21,13,.72),transparent_58%)]"/>
        <div className="relative mx-auto w-full max-w-[1320px] pb-4 text-[#123022]">
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#658c24]">Intelligence for Agriculture</p>
          <h1 className="mt-6 max-w-[800px] font-serif text-5xl leading-[.95] tracking-[-.055em] sm:text-7xl lg:text-[92px]">A sua exploração.<br/><span className="text-[#6aa52a]">Inteligente, conectada e previsível.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#4f6155]">Transforme mapas, clima, operações e custos em decisões claras — sem perder o controlo.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><button onClick={() => onStart()} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#aede2d] px-7 font-black shadow-xl transition hover:-translate-y-0.5">Experimentar gratuitamente <ArrowRight size={19}/></button><a href="#mapa" className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-[#173c2a]/20 bg-white/60 px-7 font-black backdrop-blur">Ver como funciona</a></div>
          <div className="mt-12 ml-auto max-w-md rounded-3xl border border-white/15 bg-[#09251a]/92 p-5 text-white shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between"><p className="text-sm font-black">Insight da exploração</p><span className="text-xs text-white/45">Hoje, 07:45</span></div>
            <div className="mt-5 grid grid-cols-2 gap-4"><div><p className="text-3xl font-black text-white">18 °C</p><p className="mt-1 text-xs text-white/50">Céu limpo · vento NE</p></div><div><p className="text-xs text-white/50">Risco de doença</p><p className="mt-1 text-xl font-black text-[#d7b44a]">Médio</p></div></div>
            <a href="#mapa" className="mt-5 flex min-h-11 items-center justify-between border-t border-white/10 pt-4 text-xs font-black text-[#b8e62e]">Ver contexto no mapa <ArrowRight size={16}/></a>
          </div>
        </div>
      </section>

      <section id="solucoes" className="scroll-mt-28 px-5 py-20 lg:py-24"><div className="mx-auto max-w-[1320px]">
        <SectionTitle eyebrow="Uma operação conectada" title="Menos ruído. Mais contexto para decidir." text="Cada solução conduz a uma área real da experiência FARPHA."/>
        <div className="mt-12 grid gap-px overflow-hidden rounded-[32px] border border-[#173c2a]/10 bg-[#173c2a]/10 md:grid-cols-2 lg:grid-cols-4">{solutions.map(({ icon: Icon, title, text, href }) => <a key={title} href={href} className="group flex min-h-64 flex-col bg-[#fbfaf5] p-7 transition hover:bg-white focus-visible:outline-4 focus-visible:outline-[#8ebd2b]"><Icon className="text-[#568020]" size={25}/><h3 className="mt-auto font-serif text-3xl leading-tight">{title}</h3><p className="mt-3 text-sm leading-6 text-[#68756c]">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#477627]">Descobrir <ArrowRight className="transition group-hover:translate-x-1" size={16}/></span></a>)}</div>
      </div></section>

      <MapStory active={layer} onChange={setLayer}/>
      <Journey active={stage} onChange={setStage}/>
      <Results/>

      <section id="planos" className="scroll-mt-28 px-5 py-20 lg:py-24"><div className="mx-auto max-w-[1080px]"><SectionTitle centered eyebrow="Planos FARPHA" title="Comece com o necessário. Evolua sem trocar de plataforma." text="Os valores são transparentes e a escolha fica guardada durante o cadastro."/>
        <div className="mt-12 grid gap-5 md:grid-cols-3">{plans.map((plan) => <article key={plan.name} className={`relative flex flex-col rounded-[30px] border p-7 ${plan.featured ? "border-[#173c2a] bg-[#173c2a] text-white shadow-2xl" : "border-[#173c2a]/10 bg-white"}`}>{plan.featured && <span className="absolute right-5 top-5 rounded-full bg-[#b8e62e] px-3 py-1 text-[10px] font-black text-[#173c2a]">POPULAR</span>}<p className="font-black text-[#83aa30]">{plan.name}</p><p className="mt-4 font-serif text-5xl">{plan.price}<span className="text-sm opacity-45">{plan.price !== "€0" ? "/mês" : ""}</span></p><ul className="mt-8 flex-1 space-y-4">{plan.items.map((item) => <li key={item} className="flex gap-2 text-sm font-bold"><Check size={17} className="shrink-0 text-[#91bd24]"/>{item}</li>)}</ul><button onClick={() => onStart(plan.name)} className={`mt-8 min-h-12 rounded-xl font-black ${plan.featured ? "bg-[#b8e62e] text-[#173c2a]" : "border border-[#173c2a]/15"}`}>Escolher {plan.name}</button></article>)}</div>
      </div></section>

      <section id="contactos" className="scroll-mt-28 px-5 pb-20"><div className="mx-auto grid max-w-[1320px] gap-10 rounded-[38px] bg-[#e5eadc] p-7 lg:grid-cols-[.85fr_1.15fr] lg:p-12"><SectionTitle eyebrow="Apoio próximo" title="Tecnologia quando quiser. Pessoas quando precisar." text="Fale com a equipa FARPHA pelo canal que for mais conveniente para si."/><div className="grid gap-3 sm:grid-cols-3"><a href={`https://wa.me/${supportConfig.whatsapp}`} target="_blank" rel="noreferrer" className="flex min-h-40 flex-col rounded-3xl bg-[#173c2a] p-6 text-white"><MessageCircle/><strong className="mt-auto text-xl">WhatsApp</strong><span className="mt-2 text-xs text-white/50">Abrir conversa</span></a><a href={`mailto:${supportConfig.email}`} className="flex min-h-40 flex-col rounded-3xl bg-white p-6"><Sparkles className="text-[#568020]"/><strong className="mt-auto text-xl">Email</strong><span className="mt-2 break-all text-xs text-[#657168]">{supportConfig.email}</span></a><a href={`tel:${supportConfig.phoneHref}`} className="flex min-h-40 flex-col rounded-3xl border border-[#173c2a]/10 bg-[#f7f6f0] p-6"><ShieldCheck className="text-[#568020]"/><strong className="mt-auto text-xl">Telefone</strong><span className="mt-2 text-xs text-[#657168]">{supportConfig.phone}</span></a></div></div></section>

      <section className="bg-[#0b281c] px-5 py-14 text-white"><div className="mx-auto max-w-[1320px]"><div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-center"><FarphaLogo inverse prominent className="h-20"/><div><h2 className="font-serif text-4xl text-white lg:text-5xl">Pronto para conhecer melhor a sua exploração?</h2><div className="mt-7 flex flex-col gap-3 sm:flex-row"><button onClick={() => onStart()} className="min-h-14 rounded-xl bg-[#b8e62e] px-7 font-black text-[#173c2a]">Começar gratuitamente</button><a href="#planos" className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/20 px-7 font-black">Ver planos</a><a href="#contactos" className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/20 px-7 font-black">Falar connosco</a></div></div></div><div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:justify-between"><p>FARPHA · Intelligence for Agriculture</p><button onClick={onEnter} className="w-fit font-black text-[#b8e62e]">Entrar na plataforma →</button></div></div></section>
    </div>
  </main>;
}

function MapStory({ active, onChange }: { active: (typeof layers)[number]; onChange: (layer: (typeof layers)[number]) => void }) {
  return <section id="mapa" className="scroll-mt-28 px-5 py-20"><div className="mx-auto max-w-[1320px] overflow-hidden rounded-[40px] border border-[#173c2a]/10 bg-[#fbfaf5]"><div className="grid lg:grid-cols-[.68fr_1.32fr]">
    <div className="p-7 lg:p-11"><p className="text-xs font-black uppercase tracking-[.2em] text-[#568020]">Demonstração visual</p><h2 className="mt-5 font-serif text-5xl leading-[.98]">Tudo começa no mapa.</h2><p className="mt-5 leading-7 text-[#657168]">Escolha uma camada. O mapa e o contexto mudam imediatamente.</p><div className="mt-8 grid gap-2">{layers.map((item) => { const Icon = item.icon; const selected = active.id === item.id; return <button key={item.id} type="button" onClick={() => onChange(item)} aria-pressed={selected} className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-left font-black transition ${selected ? "bg-[#173c2a] text-white" : "border border-[#173c2a]/10 bg-white hover:border-[#6e9a28]"}`}><Icon size={18} style={{ color: selected ? item.color : undefined }}/>{item.label}<ArrowRight className="ml-auto" size={15}/></button>; })}</div></div>
    <div className="relative min-h-[520px] overflow-hidden bg-[radial-gradient(ellipse_at_35%_25%,#67845a_0%,#385c3c_30%,#153522_66%,#0d2417_100%)] p-5 sm:p-8"><div className="absolute inset-0 opacity-20 [background-image:linear-gradient(24deg,transparent_46%,rgba(255,255,255,.24)_47%,transparent_49%),linear-gradient(114deg,transparent_46%,rgba(255,255,255,.16)_47%,transparent_49%)] [background-size:86px_86px]"/><div className="absolute -left-10 top-[58%] h-20 w-[115%] rotate-[-8deg] border-y border-white/20 bg-[#d7c58a]/10"/><div className="absolute left-[17%] top-[18%] h-[48%] w-[58%] -rotate-6 rounded-[42%_58%_51%_49%] border-2 bg-[#b8e62e]/10 shadow-[0_0_40px_rgba(184,230,46,.08)] transition-colors duration-500" style={{ borderColor: active.color }}/><div className="absolute left-[30%] top-[31%] h-[22%] w-[22%] -rotate-6 border border-white/15"/><div aria-live="polite" className="absolute right-5 top-5 w-[min(360px,calc(100%-2.5rem))] rounded-3xl border border-white/10 bg-[#0a2b1e]/95 p-5 text-white shadow-2xl backdrop-blur"><p className="text-xs text-white/45">Talhão Norte · 12,4 ha</p><p className="mt-4 text-3xl font-black text-white">{active.value}</p><p className="mt-2 text-sm text-white/55">{active.text}</p><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full transition-colors" style={{ backgroundColor: active.color }}/></div></div><div className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-xs font-bold text-white backdrop-blur">Camada ativa: {active.label}</div><div className="absolute bottom-5 right-5 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[10px] font-bold text-white/65 backdrop-blur">41.502° N · 7.643° W</div></div>
  </div></div></section>;
}

function Journey({ active, onChange }: { active: JourneyStage; onChange: (stage: JourneyStage) => void }) {
  const destinations: Record<JourneyStage["id"], string> = { observe: "#mapa", plan: "#planos", execute: "#resultados", prove: "#resultados" };
  return <section id="jornada" className="scroll-mt-28 bg-[#ebe9df] px-5 py-20 lg:py-24"><div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[.72fr_1.28fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#568020]">História guiada</p><h2 className="mt-5 font-serif text-5xl leading-[.98] lg:text-7xl">Observe.<br/>Planeie.<br/>Execute.<br/>Comprove.</h2></div><div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{journeyStages.map((item) => <button key={item.id} type="button" onClick={() => onChange(item)} aria-pressed={active.id === item.id} className={`min-h-20 rounded-2xl border p-3 text-left transition ${active.id === item.id ? "border-[#173c2a] bg-[#173c2a] text-white" : "border-[#173c2a]/10 bg-[#f8f7f2]"}`}><span className="text-[10px] opacity-50">{item.number}</span><strong className="mt-2 block">{item.label}</strong></button>)}</div><div key={active.id} className="mt-4 rounded-[32px] bg-[#fbfaf5] p-7 shadow-sm motion-safe:animate-[fadeIn_.45s_ease-out] sm:p-10"><p className="text-xs font-black uppercase tracking-[.18em] text-[#6c9928]">{active.number} · {active.label}</p><h3 className="mt-5 max-w-2xl font-serif text-4xl">{active.title}</h3><p className="mt-4 max-w-2xl text-lg leading-8 text-[#657168]">{active.text}</p><a href={destinations[active.id]} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#b8e62e] px-5 font-black">{active.action}<ArrowRight size={17}/></a></div></div></div></section>;
}

function Results() {
  const { ref, progress } = useScrollProgress<HTMLElement>();
  const cost = animatedResult(18, progress);
  const productivity = animatedResult(24, progress);
  const hours = animatedResult(8, progress);
  const bars = [42, 50, 46, 58, 54, 66, 73, 82, 88, 78, 72, 85];
  return <section ref={ref} id="resultados" className="scroll-mt-28 overflow-hidden bg-[#f8f3e7] px-5 py-20 lg:py-24"><div className="mx-auto max-w-[1320px]"><div className="flex flex-wrap items-end justify-between gap-5"><SectionTitle eyebrow="Prova de valor" title="Decisões que se tornam resultados."/><p className="max-w-sm rounded-2xl bg-amber-50 p-4 text-xs leading-5 text-amber-900">Cenário ilustrativo para demonstrar a experiência. Resultados reais dependem dos dados de cada exploração.</p></div>
    <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_.85fr]"><div className="rounded-[32px] border border-[#173c2a]/10 bg-white/75 p-7 shadow-xl backdrop-blur"><div className="grid grid-cols-2 gap-6"><div><p className="text-xs font-black">ANTES</p><p className="mt-4 text-2xl">12.540 € / ha</p><p className="mt-2 text-sm text-[#657168]">6,2 t / ha</p></div><div><p className="text-xs font-black">DEPOIS</p><p className="mt-4 text-2xl">10.283 € / ha</p><p className="mt-2 text-sm text-[#657168]">7,7 t / ha</p></div></div><div className="mt-10 flex h-44 items-end gap-2">{bars.map((height, index) => <span key={index} className="flex-1 rounded-t bg-[#9ac832] transition-[height] duration-150" style={{ height: `${Math.max(8, height * progress)}%`, opacity: .35 + progress * .65 }}/>)}</div><div className="mt-2 flex justify-between text-[9px] font-bold text-[#89938c]"><span>JAN</span><span>ABR</span><span>AGO</span><span>DEZ</span></div></div>
      <div className="divide-y divide-[#173c2a]/10">{[[TrendingUp, `-${cost}%`, "Custos operacionais"], [Gauge, `+${productivity}%`, "Produtividade"], [Timer, `${hours} h`, "poupadas por semana"], [ShieldCheck, "1 lugar", "Obrigações organizadas"]].map(([RawIcon, value, label]) => { const Icon = RawIcon as Icon; return <div key={String(label)} className="flex items-center gap-5 py-6"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#eaf0d5]"><Icon/></span><div><p className="font-serif text-5xl">{String(value)}</p><p className="mt-1 text-[#52645a]">{String(label)}</p></div></div>; })}</div></div></div></section>;
}

function SectionTitle({ eyebrow, title, text, centered = false }: { eyebrow: string; title: string; text?: string; centered?: boolean }) {
  return <div className={centered ? "text-center" : ""}><p className="text-xs font-black uppercase tracking-[.2em] text-[#568020]">{eyebrow}</p><h2 className={`mt-5 max-w-4xl font-serif text-5xl leading-[.98] tracking-[-.04em] lg:text-7xl ${centered ? "mx-auto" : ""}`}>{title}</h2>{text && <p className={`mt-6 max-w-3xl text-lg leading-8 text-[#657168] ${centered ? "mx-auto" : ""}`}>{text}</p>}</div>;
}
