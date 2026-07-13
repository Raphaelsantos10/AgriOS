import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, id, className = "", ...props }: Props) {
  const inputId = id ?? props.name;

  return (
    <label className="block" htmlFor={inputId}>
      {label ? <span className="mb-2 block text-sm font-semibold text-[var(--farpha-text)]">{label}</span> : null}
      <input
        id={inputId}
        className={`h-11 w-full rounded-xl border bg-white px-3 text-sm text-[var(--farpha-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--farpha-brand-500)] focus:ring-4 focus:ring-lime-300/20 ${error ? "border-red-400" : "border-[var(--farpha-border)]"} ${className}`}
        {...props}
      />
      {error ? <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  );
}
