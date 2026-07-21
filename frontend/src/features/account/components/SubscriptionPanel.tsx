import { useCallback, useEffect, useState } from "react";
import { Check, CreditCard, ExternalLink, LoaderCircle, ShieldCheck } from "lucide-react";
import Button from "../../../design-system/components/Button";
import Card from "../../../design-system/components/Card";
import { supabase } from "../../../services/supabase";

type Plan = "free" | "plus" | "pro";
type Subscription = { plan: Plan | "unknown"; status: string; current_period_end: string | null; cancel_at_period_end: boolean };
const plans: { id: Plan; name: string; description: string; features: string[] }[] = [
  { id: "free", name: "Free - €0", description: "Para conhecer e iniciar a gestão digital.", features: ["1 exploração e até 3 talhões", "Dashboard, mapa e clima", "Registos locais básicos"] },
  { id: "plus", name: "Plus - €19,90/mês", description: "30 dias grátis; depois cobrança mensal.", features: ["Até 5 explorações", "Operações, custos e inventário", "Alertas, relatórios e exportações"] },
  { id: "pro", name: "Pro - €49,90/mês", description: "30 dias grátis e acesso completo.", features: ["Explorações e utilizadores sem limite do plano", "Inteligência, automações e GIS avançado", "Conformidade, auditoria e toda a plataforma"] },
];

export default function SubscriptionPanel({ enabled }: { enabled: boolean }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const load = useCallback(async () => { if (!enabled) return; const result = await supabase.from("subscriptions").select("plan,status,current_period_end,cancel_at_period_end").order("updated_at", { ascending: false }).limit(1).maybeSingle(); setLoading(false); if (result.error) setMessage("A estrutura de subscricoes ainda nao foi publicada no Supabase."); else setSubscription(result.data as Subscription | null); }, [enabled]);
  useEffect(() => { queueMicrotask(() => void load()); }, [load]);
  async function invoke(name: string, body?: object) { setBusy(name); setMessage(""); const result = await supabase.functions.invoke(name, { body }); setBusy(""); if (result.error || !result.data?.url) { setMessage(result.data?.error || result.error?.message || "Servico de pagamentos indisponivel."); return; } window.location.assign(result.data.url); }
  const active = Boolean(subscription && ["active", "trialing"].includes(subscription.status));
  return <Card id="subscricao" className="scroll-mt-24 overflow-hidden"><div className="bg-gradient-to-r from-[#123524] to-[#276545] p-6 text-white"><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Plano e subscricao</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-3xl font-black text-white">{active ? `FARPHA ${plans.find((p) => p.id === subscription?.plan)?.name || subscription?.plan}` : "Escolha o plano FARPHA"}</h2><p className="mt-1 text-sm text-emerald-100/75">Pagamento seguro processado na pagina hospedada pelo Stripe.</p></div><span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black">{loading ? "A verificar" : active ? subscription?.status : "Sem subscricao ativa"}</span></div></div>
    <div className="p-5">{message && <p role="status" className="mb-5 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-950">{message}</p>}{active && <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><div><p className="font-black text-emerald-950">Subscricao ativa</p><p className="text-sm text-emerald-800">{subscription?.current_period_end ? `${subscription.cancel_at_period_end ? "Termina" : "Renova"} em ${new Date(subscription.current_period_end).toLocaleDateString("pt-PT")}` : "Estado confirmado pelo Stripe"}</p></div><Button onClick={() => void invoke("create-customer-portal")} disabled={Boolean(busy)}>{busy === "create-customer-portal" ? <LoaderCircle className="animate-spin" size={17}/> : <ExternalLink size={17}/>}Gerir no Stripe</Button></div>}
      <div className="grid gap-4 lg:grid-cols-3">{plans.map((plan) => <article key={plan.id} className={`flex flex-col rounded-2xl border p-5 ${subscription?.plan === plan.id && active ? "border-emerald-500 bg-emerald-50/50" : "border-[var(--farpha-border)]"}`}><h3 className="text-xl font-black">{plan.name}</h3><p className="mt-2 text-sm text-[var(--farpha-text-muted)]">{plan.description}</p><p className="mt-4 text-sm font-black">{plan.id === "free" ? "Sem cartão e sem prazo" : "Cartão necessário · cancele quando quiser"}</p><ul className="mt-4 flex-1 space-y-2">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm"><Check size={16} className="mt-0.5 shrink-0 text-emerald-700"/>{feature}</li>)}</ul><Button className="mt-5" onClick={() => plan.id === "free" ? setMessage("O plano Free será atribuído automaticamente na criação da conta.") : void invoke("create-checkout-session", { plan: plan.id })} disabled={!enabled || Boolean(busy) || (active && subscription?.plan === plan.id)}>{busy === "create-checkout-session" ? <LoaderCircle className="animate-spin" size={17}/> : <CreditCard size={17}/>} {active && subscription?.plan === plan.id ? "Plano atual" : plan.id === "free" ? "Incluído ao criar conta" : "Testar 30 dias"}</Button></article>)}</div>
      <p className="mt-5 flex items-start gap-2 rounded-xl bg-slate-100 p-4 text-xs text-slate-600"><ShieldCheck className="shrink-0 text-emerald-700" size={18}/>O FARPHA nao recebe nem guarda numeros de cartao. O acesso somente muda depois da confirmacao assinada enviada pelo Stripe ao backend.</p>
    </div></Card>;
}
