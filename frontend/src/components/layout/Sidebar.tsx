import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { NavLink } from "react-router-dom";

import { navigationGroups } from "../../app/navigation";
import FarphaLogo from "../brand/FarphaLogo";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
};

export default function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}: SidebarProps) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#b6e83e]/10 bg-[linear-gradient(180deg,#020c09_0%,#03110d_58%,#020a08_100%)] text-white shadow-[24px_0_70px_rgba(0,0,0,0.28)] transition-all duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "w-[88px]" : "w-[272px]"}`}
      >
        <div
          className={`relative flex min-h-[132px] items-center border-b border-white/[0.07] ${
            collapsed ? "justify-center px-3" : "justify-center px-5"
          }`}
        >
          <FarphaLogo
            compact={collapsed}
            eager
            className={
              collapsed
                ? "h-[58px] w-[58px] drop-shadow-[0_0_16px_rgba(182,232,62,0.18)]"
                : "h-[106px] w-full max-w-[220px] drop-shadow-[0_0_20px_rgba(182,232,62,0.12)]"
            }
          />

          {!collapsed ? (
            <button
              type="button"
              aria-label="Recolher menu"
              onClick={onToggleCollapsed}
              className="absolute right-3 top-3 hidden rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-emerald-100/55 transition hover:border-[#b6e83e]/30 hover:bg-[#b6e83e]/10 hover:text-[#d9ff7e] lg:block"
            >
              <ChevronLeft size={17} />
            </button>
          ) : null}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navigationGroups.map((group, groupIndex) => (
            <section key={group.label} className={groupIndex === 0 ? "mb-4" : "mb-5"}>
              {!collapsed ? (
                <div className="mb-2 flex items-center gap-2 px-3">
                  <p className="whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#b6e83e]/55">
                    {group.label}
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#b6e83e]/15 to-transparent" />
                </div>
              ) : (
                <div className="mx-auto mb-2 h-px w-8 bg-white/10" />
              )}

              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  if (item.disabled) {
                    return (
                      <div
                        key={item.label}
                        title={`${item.label} — em breve`}
                        className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-emerald-100/30"
                      >
                        <Icon size={20} strokeWidth={1.8} className="shrink-0" />
                        {!collapsed ? (
                          <>
                            <span className="truncate text-sm font-medium">
                              {item.label}
                            </span>
                            <span className="ml-auto rounded-md border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-white/30">
                              Breve
                            </span>
                          </>
                        ) : null}
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      end={item.path === "/"}
                      title={collapsed ? item.label : undefined}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `group relative flex min-h-11 items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-[linear-gradient(90deg,#92c925_0%,#b6e83e_100%)] text-[#0d2417] shadow-[0_8px_24px_rgba(118,160,24,0.18)]"
                            : "text-emerald-50/70 hover:bg-white/[0.055] hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`absolute inset-y-2 left-0 w-[3px] rounded-r-full transition ${
                              isActive ? "bg-[#e5ff9b]" : "bg-transparent group-hover:bg-white/15"
                            }`}
                          />
                          <Icon size={21} strokeWidth={1.9} className="shrink-0" />
                          {!collapsed ? (
                            <span className="truncate tracking-[-0.01em]">{item.label}</span>
                          ) : null}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>

        <div className="border-t border-white/[0.07] p-3">
          {collapsed ? (
            <button
              type="button"
              aria-label="Expandir menu"
              onClick={onToggleCollapsed}
              className="mx-auto hidden rounded-xl border border-white/10 p-2.5 text-emerald-100/60 transition hover:border-[#b6e83e]/30 hover:bg-[#b6e83e]/10 hover:text-[#d9ff7e] lg:block"
            >
              <ChevronRight size={19} />
            </button>
          ) : (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3.5 shadow-inner shadow-black/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#b6e83e]/25 bg-[linear-gradient(145deg,#295f43,#153c2a)] text-sm font-extrabold text-white shadow-[0_0_18px_rgba(182,232,62,0.08)]">
                  RS
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">Raphael Soares</p>
                  <p className="truncate text-xs text-emerald-100/45">Administrador</p>
                </div>
                <Circle size={9} fill="#9bd832" className="text-[#9bd832]" />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2.5 text-[10px] text-emerald-100/40">
                <span>FARPHA Foundation</span>
                <span className="font-semibold text-[#b6e83e]/70">v2.0</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
