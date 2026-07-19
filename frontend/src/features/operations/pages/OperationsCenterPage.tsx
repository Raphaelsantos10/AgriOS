import { Activity, AlertTriangle, ClipboardCheck, RadioTower, Satellite, ShieldCheck } from "lucide-react";
import FarmHealthCard from "../components/FarmHealthCard";
import OperationsTimeline from "../components/OperationsTimeline";
import UnifiedAlertsPanel from "../components/UnifiedAlertsPanel";
import { useOperationsCenter } from "../hooks/useOperationsCenter";

export default function OperationsCenterPage() {
  const operations = useOperationsCenter();
  const kpis = [
    { label: "Alertas críticos", value: operations.criticalCount, detail: "Requerem decisão", icon: AlertTriangle },
    { label: "Ordens ativas", value: operations.activeOrders, detail: "Planeadas ou em curso", icon: ClipboardCheck },
    { label: "Satélite", value: "Online", detail: "Última leitura processada", icon: Satellite },
    { label: "Sensores", value: "121/123", detail: "98,4% conectados", icon: RadioTower },
    { label: "Farm Health", value: `${operations.health.total}/100`, detail: "Score operacional", icon: ShieldCheck },
  ];

  return (
    <section className="-m-4 min-h-full space-y-5 bg-[radial-gradient(circle_at_top_right,rgba(156,223,40,0.08),transparent_26%),#061014] p-4 text-white md:-m-6 md:p-6 xl:-m-7 xl:p-7">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9cdf28]">Sprint 23 · Integração de módulos</p><h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-white md:text-4xl">Centro de Operações Inteligente</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#9daaa4]">Alertas, satélite, sensores, ordens de trabalho e score da exploração reunidos numa única visão operacional.</p></div>
        <div className="flex items-center gap-2 rounded-xl border border-[#9cdf28]/20 bg-[#9cdf28]/8 px-4 py-2.5 text-sm font-bold text-[#badf8c]"><Activity size={17}/>Atualização em tempo real</div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{kpis.map(({label,value,detail,icon:Icon})=><article key={label} className="rounded-2xl border border-white/10 bg-[#0b171a] p-4"><div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl border border-[#9cdf28]/20 bg-[#9cdf28]/10 text-[#9cdf28]"><Icon size={19}/></span><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7f8d86]">{label}</p><p className="mt-1 text-xl font-black text-white">{value}</p><p className="mt-1 text-xs text-[#84928b]">{detail}</p></div></div></article>)}</div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]"><UnifiedAlertsPanel alerts={operations.alerts}/><OperationsTimeline events={operations.timeline}/></div>
      <FarmHealthCard health={operations.health}/>
    </section>
  );
}
