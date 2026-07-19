import FarphaLogo from "../brand/FarphaLogo";

export default function PageLoader() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="A carregar página"
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative">
          <span className="absolute inset-2 animate-ping rounded-full bg-[#b6e83e]/20" />
          <FarphaLogo
            compact
            eager
            className="relative h-20 w-20 rounded-3xl object-cover shadow-[0_0_34px_rgba(182,232,62,0.20)]"
          />
        </div>

        <div>
          <p className="font-semibold text-[#173321]">A carregar módulo FARPHA</p>
          <p className="mt-1 text-sm text-[#718078]">
            A preparar os dados da plataforma…
          </p>
        </div>
      </div>
    </div>
  );
}
