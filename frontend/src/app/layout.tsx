import { useState, type ReactNode } from "react";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import StatusBar from "../components/layout/StatusBar";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-dvh min-h-0 bg-[#f5f8f6] text-[#1b2a21]">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="min-h-0 flex-1 overflow-auto bg-[radial-gradient(circle_at_top_right,rgba(167,226,46,0.08),transparent_28%),#f5f8f6] p-4 md:p-6 xl:p-7">
          {children}
        </main>

        <StatusBar />
      </div>
    </div>
  );
}
