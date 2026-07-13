import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[var(--farpha-brand-600)] text-white hover:bg-[var(--farpha-brand-700)]",
  secondary: "border border-[var(--farpha-border)] bg-white text-[var(--farpha-text)] hover:bg-[var(--farpha-surface-muted)]",
  ghost: "text-[var(--farpha-text)] hover:bg-[var(--farpha-surface-muted)]",
  danger: "bg-[var(--farpha-danger)] text-white hover:brightness-95",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-300/30 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "A processar…" : children}
    </button>
  );
}
