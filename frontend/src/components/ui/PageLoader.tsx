export default function PageLoader() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="A carregar página"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-green-100" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-green-700" />
        </div>

        <div className="text-center">
          <p className="font-semibold text-slate-800">A carregar módulo</p>
          <p className="mt-1 text-sm text-slate-500">
            A preparar os dados da plataforma…
          </p>
        </div>
      </div>
    </div>
  );
}
