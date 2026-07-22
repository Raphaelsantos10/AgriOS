import type { ReactNode } from "react";

type Tone = "info" | "success" | "warning" | "danger";
export default function FormMessage({ children, tone = "info" }: { children: ReactNode; tone?: Tone }) {
  const role = tone === "danger" ? "alert" : "status";
  return <div role={role} aria-live="polite" className={`rounded-xl px-3.5 py-3 text-sm font-medium farpha-status-${tone}`}>{children}</div>;
}
