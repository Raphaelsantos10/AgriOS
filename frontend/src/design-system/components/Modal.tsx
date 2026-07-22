import { useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { useOverlay } from "./useOverlay";

type Props = { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; footer?: ReactNode; size?: "sm" | "md" | "lg" };
export default function Modal({ open, onClose, title, description, children, footer, size = "md" }: Props) {
  const ref = useOverlay(open, onClose); const id = useId();
  if (!open) return null;
  const widths = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };
  return <div className="fixed inset-0 z-[var(--farpha-z-modal)] grid place-items-center bg-black/55 p-4 backdrop-blur-sm" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div ref={ref} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} aria-describedby={description ? `${id}-description` : undefined} className={`max-h-[min(88dvh,900px)] w-full ${widths[size]} overflow-hidden rounded-[var(--farpha-radius-xl)] border border-[var(--farpha-border)] bg-[var(--farpha-surface)] shadow-[var(--farpha-shadow-lg)]`}><header className="flex items-start justify-between gap-4 border-b border-[var(--farpha-border)] p-5"><div><h2 id={`${id}-title`} className="farpha-heading-3">{title}</h2>{description ? <p id={`${id}-description`} className="mt-1 text-sm text-[var(--farpha-text-muted)]">{description}</p> : null}</div><button data-autofocus type="button" onClick={onClose} className="farpha-touch-target grid place-items-center rounded-xl hover:bg-[var(--farpha-surface-muted)]" aria-label="Fechar janela"><X size={20}/></button></header><div className="max-h-[calc(88dvh-150px)] overflow-y-auto p-5">{children}</div>{footer ? <footer className="flex flex-wrap justify-end gap-2 border-t border-[var(--farpha-border)] p-4">{footer}</footer> : null}</div></div>;
}
