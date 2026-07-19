import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Sprout,
} from "lucide-react";
import type { Farm } from "../../farms/types/farm";
import { getFarms } from "../../farms/services/farmsService";
import type { Field } from "../../fields/types/field";
import { getFieldsByFarm } from "../../fields/services/fieldsService";
import MissionDrawer from "../../missions/components/MissionDrawer";
import MissionDetailsPanel from "../../missions/components/MissionDetailsPanel";
import {
  createMission,
  deleteMission,
  getMissions,
  updateMission,
  updateMissionStatus,
} from "../../missions/services/missionsService";
import type {
  Mission,
  MissionInput,
  MissionStatus,
} from "../../missions/types/mission";
import {
  buildMonthGrid,
  formatMonthTitle,
  toDateKey,
} from "../utils/calendar";

const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function priorityClass(priority: Mission["priority"]) {
  if (priority === "critical") return "border-rose-200 bg-rose-50 text-rose-700";
  if (priority === "high") return "border-orange-200 bg-orange-50 text-orange-700";
  if (priority === "medium") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function startOfSelectedDay(date: Date) {
  const value = new Date(date);
  value.setHours(8, 0, 0, 0);
  return value.toISOString();
}

export default function AgriculturalCalendarPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [missionData, farmData] = await Promise.all([getMissions(), getFarms()]);
        const fieldGroups = await Promise.all(
          farmData.map((farm) => getFieldsByFarm(farm.id)),
        );
        if (!active) return;
        setMissions(missionData);
        setFarms(farmData);
        setFields(fieldGroups.flat());
      } catch (error) {
        console.error("CALENDAR LOAD ERROR:", error);
        if (active) {
          alert("Não foi possível carregar o calendário agrícola.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const calendarDays = useMemo(
    () => buildMonthGrid(month, missions),
    [missions, month],
  );

  const selectedDayMissions = useMemo(() => {
    const selectedKey = toDateKey(selectedDay);
    return missions
      .filter(
        (mission) =>
          mission.start_date && toDateKey(new Date(mission.start_date)) === selectedKey,
      )
      .sort((a, b) =>
        (a.start_date ?? "").localeCompare(b.start_date ?? ""),
      );
  }, [missions, selectedDay]);

  const monthStats = useMemo(() => {
    const monthMissions = missions.filter((mission) => {
      if (!mission.start_date) return false;
      const date = new Date(mission.start_date);
      return (
        date.getMonth() === month.getMonth() &&
        date.getFullYear() === month.getFullYear()
      );
    });
    return {
      total: monthMissions.length,
      completed: monthMissions.filter((mission) => mission.status === "completed").length,
      active: monthMissions.filter((mission) => mission.status === "in_progress").length,
      critical: monthMissions.filter(
        (mission) =>
          mission.priority === "critical" && mission.status !== "completed",
      ).length,
    };
  }, [missions, month]);

  function changeMonth(offset: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function openNewMission(date = selectedDay) {
    const defaultFarm = farms[0];
    if (!defaultFarm) {
      alert("Crie uma exploração antes de adicionar eventos ao calendário.");
      return;
    }
    setEditingMission({
      id: "calendar-new",
      farm_id: defaultFarm.id,
      field_id: null,
      title: "",
      description: null,
      priority: "medium",
      status: "new",
      assigned_to: null,
      start_date: startOfSelectedDay(date),
      end_date: null,
      completed_at: null,
      latitude: null,
      longitude: null,
      notes: null,
      checklist: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setDrawerOpen(true);
  }

  async function handleSave(input: MissionInput, existing?: Mission) {
    if (existing && existing.id !== "calendar-new") {
      const updated = await updateMission({
        ...existing,
        ...input,
        completed_at: input.completed_at ?? null,
      });
      setMissions((current) =>
        current.map((mission) => (mission.id === updated.id ? updated : mission)),
      );
      setSelectedMission((current) =>
        current?.id === updated.id ? updated : current,
      );
      return;
    }

    const created = await createMission(input);
    setMissions((current) => [created, ...current]);
    if (created.start_date) {
      const createdDate = new Date(created.start_date);
      setSelectedDay(createdDate);
      setMonth(new Date(createdDate.getFullYear(), createdDate.getMonth(), 1));
    }
  }

  async function handleStatusChange(mission: Mission, nextStatus: MissionStatus) {
    const updated = await updateMissionStatus(mission, nextStatus);
    setMissions((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
    setSelectedMission(updated);
  }

  async function handleDelete(mission: Mission) {
    if (!confirm(`Eliminar a missão “${mission.title}”?`)) return;
    await deleteMission(mission.id);
    setMissions((current) => current.filter((item) => item.id !== mission.id));
    setSelectedMission(null);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Calendário Agrícola</h1>
          <p className="mt-1 text-slate-500">
            Planeie missões, operações e atividades por exploração e talhão.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openNewMission()}
          className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800"
        >
          <Plus size={19} /> Nova atividade
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {([
          { label: "Atividades no mês", value: monthStats.total, icon: CalendarDays },
          { label: "Em andamento", value: monthStats.active, icon: Clock3 },
          { label: "Concluídas", value: monthStats.completed, icon: Sprout },
          { label: "Críticas", value: monthStats.critical, icon: Sprout },
        ] satisfies Array<{ label: string; value: number; icon: LucideIcon }>).map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Icon size={22} className="text-green-700" />
            <p className="mt-4 text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => changeMonth(-1)} className="rounded-xl p-2 hover:bg-slate-100"><ChevronLeft /></button>
              <button type="button" onClick={() => changeMonth(1)} className="rounded-xl p-2 hover:bg-slate-100"><ChevronRight /></button>
              <button type="button" onClick={() => { const today = new Date(); setMonth(today); setSelectedDay(today); }} className="ml-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700">Hoje</button>
            </div>
            <h2 className="text-xl font-bold capitalize text-slate-900">{formatMonthTitle(month)}</h2>
          </header>

          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {weekdays.map((weekday) => <div key={weekday} className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">{weekday}</div>)}
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">A carregar calendário...</div>
          ) : (
            <div className="grid grid-cols-7">
              {calendarDays.map((day) => {
                const selected = day.key === toDateKey(selectedDay);
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => setSelectedDay(day.date)}
                    onDoubleClick={() => openNewMission(day.date)}
                    className={`min-h-32 border-b border-r border-slate-100 p-2 text-left align-top transition hover:bg-green-50/50 ${selected ? "bg-green-50 ring-2 ring-inset ring-green-500" : ""} ${day.isCurrentMonth ? "bg-white" : "bg-slate-50/70"}`}
                  >
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${day.isToday ? "bg-green-700 text-white" : day.isCurrentMonth ? "text-slate-700" : "text-slate-400"}`}>{day.date.getDate()}</div>
                    <div className="mt-2 space-y-1">
                      {day.missions.slice(0, 3).map((mission) => (
                        <div key={mission.id} className={`truncate rounded-lg border px-2 py-1 text-xs font-semibold ${priorityClass(mission.priority)}`}>{mission.title}</div>
                      ))}
                      {day.missions.length > 3 && <p className="px-1 text-xs font-bold text-slate-500">+{day.missions.length - 3} atividades</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Dia selecionado</p>
              <h2 className="text-xl font-bold capitalize text-slate-900">{new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "2-digit", month: "long" }).format(selectedDay)}</h2>
            </div>
            <button type="button" onClick={() => openNewMission(selectedDay)} className="rounded-xl bg-green-50 p-2 text-green-700 hover:bg-green-100"><Plus /></button>
          </div>

          <div className="mt-5 space-y-3">
            {selectedDayMissions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">Nenhuma atividade marcada para este dia.</div>
            ) : selectedDayMissions.map((mission) => (
              <button key={mission.id} type="button" onClick={() => setSelectedMission(mission)} className="w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-green-300 hover:bg-green-50/40">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-slate-900">{mission.title}</p>
                  <span className={`rounded-full border px-2 py-1 text-xs font-bold ${priorityClass(mission.priority)}`}>{mission.priority}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{mission.start_date ? new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit" }).format(new Date(mission.start_date)) : "Sem horário"}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{mission.status.replaceAll("_", " ")}</p>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <MissionDrawer
        open={drawerOpen}
        mission={editingMission}
        farms={farms}
        fields={fields}
        onClose={() => { setDrawerOpen(false); setEditingMission(null); }}
        onSave={handleSave}
      />
      <MissionDetailsPanel
        mission={selectedMission}
        farm={farms.find((farm) => farm.id === selectedMission?.farm_id)}
        field={fields.find((field) => field.id === selectedMission?.field_id)}
        onClose={() => setSelectedMission(null)}
        onEdit={(mission) => { setEditingMission(mission); setDrawerOpen(true); }}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </section>
  );
}
