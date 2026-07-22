import { useEffect, useRef, type ReactNode } from "react";
export default function Popover({ open, onClose, trigger, children, label }: { open: boolean; onClose: () => void; trigger: ReactNode; children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!open) return; const close = (event: PointerEvent) => { if (!ref.current?.contains(event.target as Node)) onClose(); }; const key = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); }; document.addEventListener("pointerdown", close); document.addEventListener("keydown", key); return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", key); }; }, [open, onClose]);
  return <div ref={ref} className="relative inline-flex">{trigger}{open ? <div role="dialog" aria-label={label} className="absolute right-0 top-full z-[var(--farpha-z-dropdown)] mt-2 w-[min(90vw,22rem)] rounded-2xl border border-[var(--farpha-border)] bg-[var(--farpha-surface)] p-4 shadow-[var(--farpha-shadow-lg)]">{children}</div> : null}</div>;
}
