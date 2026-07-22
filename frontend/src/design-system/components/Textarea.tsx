import { useId, type TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: string; error?: string };

export default function Textarea({ label, hint, error, id, className = "", ...props }: Props) {
  const generatedId = useId(); const inputId = id ?? props.name ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return <label htmlFor={inputId} className="block min-w-0">{label ? <span className="mb-2 block text-sm font-semibold">{label}</span> : null}<textarea id={inputId} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={`min-h-28 w-full resize-y rounded-[var(--farpha-radius-md)] border bg-[var(--farpha-surface)] px-3 py-2.5 text-sm shadow-sm outline-none hover:border-[var(--farpha-border-strong)] focus:border-[var(--farpha-brand-500)] focus:ring-4 focus:ring-lime-300/20 disabled:opacity-60 ${error ? "border-[var(--farpha-danger-500)]" : "border-[var(--farpha-border)]"} ${className}`} {...props}/>{error ? <span id={`${inputId}-error`} className="mt-1.5 block text-xs font-medium text-[var(--farpha-danger-700)]">{error}</span> : hint ? <span id={`${inputId}-hint`} className="mt-1.5 block text-xs text-[var(--farpha-text-muted)]">{hint}</span> : null}</label>;
}
