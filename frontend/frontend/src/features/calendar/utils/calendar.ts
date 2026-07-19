import type { Mission } from "../../missions/types/mission";

export interface CalendarDay {
  date: Date;
  key: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  missions: Mission[];
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildMonthGrid(month: Date, missions: Mission[]): CalendarDay[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const mondayIndex = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - mondayIndex);

  const missionsByDay = new Map<string, Mission[]>();
  for (const mission of missions) {
    if (!mission.start_date) continue;
    const key = toDateKey(new Date(mission.start_date));
    const current = missionsByDay.get(key) ?? [];
    current.push(mission);
    missionsByDay.set(key, current);
  }

  const todayKey = toDateKey(new Date());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = toDateKey(date);
    return {
      date,
      key,
      isCurrentMonth: date.getMonth() === month.getMonth(),
      isToday: key === todayKey,
      missions: missionsByDay.get(key) ?? [],
    };
  });
}

export function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    month: "long",
    year: "numeric",
  }).format(date);
}
