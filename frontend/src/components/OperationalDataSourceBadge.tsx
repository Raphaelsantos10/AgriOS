import { Cloud, HardDrive } from "lucide-react";

export default function OperationalDataSourceBadge({ source }: { source: "supabase" | "local" }) {
  const remote = source === "supabase";
  const Icon = remote ? Cloud : HardDrive;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-extrabold ${
        remote
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-amber-200 bg-amber-50 text-amber-800"
      }`}
      title={remote ? "Dados protegidos por utilizador no Supabase" : "Dados disponíveis apenas neste navegador"}
    >
      <Icon size={14} />
      {remote ? "Supabase · sincronizado" : "Modo local · este dispositivo"}
    </span>
  );
}
