import { useCallback, useEffect, useState } from "react";
import { MapPinned } from "lucide-react";

import FarmDrawer from "../../farms/components/FarmDrawer";
import { createFarm, getFarms } from "../../farms/services/farmsService";
import type { FarmInput } from "../../farms/services/farmsService";
import type { Farm } from "../../farms/types/farm";
import MapView from "../../maps/components/MapView";
import FarphaIntelligencePanel from "../components/FarphaIntelligencePanel";
import { useFarphaIntelligence } from "../hooks/useFarphaIntelligence";
import OperationsKpiGrid from "../components/OperationsKpiGrid";
import DashboardHeader from "../components/DashboardHeader";
import MapToolbar from "../components/MapToolbar";
import OperationsSummaryCards from "../components/OperationsSummaryCards";
import TodayFocus from "../components/TodayFocus";
import UnifiedAlertsPanel from "../../operations/components/UnifiedAlertsPanel";
import OperationsTimeline from "../../operations/components/OperationsTimeline";
import { useOperationsCenter } from "../../operations/hooks/useOperationsCenter";
import { useAuth } from "../../auth";
import { greetingForHour } from "../utils/dailyContext";

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const intelligence = useFarphaIntelligence(farms);
  const operations = useOperationsCenter();
  const { profile } = useAuth();
  const userName = profile?.fullName?.split(/\s+/)[0] || "Raphael";

  const loadFarms = useCallback(async () => {
    setLoading(true);
    try {
      const farms = await getFarms();
      setFarms(farms);
    } catch (error) {
      console.error("FARMS LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadFarms();
    }, 0);

    return () => window.clearTimeout(id);
  }, [loadFarms]);

  async function handleCreateFarm(farm: FarmInput) {
    const createdFarm = await createFarm(farm);
    setFarms((current) => [createdFarm, ...current]);
  }

  return (
    <section className="-m-4 min-h-full space-y-4 bg-[radial-gradient(circle_at_top_right,rgba(156,223,40,0.08),transparent_26%),#061014] p-4 text-white md:-m-6 md:p-6 xl:-m-7 xl:p-7">
      <DashboardHeader loading={loading} onRefresh={() => void loadFarms()} onCreateFarm={() => setDrawerOpen(true)} userName={userName} farm={farms[0]} />

      <OperationsKpiGrid />

      <div className="grid min-h-[580px] gap-4 2xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b171a] shadow-[0_26px_80px_rgba(0,0,0,0.30)]">
          <div className="absolute left-5 top-5 z-[500] flex items-center gap-2 rounded-xl border border-white/10 bg-[#071215]/90 px-4 py-2.5 backdrop-blur">
            <MapPinned className="text-[#9cdf28]" size={18} />
            <div><p className="text-sm font-bold text-white">Mapa da exploração</p><p className="text-[10px] text-[#84938d]">{loading ? "A carregar..." : `${farms.length} exploração(ões) ativa(s)`}</p></div>
          </div>
          <MapToolbar />
          <div className="h-[580px] min-h-[580px] [&_.leaflet-control]:opacity-90">
            <MapView farms={farms} />
          </div>
          <div className="pointer-events-none absolute bottom-5 left-1/2 z-[500] w-[min(92%,640px)] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#071215]/92 p-3 backdrop-blur">
            <div className="flex items-center gap-3 text-xs text-[#9aa9a2]"><span className="rounded-lg bg-[#9cdf28] px-3 py-1.5 font-bold text-[#061014]">Hoje</span><div className="h-1 flex-1 rounded-full bg-white/10"><div className="h-full w-[82%] rounded-full bg-gradient-to-r from-[#5f9912] to-[#9cdf28]" /></div><span className="font-semibold text-[#9cdf28]">Tempo real</span></div>
          </div>
        </div>
        <FarphaIntelligencePanel
          greeting={greetingForHour(new Date().getHours())}
          userName={userName}
          recommendations={intelligence.recommendations}
          confidence={intelligence.confidence}
          loading={intelligence.loading}
          error={intelligence.error}
          onRefresh={() => void intelligence.refresh()}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]"><TodayFocus /><OperationsSummaryCards /></div>
      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]"><UnifiedAlertsPanel alerts={operations.alerts} limit={4} /><OperationsTimeline events={operations.timeline.slice(0, 5)} /></div>

      <FarmDrawer open={drawerOpen} editingFarm={null} onClose={() => setDrawerOpen(false)} onCreateFarm={handleCreateFarm} />
    </section>
  );
}
