import { useCallback, useEffect, useState, type ReactNode } from "react";
import CommandPalette from "../components/layout/CommandPalette";
import Header from "../components/layout/Header";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import Sidebar from "../components/layout/Sidebar";
import StatusBar from "../components/layout/StatusBar";
import AppLock from "../features/system/components/AppLock";

type Props = { children: ReactNode };

export default function Layout({ children }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem("farpha-sidebar") === "collapsed");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("farpha-theme") === "dark");

  const openCommand = useCallback(() => setCommandOpen(true), []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "farpha-dark" : "farpha-light";
    localStorage.setItem("farpha-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("farpha-sidebar", sidebarCollapsed ? "collapsed" : "expanded");
  }, [sidebarCollapsed]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((current) => !current);
      }
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-dvh min-h-0 bg-[var(--farpha-background)] text-[var(--farpha-text)]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--farpha-z-toast)] focus:rounded-xl focus:bg-[var(--farpha-brand-700)] focus:px-4 focus:py-3 focus:font-bold focus:text-white focus:shadow-lg">Saltar para o conteúdo principal</a>
      <Sidebar collapsed={sidebarCollapsed} mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} onToggleCollapsed={() => setSidebarCollapsed((current) => !current)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} onOpenCommand={openCommand} darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />
        <main id="main-content" tabIndex={-1} className="min-h-0 flex-1 overflow-auto bg-[radial-gradient(circle_at_top_right,rgba(167,226,46,0.07),transparent_30%),var(--farpha-background)] p-4 pb-24 outline-none md:p-6 md:pb-24 xl:p-7 lg:pb-7">{children}</main>
        <StatusBar />
      </div>
      <MobileBottomNav />
      <CommandPalette open={commandOpen} onClose={closeCommand} />
      <AppLock />
    </div>
  );
}
