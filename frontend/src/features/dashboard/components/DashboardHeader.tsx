import { CalendarDays, CloudSun, Clock3, Droplets, MapPin, Plus, RefreshCw, Sparkles, Thermometer } from "lucide-react";
import type { Farm } from "../../farms/types/farm";
import { useDailyOverview } from "../hooks/useDailyOverview";

type DashboardHeaderProps = { loading: boolean; onRefresh: () => void; onCreateFarm: () => void; userName: string; farm?: Farm };

export default function DashboardHeader({ loading, onRefresh, onCreateFarm, userName, farm }: DashboardHeaderProps) {
  const daily = useDailyOverview(farm);
  return <header className="farpha-dashboard-header space-y-4">
    <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
      <div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--dashboard-accent)]"><Sparkles size={14}/> Centro de Operações</div><h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[var(--dashboard-heading)] md:text-4xl">{daily.greeting}, {userName}!</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--dashboard-muted)]">Acompanhe saúde, risco e produtividade de toda a operação num único painel.</p></div>
      <div className="flex flex-wrap items-center gap-3"><div className="flex items-center gap-2 rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-chip)] px-3.5 py-2.5 text-xs font-semibold text-[var(--dashboard-success)]"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"/> Dados sincronizados</div><button onClick={onRefresh} type="button" className="rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-2.5 text-[var(--dashboard-muted)] transition hover:brightness-95" aria-label="Atualizar dados"><RefreshCw className={loading ? "animate-spin" : ""} size={18}/></button><button onClick={onCreateFarm} type="button" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6aa616] to-[#9cdf28] px-4 py-2.5 text-sm font-black text-[#061014] shadow-[0_12px_30px_rgba(156,223,40,0.16)] transition hover:brightness-110"><Plus size={18}/> Nova exploração</button></div>
    </div>
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
      <DashboardDatum icon={<CalendarDays size={19}/>} label="Data" value={daily.date} capitalize />
      <DashboardDatum icon={<Clock3 size={19}/>} label="Hora local" value={daily.time} tabular />
      <DashboardDatum icon={<CloudSun size={20}/>} label="Previsão de hoje" value={!farm ? "Cadastre uma exploração" : daily.weatherLoading ? "A atualizar…" : daily.weather ? daily.weatherLabel : "Indisponível"} />
      <DashboardDatum icon={<Thermometer size={20}/>} label="Temperatura" value={daily.weather ? `${daily.weather.temperatureMin.toFixed(0)}-${daily.weather.temperatureMax.toFixed(0)} °C` : "-"} />
      <DashboardDatum icon={<Droplets size={20}/>} label="Chuva" value={daily.weather ? `${daily.weather.precipitationProbability}% · ${daily.weather.precipitationMm.toFixed(1)} mm` : "-"} />
    </div>
    <p className="flex items-center gap-1.5 text-[11px] text-[var(--dashboard-muted)]"><MapPin size={13}/>{farm ? `${farm.name} · Open-Meteo nas coordenadas da exploração` : "A previsão será apresentada após cadastrar uma exploração."}{daily.weatherError ? ` · ${daily.weatherError}` : ""}</p>
  </header>;
}

function DashboardDatum({ icon, label, value, capitalize = false, tabular = false }: { icon: React.ReactNode; label: string; value: string; capitalize?: boolean; tabular?: boolean }) {
  return <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-3 shadow-sm"><span className="shrink-0 text-[var(--dashboard-accent)]">{icon}</span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-[var(--dashboard-muted)]">{label}</p><p className={`truncate text-sm font-bold text-[var(--dashboard-heading)] ${capitalize ? "capitalize" : ""} ${tabular ? "tabular-nums" : ""}`}>{value}</p></div></div>;
}
