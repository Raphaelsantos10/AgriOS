import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Search, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { navigationGroups } from "../../app/navigation";

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const items = useMemo(
    () =>
      navigationGroups
        .flatMap((group) => group.items.map((item) => ({ ...item, group: group.label })))
        .filter((item) => !item.disabled),
    [],
  );

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-PT");
    if (!normalized) return items;
    return items.filter((item) =>
      `${item.label} ${item.group}`.toLocaleLowerCase("pt-PT").includes(normalized),
    );
  }, [items, query]);

  const closePalette = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePalette();
      if (event.key === "Enter" && results[0]) {
        navigate(results[0].path);
        closePalette();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePalette, navigate, open, results]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-[#07110d]/65 px-4 pt-[10vh] backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Pesquisa global">
      <button type="button" aria-label="Fechar pesquisa" className="absolute inset-0" onClick={closePalette} />
      <section className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[24px] border border-white/60 bg-white shadow-[0_32px_100px_rgba(5,24,15,0.35)]">
        <div className="flex items-center gap-3 border-b border-[#e1e9e3] px-5 py-4">
          <Search size={20} className="shrink-0 text-[#4f765f]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar módulos, páginas e ações..."
            className="h-11 min-w-0 flex-1 border-0 bg-transparent text-base font-medium text-[#173321] outline-none placeholder:text-[#91a097]"
          />
          <button type="button" onClick={closePalette} className="rounded-xl p-2 text-[#6c7f73] transition hover:bg-[#eef5f0] hover:text-[#214f39]" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-3">
          <div className="mb-2 flex items-center justify-between px-2 py-1">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7b8d82]">Resultados</p>
            <span className="text-xs text-[#8a9a90]">Enter para abrir</span>
          </div>

          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      navigate(item.path);
                      closePalette();
                    }}
                    className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${index === 0 ? "bg-[#edf6ef]" : "hover:bg-[#f3f7f4]"}`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d9e7dc] bg-white text-[#2d6847] shadow-sm">
                      <Icon size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-[#183423]">{item.label}</span>
                      <span className="block truncate text-xs text-[#7b8d82]">{item.group}</span>
                    </span>
                    <ArrowRight size={17} className="text-[#8ba095] transition group-hover:translate-x-0.5 group-hover:text-[#2d6847]" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf6ef] text-[#34724f]">
                <Sparkles size={24} />
              </span>
              <p className="font-bold text-[#173321]">Nenhum resultado encontrado</p>
              <p className="mt-1 max-w-sm text-sm text-[#7b8d82]">Tente pesquisar por exploração, cultura, calendário, analytics ou diagnóstico.</p>
            </div>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e1e9e3] bg-[#f7faf8] px-5 py-3 text-[11px] text-[#73867a]">
          <span>FARPHA Pesquisa Global</span>
          <span className="flex items-center gap-2"><kbd className="rounded-md border border-[#d6e0d8] bg-white px-2 py-1 font-semibold">Esc</kbd> fechar</span>
        </footer>
      </section>
    </div>
  );
}
