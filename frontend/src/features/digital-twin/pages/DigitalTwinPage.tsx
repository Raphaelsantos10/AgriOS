import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, ScanLine } from "lucide-react";

import { getFarms } from "../../farms/services/farmsService";
import type { Farm } from "../../farms/types/farm";
import { getFieldsByFarm } from "../../fields/services/fieldsService";
import type { Field } from "../../fields/types/field";
import MapView from "../../maps/components/MapView";
import DigitalTwinLayersPanel from "../components/DigitalTwinLayersPanel";
import DigitalTwinTimeline from "../components/DigitalTwinTimeline";
import LivingFarmScore from "../components/LivingFarmScore";
import type { DigitalTwinLayer, DigitalTwinLayerId } from "../types/digitalTwin";

const initialLayers: DigitalTwinLayer[] = [
  { id: "fields", label: "Talhões", description: "Geometrias e culturas", enabled: true, available: true },
  { id: "irrigation", label: "Rega", description: "Sistemas e eventos", enabled: true, available: true },
  { id: "fire", label: "Incêndio", description: "Avaliações de risco", enabled: true, available: true },
  { id: "photos", label: "Fotografias", description: "Memória georreferenciada", enabled: false, available: false },
  { id: "biodiversity", label: "Biodiversidade", description: "Habitats e observações", enabled: false, available: false },
  { id: "sensors", label: "Sensores IoT", description: "Leituras em tempo real", enabled: false, available: false },
  { id: "machines", label: "Máquinas", description: "Localização e telemetria", enabled: false, available: false },
  { id: "satellite", label: "Satélite", description: "NDVI e comparação temporal", enabled: false, available: false },
];

export default function DigitalTwinPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [layers, setLayers] = useState(initialLayers);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const farmData = await getFarms();
      const fieldGroups = await Promise.all(farmData.map((farm) => getFieldsByFarm(farm.id)));
      setFarms(farmData);
      setFields(fieldGroups.flat());
    } catch (loadError) {
      console.error("DIGITAL TWIN LOAD ERROR:", loadError);
      setError("Não foi possível carregar os dados do gémeo digital.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(id);
  }, [load]);

  function toggleLayer(id: DigitalTwinLayerId) {
    setLayers((current) =>
      current.map((layer) =>
        layer.id === id && layer.available ? { ...layer, enabled: !layer.enabled } : layer,
      ),
    );
  }

  const visibleFields = layers.find((layer) => layer.id === "fields")?.enabled ? fields : [];
  const totalArea = useMemo(() => fields.reduce((sum, field) => sum + Number(field.area || 0), 0), [fields]);

  return (
    <section className="-m-4 min-h-full space-y-4 bg-[radial-gradient(circle_at_top_right,rgba(156,223,40,0.08),transparent_26%),#061014] p-4 text-white md:-m-6 md:p-6 xl:-m-7 xl:p-7">
      <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9cdf28]">Digital Twin · Fundação V1</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Gémeo Digital da Exploração</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#9aa9a2]">
            Uma visão operacional única para talhões, rega, risco, sensores, fotografias e futuras imagens de satélite.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-[#c0cbc6] transition hover:bg-white/10 hover:text-white"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Atualizar gémeo
        </button>
      </header>

      {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      <div className="grid gap-4 2xl:grid-cols-[320px_minmax(0,1fr)_310px]">
        <DigitalTwinLayersPanel layers={layers} onToggle={toggleLayer} />

        <div className="relative min-h-[650px] overflow-hidden rounded-3xl border border-white/10 bg-[#0b171a] shadow-[0_26px_80px_rgba(0,0,0,0.30)]">
          <div className="absolute left-5 top-5 z-[500] flex items-center gap-3 rounded-2xl border border-white/10 bg-[#071215]/92 px-4 py-3 backdrop-blur">
            <ScanLine size={19} className="text-[#9cdf28]" />
            <div>
              <p className="text-sm font-black text-white">Mapa vivo</p>
              <p className="text-[10px] text-[#84938d]">{loading ? "A sincronizar…" : `${fields.length} talhão(ões) sincronizado(s)`}</p>
            </div>
          </div>
          <div className="h-[650px] min-h-[650px]">
            <MapView farms={farms} fields={visibleFields} />
          </div>
        </div>

        <LivingFarmScore farms={farms.length} fields={fields.length} area={totalArea} />
      </div>

      <DigitalTwinTimeline date={date} onChange={setDate} />
    </section>
  );
}
