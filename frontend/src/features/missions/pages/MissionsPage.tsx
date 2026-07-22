import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, Clock3, Plus, TriangleAlert } from "lucide-react";
import type { Farm } from "../../farms/types/farm";
import { getFarms } from "../../farms/services/farmsService";
import type { Field } from "../../fields/types/field";
import { getFieldsByFarm } from "../../fields/services/fieldsService";
import MissionCard from "../components/MissionCard";
import MissionDetailsPanel from "../components/MissionDetailsPanel";
import MissionDrawer from "../components/MissionDrawer";
import MissionFilters from "../components/MissionFilters";
import { createMission, deleteMission, getMissions, updateMission, updateMissionStatus } from "../services/missionsService";
import type { Mission, MissionInput, MissionPriority, MissionStatus } from "../types/mission";
import { Button, Card, EmptyState, LoadingState, PageHeader } from "../../../design-system";

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MissionStatus | "all">("all");
  const [priority, setPriority] = useState<MissionPriority | "all">("all");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [missionData, farmData] = await Promise.all([getMissions(), getFarms()]);
        const fieldGroups = await Promise.all(farmData.map((farm) => getFieldsByFarm(farm.id)));
        if (!active) return;
        setMissions(missionData);
        setFarms(farmData);
        setFields(fieldGroups.flat());
      } catch (error) {
        console.error("MISSIONS LOAD ERROR:", error);
        if (active) alert("Não foi possível carregar o Centro de Missões. Confirme se a tabela missions foi criada no Supabase.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return missions.filter((mission) => {
      const matchesSearch = !term || mission.title.toLowerCase().includes(term) || mission.description?.toLowerCase().includes(term) || mission.assigned_to?.toLowerCase().includes(term);
      return matchesSearch && (status === "all" || mission.status === status) && (priority === "all" || mission.priority === priority);
    });
  }, [missions, priority, search, status]);

  const stats = useMemo(() => ({
    total: missions.length,
    pending: missions.filter((item) => item.status === "new" || item.status === "paused").length,
    active: missions.filter((item) => item.status === "in_progress").length,
    completed: missions.filter((item) => item.status === "completed").length,
    critical: missions.filter((item) => item.priority === "critical" && item.status !== "completed" && item.status !== "cancelled").length,
  }), [missions]);

  async function handleSave(input: MissionInput, existing?: Mission) {
    if (existing) {
      const updated = await updateMission({ ...existing, ...input, completed_at: input.completed_at ?? null });
      setMissions((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSelectedMission((current) => current?.id === updated.id ? updated : current);
    } else {
      const created = await createMission(input);
      setMissions((current) => [created, ...current]);
    }
  }

  async function handleStatusChange(mission: Mission, nextStatus: MissionStatus) {
    try {
      const updated = await updateMissionStatus(mission, nextStatus);
      setMissions((current) => current.map((item) => item.id === updated.id ? updated : item));
      setSelectedMission(updated);
    } catch (error) {
      console.error("MISSION STATUS ERROR:", error);
      alert("Não foi possível atualizar o estado.");
    }
  }

  async function handleDelete(mission: Mission) {
    if (!confirm(`Eliminar a missão “${mission.title}”?`)) return;
    try {
      await deleteMission(mission.id);
      setMissions((current) => current.filter((item) => item.id !== mission.id));
      setSelectedMission(null);
    } catch (error) {
      console.error("MISSION DELETE ERROR:", error);
      alert("Não foi possível eliminar a missão.");
    }
  }

  const cards = [
    { label: "Total", value: stats.total, icon: ClipboardCheck, className: "bg-slate-100 text-slate-700" },
    { label: "Pendentes", value: stats.pending, icon: Clock3, className: "bg-amber-100 text-amber-700" },
    { label: "Em andamento", value: stats.active, icon: ClipboardCheck, className: "bg-blue-100 text-blue-700" },
    { label: "Concluídas", value: stats.completed, icon: CheckCircle2, className: "bg-green-100 text-green-700" },
    { label: "Críticas", value: stats.critical, icon: TriangleAlert, className: "bg-red-100 text-red-700" },
  ];

  return (
    <section className="space-y-6">
      <PageHeader eyebrow="Operações agrícolas" title="Centro de Missões" description="Planeie, acompanhe e conclua operações agrícolas ligadas ao mapa." actions={<Button onClick={() => { setEditingMission(null); setDrawerOpen(true); }}><Plus size={19}/> Nova missão</Button>}/>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, className }) => (
          <Card key={label} className="p-5">
            <div className={`inline-flex rounded-xl p-3 ${className}`}><Icon size={21} /></div>
            <p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          </Card>
        ))}
      </div>

      <MissionFilters search={search} status={status} priority={priority} onSearchChange={setSearch} onStatusChange={setStatus} onPriorityChange={setPriority} />

      {loading ? <LoadingState label="A carregar missões…"/> : filtered.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="Nenhuma missão encontrada" description="Crie a primeira missão ou altere os filtros." actionLabel="Criar missão" onAction={() => { setEditingMission(null); setDrawerOpen(true); }}/>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((mission) => <MissionCard key={mission.id} mission={mission} farm={farms.find((farm) => farm.id === mission.farm_id)} field={fields.find((field) => field.id === mission.field_id)} onOpen={setSelectedMission} />)}
        </div>
      )}

      <MissionDrawer open={drawerOpen} mission={editingMission} farms={farms} fields={fields} onClose={() => setDrawerOpen(false)} onSave={handleSave} />
      <MissionDetailsPanel mission={selectedMission} farm={farms.find((farm) => farm.id === selectedMission?.farm_id)} field={fields.find((field) => field.id === selectedMission?.field_id)} onClose={() => setSelectedMission(null)} onEdit={(mission) => { setEditingMission(mission); setDrawerOpen(true); }} onStatusChange={handleStatusChange} onDelete={handleDelete} />
    </section>
  );
}
