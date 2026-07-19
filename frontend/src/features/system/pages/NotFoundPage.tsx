import { ArrowLeft, Home, MapPinned } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-green-700">
          Erro 404
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          Página não encontrada
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-600">
          O endereço pode estar incorreto, a página pode ter sido movida ou este
          módulo ainda não está disponível nesta versão da plataforma.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            <Home size={18} />
            Ir para o Dashboard
          </Link>

          <Link
            to="/exploracoes"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <MapPinned size={18} />
            Ver explorações
          </Link>
        </div>
      </div>
    </section>
  );
}
