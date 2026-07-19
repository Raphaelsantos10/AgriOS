import {
  Activity,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  LandPlot,
  LoaderCircle,
  MapPinned,
  RefreshCw,
  Sprout,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import AnalyticsCard from "../components/AnalyticsCard";
import CropDistributionPanel from "../components/CropDistributionPanel";
import DistributionPanel from "../components/DistributionPanel";
import FarmRankingTable from "../components/FarmRankingTable";
import MonthlyActivityPanel from "../components/MonthlyActivityPanel";
import { getAnalyticsData } from "../services/analyticsService";
import type { AnalyticsRawData } from "../types/analytics";
import { calculateAnalytics } from "../utils/analyticsCalculations";

const emptyData: AnalyticsRawData = { farms: [], fields: [], missions: [] };

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsRawData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getAnalyticsData());
    } catch (loadError) {
      console.error(loadError);
      setError("Não foi possível carregar os dados de Analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getAnalyticsData()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((loadError) => {
        console.error(loadError);
        if (active) setError("Não foi possível carregar os dados de Analytics.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => calculateAnalytics(data), [data]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <LoaderCircle className="animate-spin" /> A preparar Analytics…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Centro de inteligência operacional
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Analytics Agrícola
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Visão consolidada das explorações, talhões e missões guardadas no Supabase.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadData()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw size={18} /> Atualizar dados
        </button>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard icon={MapPinned} label="Explorações" value={String(summary.totalFarms)} helper="Unidades agrícolas registadas" />
        <AnalyticsCard icon={LandPlot} label="Talhões" value={String(summary.totalFields)} helper="Limites geridos no GIS" />
        <AnalyticsCard icon={Sprout} label="Área cartografada" value={`${summary.totalArea.toFixed(2)} ha`} helper="Soma da área real dos talhões" />
        <AnalyticsCard icon={ClipboardCheck} label="Missões ativas" value={String(summary.activeMissions)} helper={`${summary.totalMissions} missões no total`} />
        <AnalyticsCard icon={CheckCircle2} label="Taxa de conclusão" value={`${summary.completionRate.toFixed(0)}%`} helper={`${summary.completedMissions} missões concluídas`} />
        <AnalyticsCard icon={CircleAlert} label="Missões atrasadas" value={String(summary.overdueMissions)} helper="Prazo ultrapassado e não concluídas" />
        <AnalyticsCard icon={Activity} label="Saúde média" value={`${summary.averageFieldHealth.toFixed(0)}%`} helper="Índice baseado no estado dos talhões" />
        <AnalyticsCard icon={ClipboardCheck} label="Missões concluídas" value={String(summary.completedMissions)} helper="Histórico operacional finalizado" />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <DistributionPanel title="Missões por estado" description="Situação atual do trabalho operacional." items={summary.missionStatus} />
        <DistributionPanel title="Missões por prioridade" description="Peso das missões críticas, altas, médias e baixas." items={summary.missionPriority} />
        <DistributionPanel title="Saúde dos talhões" description="Distribuição dos estados GIS atuais." items={summary.fieldHealth} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <MonthlyActivityPanel items={summary.monthlyActivity} />
        <CropDistributionPanel items={summary.cropDistribution} />
      </section>

      <FarmRankingTable items={summary.farmRanking} />
    </div>
  );
}
