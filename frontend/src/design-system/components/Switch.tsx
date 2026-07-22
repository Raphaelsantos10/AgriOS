import { useId, type ButtonHTMLAttributes, type ReactNode } from "react";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role" | "aria-checked"> & { checked: boolean; label: ReactNode; hint?: string };
export default function Switch({ checked, label, hint, id, className = "", disabled, ...props }: Props) {
  const generatedId = useId(); const labelId = `${id ?? generatedId}-label`;
  return <span className={`flex items-start justify-between gap-4 ${className}`}><span id={labelId} className="text-sm"><span className="font-semibold">{label}</span>{hint ? <span className="mt-0.5 block text-xs text-[var(--farpha-text-muted)]">{hint}</span> : null}</span><button type="button" role="switch" aria-checked={checked} aria-labelledby={labelId} disabled={disabled} className={`relative h-7 w-12 shrink-0 rounded-full border transition focus-visible:ring-4 focus-visible:ring-lime-300/25 disabled:opacity-60 ${checked ? "border-[var(--farpha-brand-600)] bg-[var(--farpha-brand-600)]" : "border-[var(--farpha-border-strong)] bg-[var(--farpha-surface-muted)]"}`} {...props}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? "left-[22px]" : "left-0.5"}`}/></button></span>;
}
