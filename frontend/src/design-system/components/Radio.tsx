import { useId, type InputHTMLAttributes, type ReactNode } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: ReactNode; hint?: string };
export default function Radio({ label, hint, id, className = "", ...props }: Props) {
  const generatedId = useId(); const inputId = id ?? generatedId;
  return <label htmlFor={inputId} className={`flex cursor-pointer items-start gap-3 text-sm ${className}`}><input id={inputId} type="radio" className="mt-0.5 h-5 w-5 shrink-0 border-[var(--farpha-border-strong)] accent-[var(--farpha-brand-600)] focus-visible:ring-4 focus-visible:ring-lime-300/25 disabled:opacity-60" {...props}/><span><span className="font-semibold">{label}</span>{hint ? <span className="mt-0.5 block text-xs text-[var(--farpha-text-muted)]">{hint}</span> : null}</span></label>;
}
