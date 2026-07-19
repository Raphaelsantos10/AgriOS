import { useState } from "react";
import {
  LocateFixed,
  MapPin,
  Navigation,
  X,
} from "lucide-react";

import type { Farm } from "../types/farm";
import type { FarmInput } from "../services/farmsService";

import LocationPickerMap from "./LocationPickerMap";

interface Props {
  open: boolean;
  editingFarm?: Farm | null;
  onClose: () => void;
  onCreateFarm: (farm: FarmInput) => Promise<void> | void;
  onUpdateFarm?: (farm: Farm) => Promise<void> | void;
}

export default function FarmDrawer(props: Props) {
  if (!props.open) {
    return null;
  }

  return (
    <FarmDrawerContent
      key={props.editingFarm?.id ?? "new-farm"}
      {...props}
    />
  );
}

function FarmDrawerContent({
  editingFarm,
  onClose,
  onCreateFarm,
  onUpdateFarm,
}: Props) {
  const isEditing = Boolean(editingFarm);

  const [name, setName] = useState(
    editingFarm?.name ?? ""
  );

  const [owner, setOwner] = useState(
    editingFarm?.owner ?? ""
  );

  const [area, setArea] = useState(
    editingFarm ? String(editingFarm.area) : ""
  );

  const [crop, setCrop] = useState(
    editingFarm?.crop ?? "Milho"
  );

  const [latitude, setLatitude] = useState(
    Number(editingFarm?.latitude ?? 41.1496)
  );

  const [longitude, setLongitude] = useState(
    Number(editingFarm?.longitude ?? -8.6109)
  );

  const [accuracy, setAccuracy] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [locating, setLocating] =
    useState(false);

  function handleLocationChange(
    newLatitude: number,
    newLongitude: number
  ) {
    setLatitude(
      Number(newLatitude.toFixed(7))
    );

    setLongitude(
      Number(newLongitude.toFixed(7))
    );
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      alert(
        "O navegador não suporta geolocalização."
      );

      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationChange(
          position.coords.latitude,
          position.coords.longitude
        );

        setAccuracy(
          position.coords.accuracy
        );

        setLocating(false);
      },

      (error) => {
        console.error(
          "GEOLOCATION ERROR:",
          error
        );

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          alert(
            "A permissão de localização foi recusada. Autorize a localização nas definições do navegador."
          );
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          alert(
            "A localização atual não está disponível."
          );
        } else if (
          error.code === error.TIMEOUT
        ) {
          alert(
            "A localização demorou demasiado tempo a responder."
          );
        } else {
          alert(
            "Não foi possível obter a localização atual."
          );
        }

        setLocating(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  async function handleSubmit() {
    const numericArea = Number(area);

    if (!name.trim()) {
      alert(
        "Preencha o nome da exploração."
      );

      return;
    }

    if (!owner.trim()) {
      alert(
        "Preencha o nome do proprietário."
      );

      return;
    }

    if (
      !Number.isFinite(numericArea) ||
      numericArea <= 0
    ) {
      alert(
        "Indique uma área válida."
      );

      return;
    }

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      alert(
        "Selecione uma localização válida."
      );

      return;
    }

    try {
      setLoading(true);

      const farmData: FarmInput = {
        name: name.trim(),
        owner: owner.trim(),
        area: numericArea,
        crop,
        latitude,
        longitude,
      };

      if (editingFarm) {
        if (!onUpdateFarm) {
          throw new Error(
            "A função de atualização não foi fornecida."
          );
        }

        await onUpdateFarm({
          ...editingFarm,
          ...farmData,
        });
      } else {
        await onCreateFarm(farmData);
      }

      onClose();
    } catch (error) {
      console.error(
        "FARM SAVE ERROR:",
        error
      );

      alert(
        isEditing
          ? "Não foi possível atualizar a exploração."
          : "Não foi possível criar a exploração."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-9999 bg-black/50">
      <div className="absolute right-0 top-0 flex h-screen w-full max-w-2xl flex-col bg-slate-50 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isEditing
                ? "Editar Exploração"
                : "Nova Exploração"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Atualize os dados e a localização da propriedade."
                : "Preencha os dados e confirme a localização no mapa."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <X />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              Dados da exploração
            </h3>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Nome da exploração
                </label>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 caret-green-700 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                  placeholder="Ex.: Quinta Vale Verde"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Proprietário
                </label>

                <input
                  value={owner}
                  onChange={(event) =>
                    setOwner(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 caret-green-700 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                  placeholder="Ex.: Raphael Soares"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Área declarada (ha)
                </label>

                <input
                  value={area}
                  onChange={(event) =>
                    setArea(event.target.value)
                  }
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 caret-green-700 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                  placeholder="Ex.: 11.5"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Cultura principal
                </label>

                <select
                  value={crop}
                  onChange={(event) =>
                    setCrop(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
                >
                  <option>Milho</option>
                  <option>Trigo</option>
                  <option>Vinha</option>
                  <option>Olival</option>
                  <option>Batata</option>
                  <option>Amêndoa</option>
                  <option>Castanha</option>
                  <option>Outra</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <MapPin className="text-green-700" />
                  Localização da exploração
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Clique no mapa ou arraste o marcador até ao local exato.
                </p>
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locating}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {locating ? (
                  <LocateFixed
                    className="animate-pulse"
                    size={18}
                  />
                ) : (
                  <Navigation size={18} />
                )}

                {locating
                  ? "A localizar..."
                  : "Usar localização atual"}
              </button>
            </div>

            {accuracy !== null && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Precisão estimada: aproximadamente{" "}
                <strong>
                  {Math.round(accuracy)} metros
                </strong>
                . Ajuste o marcador no mapa.
              </div>
            )}

            <div className="mt-5">
              <LocationPickerMap
                latitude={latitude}
                longitude={longitude}
                onLocationChange={
                  handleLocationChange
                }
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Latitude
                </label>

                <input
                  value={latitude}
                  onChange={(event) =>
                    setLatitude(
                      Number(event.target.value)
                    )
                  }
                  type="number"
                  step="any"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 caret-green-700 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Longitude
                </label>

                <input
                  value={longitude}
                  onChange={(event) =>
                    setLongitude(
                      Number(event.target.value)
                    )
                  }
                  type="number"
                  step="any"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 caret-green-700 outline-none focus:border-green-600"
                />
              </div>
            </div>
          </section>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || locating}
            className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "A guardar..."
              : isEditing
                ? "Guardar Alterações"
                : "Criar Exploração"}
          </button>
        </footer>
      </div>
    </div>
  );
}