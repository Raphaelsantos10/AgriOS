import { AlertTriangle, CheckCircle2, CircleDashed, XCircle } from "lucide-react";

import type { DiagnosticReport } from "../types/diagnostics";

type Props = {
  report: DiagnosticReport;
};

export default function DiagnosticSummary({ report }: Props) {
  const counts = {
    operational: report.items.filter((item) => item.status === "operational").length,
    warning: report.items.filter((item) => item.status === "warning").length,
    error: report.items.filter((item) => item.status === "error").length,
    pending: report.items.filter((item) => item.status === "pending").length,
  };

  const cards = [
    { label: "Operacionais", value: counts.operational, icon: CheckCircle2, className: "text-emerald-400" },
    { label: "Atenção", value: counts.warning, icon: AlertTriangle, className: "text-amber-400" },
    { label: "Erros", value: counts.error, icon: XCircle, className: "text-red-400" },
    { label: "Pendentes", value: counts.pending, icon: CircleDashed, className: "text-white/40" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, className }) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-[#0b171a] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#83928b]">{label}</p>
            <Icon className={className} size={20} />
          </div>
          <p className="mt-3 text-3xl font-black text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}
