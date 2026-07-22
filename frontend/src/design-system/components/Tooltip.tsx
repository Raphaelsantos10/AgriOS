import { useId, type ReactNode } from "react";
export default function Tooltip({ content, children, side = "top" }: { content: ReactNode; children: ReactNode; side?: "top" | "bottom" }) {
  const id = useId(); return <span className="group relative inline-flex" aria-describedby={id}>{children}<span id={id} role="tooltip" className={`pointer-events-none absolute left-1/2 z-[var(--farpha-z-dropdown)] w-max max-w-64 -translate-x-1/2 rounded-lg bg-[var(--farpha-brand-950)] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100 ${side === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}>{content}</span></span>;
}
