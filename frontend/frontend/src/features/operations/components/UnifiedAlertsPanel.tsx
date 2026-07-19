import { AlertTriangle, BellRing, CheckCircle2, Info, Satellite, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import type { UnifiedAlert } from "../../../core/alerts";

const severityConfig = {
  critical: { icon: ShieldAlert, label: "Crítico", className: "border-red-500/20 bg-red-500/8 text-red-300" },
  warning: { icon: AlertTriangle, label: "Atenção", className: "border-amber-500/20 bg-amber-500/8 text-amber-300" },
  info: { icon: Info, label: "Informação", className: "border-sky-500/20 bg-sky-500/8 text-sky-300" },
  success: { icon: CheckCircle2, label: "Resolvido", className: "border-emerald-500/20 bg-emerald-500/8 text-emerald-300" },
};

export default function UnifiedAlertsPanel({ alerts, limit = 5 }: { alerts: UnifiedAlert[]; limit?: number }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#0b171a] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9cdf28]">Motor unificado</p>
          <h2 className="mt-1 text-lg font-extrabold text-white">Alertas operacionais</h2>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-[#b8c4be]"><BellRing size={14}/>{alerts.length} ativos</span>
      </div>
      <div className="mt-4 space-y-2">
        {alerts.slice(0, limit).map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = alert.source === "satellite" ? Satellite : config.icon;
          const content = (
            <div className="group flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 transition hover:border-[#9cdf28]/25 hover:bg-white/[0.055]">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${config.className}`}><Icon size={18}/></span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2"><span className="text-sm font-bold text-white">{alert.title}</span><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${config.className}`}>{config.label}</span></span>
                <span className="mt-1 block text-xs leading-5 text-[#93a099]">{alert.description}</span>
                {(alert.farm || alert.field) && <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wide text-[#708078]">{[alert.farm, alert.field].filter(Boolean).join(" · ")}</span>}
              </span>
              {alert.actionLabel && <span className="mt-1 text-xs font-bold text-[#9cdf28] opacity-80 transition group-hover:opacity-100">{alert.actionLabel} →</span>}
            </div>
          );
          return alert.actionPath ? <Link key={alert.id} to={alert.actionPath}>{content}</Link> : <div key={alert.id}>{content}</div>;
        })}
      </div>
    </section>
  );
}
