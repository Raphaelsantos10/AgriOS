import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  elevated?: boolean;
};

export default function Card({ children, elevated = false, className = "", ...props }: Props) {
  return (
    <div
      className={`rounded-2xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] ${elevated ? "shadow-lg" : "shadow-sm"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
