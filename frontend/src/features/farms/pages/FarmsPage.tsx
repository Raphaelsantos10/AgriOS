export default function FarmsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Explorações
        </h1>

        <p className="mt-1 text-slate-500">
          Cadastre e gerencie as propriedades agrícolas.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Nova Exploração
        </h2>

        <p className="mt-2 text-slate-500">
          Em breve poderá criar propriedades, definir localização no mapa e adicionar talhões.
        </p>

        <button className="mt-6 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800">
          + Criar Exploração
        </button>
      </div>
    </section>
  );
}