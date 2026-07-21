import { CheckCircle2, Cloud, Database } from "lucide-react";

export default function StatusBar() {
  return (
    <footer className="flex min-h-8 shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[var(--farpha-border)] bg-[var(--farpha-surface)] px-4 py-1.5 text-[10px] font-medium text-[var(--farpha-text-muted)] md:px-6 xl:px-8">
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-600" />
          Plataforma operacional
        </span>
        <span className="flex items-center gap-1.5">
          <Database size={13} className="text-[#377d57]" />
          Supabase conectado
        </span>
        <span className="hidden items-center gap-1.5 sm:flex">
          <Cloud size={13} className="text-[#377d57]" />
          Sincronização ativa
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span>Foundation 2.0</span>
        <span className="h-3 w-px bg-[var(--farpha-border)]" />
        <span>RC1</span>
      </div>
    </footer>
  );
}
