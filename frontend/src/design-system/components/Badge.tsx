import type { HTMLAttributes, ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

type Props = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: Tone;
};

const tones: Record<Tone, string> = {
  neutral: "bg-[var(--farpha-surface-muted)] text-[var(--farpha-text)]",
  success: "farpha-status-success",
  warning: "farpha-status-warning",
  danger: "farpha-status-danger",
  info: "farpha-status-info",
};

export default function Badge({ children, tone = "neutral", className = "", ...props }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
