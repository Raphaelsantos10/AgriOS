import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[var(--farpha-brand-600)] text-white shadow-sm hover:bg-[var(--farpha-brand-700)]",
  secondary: "border border-[var(--farpha-border)] bg-[var(--farpha-surface)] text-[var(--farpha-text)] shadow-sm hover:border-[var(--farpha-border-strong)] hover:bg-[var(--farpha-surface-muted)]",
  ghost: "text-[var(--farpha-text)] hover:bg-[var(--farpha-surface-muted)]",
  danger: "bg-[var(--farpha-danger)] text-white shadow-sm hover:brightness-95",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-11 w-11 p-0",
};

export default function Button({ children, variant = "primary", size = "md", loading = false, className = "", disabled, type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--farpha-radius-md)] font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-300/30 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle aria-hidden="true" className="animate-spin" size={17} /> : null}
      <span>{loading ? "A processar…" : children}</span>
    </button>
  );
}
