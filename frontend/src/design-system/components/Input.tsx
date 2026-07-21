import { useId, type InputHTMLAttributes, type ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: ReactNode;
};

export default function Input({ label, error, hint, leadingIcon, id, className = "", ...props }: Props) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <label className="block min-w-0" htmlFor={inputId}>
      {label ? <span className="mb-2 block text-sm font-semibold text-[var(--farpha-text)]">{label}</span> : null}
      <span className="relative block">
        {leadingIcon ? <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--farpha-text-muted)]">{leadingIcon}</span> : null}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`h-11 w-full min-w-0 rounded-[var(--farpha-radius-md)] border bg-[var(--farpha-surface)] px-3 text-sm text-[var(--farpha-text)] shadow-sm outline-none transition duration-150 placeholder:text-[#91a096] hover:border-[var(--farpha-border-strong)] focus:border-[var(--farpha-brand-500)] focus:ring-4 focus:ring-lime-300/20 disabled:cursor-not-allowed disabled:bg-[var(--farpha-surface-muted)] disabled:opacity-70 ${leadingIcon ? "pl-10" : ""} ${error ? "border-red-400" : "border-[var(--farpha-border)]"} ${className}`}
          {...props}
        />
      </span>
      {error ? <span id={`${inputId}-error`} className="mt-1.5 block text-xs font-medium text-red-600">{error}</span> : null}
      {!error && hint ? <span id={`${inputId}-hint`} className="mt-1.5 block text-xs text-[var(--farpha-text-muted)]">{hint}</span> : null}
    </label>
  );
}
