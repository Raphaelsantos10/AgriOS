import { useState } from "react";
import { MapPin, X } from "lucide-react";
import type { Farm } from "../types/farm";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreateFarm: (farm: Farm) => Promise<void> | void;
}

export default function FarmDrawer({ open, onClose, onCreateFarm }: Props) {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [area, setArea] = useState("");
  const [crop, setCrop] = useState("Milho");
  const [latitude, setLatitude] = useState("41.1496");
  const [longitude, setLongitude] = useState("-8.6109");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit() {
    if (!name || !owner || !area || !latitude || !longitude) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);

      await onCreateFarm({
        id: crypto.randomUUID(),
        name,
        owner,
        area: Number(area),
        crop,
        latitude: Number(latitude),
        longitude: Number(longitude),
      });

      setName("");
      setOwner("");
      setArea("");
      setCrop("Milho");
      setLatitude("41.1496");
      setLongitude("-8.6109");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao guardar exploração no Supabase.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <div className="absolute right-0 top-0 h-screen w-[480px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Nova Exploração
            </h2>
            <p className="text-sm text-slate-500">
              Cadastre uma propriedade agrícola.
            </p>
          </div>

          <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="text-sm font-semibold">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-green-600"
              placeholder="Ex: Monte São"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Proprietário</label>
            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-green-600"
              placeholder="Ex: Raphael Soares"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Área (ha)</label>
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              type="number"
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-green-600"
              placeholder="Ex: 11"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Cultura</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-green-600"
            >
              <option>Milho</option>
              <option>Trigo</option>
              <option>Vinha</option>
              <option>Olival</option>
            </select>
          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
            <div className="mb-3 flex items-center gap-2 font-semibold text-green-800">
              <MapPin size={18} />
              Localização
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Latitude
                </label>
                <input
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Longitude
                </label>
                <input
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-green-600"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-green-700 py-4 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
          >
            {loading ? "A guardar..." : "Guardar Exploração"}
          </button>
        </div>
      </div>
    </div>
  );
}