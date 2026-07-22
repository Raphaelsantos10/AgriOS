import { useId, type SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string; hint?: string; error?: string };

export default function Select({ label, hint, error, id, className = "", children, ...props }: Props) {
  const generatedId = useId(); const inputId = id ?? props.name ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return <label htmlFor={inputId} className="block min-w-0">{label ? <span className="mb-2 block text-sm font-semibold">{label}</span> : null}<select id={inputId} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={`h-11 w-full rounded-[var(--farpha-radius-md)] border bg-[var(--farpha-surface)] px-3 text-sm shadow-sm outline-none hover:border-[var(--farpha-border-strong)] focus:border-[var(--farpha-brand-500)] focus:ring-4 focus:ring-lime-300/20 disabled:opacity-60 ${error ? "border-[var(--farpha-danger-500)]" : "border-[var(--farpha-border)]"} ${className}`} {...props}>{children}</select>{error ? <span id={`${inputId}-error`} className="mt-1.5 block text-xs font-medium text-[var(--farpha-danger-700)]">{error}</span> : hint ? <span id={`${inputId}-hint`} className="mt-1.5 block text-xs text-[var(--farpha-text-muted)]">{hint}</span> : null}</label>;
}
