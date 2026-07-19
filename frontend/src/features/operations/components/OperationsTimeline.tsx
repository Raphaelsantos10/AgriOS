import { Bot, Clock3, ListChecks, RadioTower, Satellite } from "lucide-react";
import type { OperationTimelineEvent } from "../../../core/alerts";

const icons = { satellite: Satellite, sensor: RadioTower, ai: Bot, "work-order": ListChecks, irrigation: Clock3, weather: Clock3, fire: Clock3 };
const statusClass = { completed: "bg-emerald-400", running: "bg-[#9cdf28] animate-pulse", scheduled: "bg-sky-400", attention: "bg-amber-400" };

export default function OperationsTimeline({ events }: { events: OperationTimelineEvent[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#0b171a] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
      <div className="flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9cdf28]">Tempo real</p><h2 className="mt-1 text-lg font-extrabold text-white">Timeline global</h2></div><Clock3 className="text-[#718078]" size={20}/></div>
      <div className="mt-5 space-y-1">
        {events.map((event, index) => {
          const Icon = icons[event.source];
          const time = new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit" }).format(new Date(event.occurredAt));
          return <div key={event.id} className="relative flex gap-3 pb-4 last:pb-0">{index < events.length - 1 && <span className="absolute left-[19px] top-10 h-[calc(100%-20px)] w-px bg-white/10"/>}<span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-[#9cdf28]"><Icon size={17}/><span className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full ring-2 ring-[#0b171a] ${statusClass[event.status]}`}/></span><span className="min-w-0 flex-1 pt-0.5"><span className="flex items-center justify-between gap-3"><span className="truncate text-sm font-bold text-white">{event.title}</span><span className="text-[10px] font-semibold text-[#738079]">{time}</span></span><span className="mt-1 block text-xs text-[#8b9992]">{event.description}</span></span></div>;
        })}
      </div>
    </section>
  );
}
