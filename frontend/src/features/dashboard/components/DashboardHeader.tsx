import { CalendarDays, CloudSun, Clock3, Droplets, MapPin, Plus, RefreshCw, Sparkles, Thermometer } from "lucide-react";
import type { Farm } from "../../farms/types/farm";
import { useDailyOverview } from "../hooks/useDailyOverview";

type DashboardHeaderProps = { loading: boolean; onRefresh: () => void; onCreateFarm: () => void; userName: string; farm?: Farm };

export default function DashboardHeader({ loading, onRefresh, onCreateFarm, userName, farm }: DashboardHeaderProps) {
  const daily = useDailyOverview(farm);
  return <header className="space-y-4">
    <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
      <div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9cdf28]"><Sparkles size={14}/> Centro de Operações</div><h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">{daily.greeting}, {userName}!</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#9eaca5]">Acompanhe saúde, risco e produtividade de toda a operação num único painel.</p></div>
      <div className="flex flex-wrap items-center gap-3"><div className="flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3.5 py-2.5 text-xs font-semibold text-emerald-200"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"/> Dados sincronizados</div><button onClick={onRefresh} type="button" className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-[#9aa9a2] transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white" aria-label="Atualizar dados"><RefreshCw className={loading ? "animate-spin" : ""} size={18}/></button><button onClick={onCreateFarm} type="button" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6aa616] to-[#9cdf28] px-4 py-2.5 text-sm font-black text-[#061014] shadow-[0_12px_30px_rgba(156,223,40,0.16)] transition hover:brightness-110"><Plus size={18}/> Nova exploração</button></div>
    </div>
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"><CalendarDays className="text-[#9cdf28]" size={19}/><div><p className="text-[10px] font-bold uppercase tracking-wider text-[#7f9188]">Data</p><p className="capitalize text-sm font-bold text-white">{daily.date}</p></div></div>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"><Clock3 className="text-[#9cdf28]" size={19}/><div><p className="text-[10px] font-bold uppercase tracking-wider text-[#7f9188]">Hora local</p><p className="text-sm font-bold tabular-nums text-white">{daily.time}</p></div></div>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"><CloudSun className="text-sky-300" size={20}/><div><p className="text-[10px] font-bold uppercase tracking-wider text-[#7f9188]">Previsão de hoje</p><p className="text-sm font-bold text-white">{!farm ? "Cadastre uma exploração" : daily.weatherLoading ? "A atualizar…" : daily.weather ? daily.weatherLabel : "Indisponível"}</p></div></div>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"><Thermometer className="text-orange-300" size={20}/><div><p className="text-[10px] font-bold uppercase tracking-wider text-[#7f9188]">Temperatura</p><p className="text-sm font-bold text-white">{daily.weather ? `${daily.weather.temperatureMin.toFixed(0)}–${daily.weather.temperatureMax.toFixed(0)} °C` : "—"}</p></div></div>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"><Droplets className="text-blue-300" size={20}/><div><p className="text-[10px] font-bold uppercase tracking-wider text-[#7f9188]">Chuva</p><p className="text-sm font-bold text-white">{daily.weather ? `${daily.weather.precipitationProbability}% · ${daily.weather.precipitationMm.toFixed(1)} mm` : "—"}</p></div></div>
    </div>
    <p className="flex items-center gap-1.5 text-[11px] text-[#7f9188]"><MapPin size={13}/>{farm ? `${farm.name} · Open-Meteo nas coordenadas da exploração` : "A previsão será apresentada após cadastrar uma exploração."}{daily.weatherError ? ` · ${daily.weatherError}` : ""}</p>
  </header>;
}
