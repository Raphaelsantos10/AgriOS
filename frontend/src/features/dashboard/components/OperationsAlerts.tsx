import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

export default function OperationsAlerts() {
  return (
    <section className="grid gap-3 rounded-2xl border border-white/10 bg-[#0b171a] p-4 lg:grid-cols-[220px_1fr_1fr_1fr_auto] lg:items-center">
      <div><p className="font-bold text-white">Alertas e notificações</p><p className="mt-1 text-xs text-[#84938d]">5 atualizações</p></div>
      <Alert icon={ShieldAlert} title="Alerta crítico" text="Risco de geada nas próximas 24h" tone="text-[#ff5b4d]" />
      <Alert icon={AlertTriangle} title="Atenção" text="2 sensores com bateria baixa" tone="text-[#f1b82d]" />
      <Alert icon={Info} title="Informação" text="Nova imagem de satélite disponível" tone="text-[#39a8ff]" />
      <button type="button" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#9cdf28]/40 hover:text-[#9cdf28]">Ver todos</button>
    </section>
  );
}

function Alert({ icon: Icon, title, text, tone }: { icon: typeof Info; title: string; text: string; tone: string }) {
  return <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.025] p-3"><Icon className={tone} size={18} /><div><p className={`text-xs font-bold ${tone}`}>{title}</p><p className="mt-1 text-xs text-[#9aa9a2]">{text}</p></div></div>;
}
