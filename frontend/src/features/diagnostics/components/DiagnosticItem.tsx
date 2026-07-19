import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Clock3,
  XCircle,
} from "lucide-react";

import type { DiagnosticItem as DiagnosticItemType } from "../types/diagnostics";

const statusConfig = {
  operational: {
    label: "Operacional",
    icon: CheckCircle2,
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    iconClassName: "text-emerald-400",
  },
  warning: {
    label: "Atenção",
    icon: AlertTriangle,
    className: "border-amber-400/20 bg-amber-400/10 text-amber-100",
    iconClassName: "text-amber-400",
  },
  error: {
    label: "Erro",
    icon: XCircle,
    className: "border-red-400/20 bg-red-400/10 text-red-100",
    iconClassName: "text-red-400",
  },
  pending: {
    label: "Não configurado",
    icon: CircleDashed,
    className: "border-white/10 bg-white/[0.04] text-white/55",
    iconClassName: "text-white/35",
  },
} as const;

type Props = {
  item: DiagnosticItemType;
};

export default function DiagnosticItem({ item }: Props) {
  const config = statusConfig[item.status];
  const Icon = config.icon;

  return (
    <article className="rounded-2xl border border-white/10 bg-[#0b171a] p-4 shadow-[0_14px_38px_rgba(0,0,0,0.16)]">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-white/10 bg-[#071215] p-2.5">
          <Icon className={config.iconClassName} size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-white">{item.label}</h3>
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${config.className}`}
            >
              {config.label}
            </span>
          </div>
          <p className="mt-1 text-sm leading-5 text-[#9aa9a2]">{item.description}</p>
          {item.details ? (
            <p className="mt-3 break-words rounded-xl border border-white/[0.07] bg-black/10 px-3 py-2 text-xs leading-5 text-[#b9c5c0]">
              {item.details}
            </p>
          ) : null}
          {typeof item.latencyMs === "number" ? (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/35">
              <Clock3 size={13} /> {item.latencyMs} ms
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
