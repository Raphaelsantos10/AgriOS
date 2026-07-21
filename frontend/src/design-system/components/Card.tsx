import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "muted" | "dark";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  elevated?: boolean;
  interactive?: boolean;
  variant?: CardVariant;
};

const variants: Record<CardVariant, string> = {
  default: "border-[var(--farpha-border)] bg-[var(--farpha-surface)] text-[var(--farpha-text)]",
  muted: "border-[var(--farpha-border)] bg-[var(--farpha-surface-muted)] text-[var(--farpha-text)]",
  dark: "border-white/10 bg-[#0b171a] text-white",
};

export default function Card({
  children,
  elevated = false,
  interactive = false,
  variant = "default",
  className = "",
  ...props
}: Props) {
  return (
    <div
      className={`rounded-[var(--farpha-radius-lg)] border ${variants[variant]} ${elevated ? "shadow-[var(--farpha-shadow-md)]" : "shadow-[var(--farpha-shadow-sm)]"} ${interactive ? "transition duration-200 hover:-translate-y-0.5 hover:border-[var(--farpha-border-strong)] hover:shadow-[var(--farpha-shadow-md)] focus-within:border-[var(--farpha-brand-500)] focus-within:shadow-[var(--farpha-shadow-md)]" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
