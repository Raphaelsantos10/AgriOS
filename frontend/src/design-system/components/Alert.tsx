import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
type Tone = "info" | "success" | "warning" | "danger";
const icons = { info: Info, success: CheckCircle2, warning: TriangleAlert, danger: AlertCircle };
export default function Alert({ tone = "info", title, children }: { tone?: Tone; title?: string; children: ReactNode }) { const Icon = icons[tone]; return <div role={tone === "danger" ? "alert" : "status"} className={`flex gap-3 rounded-2xl border border-current/15 p-4 farpha-status-${tone}`}><Icon className="mt-0.5 shrink-0" size={20}/><div>{title ? <p className="font-bold">{title}</p> : null}<div className="text-sm leading-6">{children}</div></div></div>; }
