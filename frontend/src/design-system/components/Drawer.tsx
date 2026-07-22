import { useId, type ReactNode } from "react";
import { X } from "lucide-react";
import { useOverlay } from "./useOverlay";

type Props = { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; footer?: ReactNode; side?: "left" | "right" };
export default function Drawer({ open, onClose, title, description, children, footer, side = "right" }: Props) {
  const ref = useOverlay(open, onClose); const id = useId(); if (!open) return null;
  return <div className="fixed inset-0 z-[var(--farpha-z-modal)] bg-black/50 backdrop-blur-sm" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div ref={ref} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} className={`absolute inset-y-0 ${side === "right" ? "right-0" : "left-0"} flex w-full max-w-xl flex-col border-[var(--farpha-border)] bg-[var(--farpha-surface)] shadow-[var(--farpha-shadow-lg)] ${side === "right" ? "border-l" : "border-r"}`}><header className="flex items-start justify-between gap-4 border-b border-[var(--farpha-border)] p-5"><div><h2 id={`${id}-title`} className="farpha-heading-3">{title}</h2>{description ? <p className="mt-1 text-sm text-[var(--farpha-text-muted)]">{description}</p> : null}</div><button data-autofocus type="button" onClick={onClose} className="farpha-touch-target grid place-items-center rounded-xl hover:bg-[var(--farpha-surface-muted)]" aria-label="Fechar painel"><X size={20}/></button></header><div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>{footer ? <footer className="flex flex-wrap justify-end gap-2 border-t border-[var(--farpha-border)] p-4">{footer}</footer> : null}</div></div>;
}
