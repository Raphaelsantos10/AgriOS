export default function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-6">

      <div className="col-span-3 h-150 rounded-2xl bg-white shadow p-6">

        <h2 className="text-3xl font-bold">
          🗺️ Mapa da Exploração
        </h2>

      </div>

      <div className="space-y-6">

        <div className="rounded-xl bg-white p-6 shadow">
          🌤️ Clima
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          🤖 IA
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          🚜 Máquinas
        </div>

      </div>

    </div>
  );
}