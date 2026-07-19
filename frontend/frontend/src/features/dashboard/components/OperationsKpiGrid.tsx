import {
  BrainCircuit,
  CloudSun,
  Coins,
  RadioTower,
  Satellite,
  ShieldCheck,
  Tractor,
} from "lucide-react";

const items = [
  { label: "Satélites", value: "3", meta: "Online", icon: Satellite },
  { label: "Sensores", value: "123", meta: "Ativos", icon: RadioTower },
  { label: "Máquinas", value: "8", meta: "Operando", icon: Tractor },
  { label: "IA", value: "3", meta: "Recomendações", icon: BrainCircuit },
  { label: "Clima", value: "Janela ideal", meta: "Pulverização", icon: CloudSun },
  { label: "Saúde geral", value: "87%", meta: "Boa", icon: ShieldCheck },
  { label: "Custos hoje", value: "€2.156", meta: "↓ 8% vs ontem", icon: Coins },
];

export default function OperationsKpiGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
      {items.map(({ label, value, meta, icon: Icon }) => (
        <article
          key={label}
          className="rounded-2xl border border-white/10 bg-[#0b171a]/95 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-[#9cdf28]/25 bg-[#9cdf28]/10 p-2.5 text-[#9cdf28]">
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#84938d]">
                {label}
              </p>
              <p className="mt-1 truncate text-xl font-bold text-white">{value}</p>
              <p className="mt-1 text-xs font-semibold text-[#9cdf28]">{meta}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
