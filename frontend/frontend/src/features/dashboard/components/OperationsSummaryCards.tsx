import { CheckCircle2, CloudSun, Droplets, Gauge, Tractor, Wind } from "lucide-react";

export default function OperationsSummaryCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
      <article className="rounded-2xl border border-white/10 bg-[#0b171a] p-5">
        <p className="text-sm font-semibold text-white">Condições atuais</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Metric icon={CloudSun} value="22°C" label="Temperatura" />
          <Metric icon={Droplets} value="58%" label="Humidade" />
          <Metric icon={Wind} value="12 km/h" label="Vento" />
        </div>
        <div className="mt-4 rounded-xl border border-[#9cdf28]/20 bg-[#9cdf28]/8 p-3 text-sm text-[#9cdf28]">
          Janela ideal para pulverização: 09:00–11:00
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-[#0b171a] p-5">
        <p className="text-sm font-semibold text-white">Índice de saúde</p>
        <div className="mt-5 flex items-center gap-5">
          <div className="grid h-24 w-24 place-items-center rounded-full border-[10px] border-[#9cdf28] bg-[#10251b]">
            <div className="text-center">
              <p className="text-2xl font-black text-white">87%</p>
              <p className="text-[10px] text-[#9aa9a2]">Saudável</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-[#b7c1bc]">
            <p>Excelente 52%</p><p>Bom 30%</p><p>Atenção 12%</p><p>Crítico 6%</p>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-[#0b171a] p-5">
        <p className="text-sm font-semibold text-white">Atividades de hoje</p>
        <div className="mt-4 space-y-3 text-sm">
          <Activity time="08:00" label="Pulverização" detail="Talhão Norte" />
          <Activity time="10:00" label="Irrigação" detail="Talhão Leste" />
          <Activity time="14:00" label="Adubação" detail="Talhão Sul" />
          <Activity time="16:30" label="Manutenção" detail="Máquina 03" />
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-[#0b171a] p-5">
        <p className="text-sm font-semibold text-white">Máquinas em operação</p>
        <div className="mt-5 flex items-center gap-5">
          <div className="grid h-24 w-24 place-items-center rounded-full border-[10px] border-[#6ba51b] bg-[#10251b]">
            <div className="text-center"><p className="text-3xl font-black text-white">8</p><p className="text-[10px] text-[#9aa9a2]">Total</p></div>
          </div>
          <div className="space-y-3 text-sm text-[#b7c1bc]">
            <p className="flex items-center gap-2"><Tractor size={15} className="text-[#9cdf28]" /> Operando 6</p>
            <p className="flex items-center gap-2"><Gauge size={15} className="text-[#f1b82d]" /> Paradas 1</p>
            <p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-[#ff6b48]" /> Manutenção 1</p>
          </div>
        </div>
      </article>
    </div>
  );
}

function Metric({ icon: Icon, value, label }: { icon: typeof CloudSun; value: string; label: string }) {
  return <div><Icon className="mx-auto text-[#9cdf28]" size={20} /><p className="mt-2 font-bold text-white">{value}</p><p className="mt-1 text-[10px] text-[#84938d]">{label}</p></div>;
}

function Activity({ time, label, detail }: { time: string; label: string; detail: string }) {
  return <div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-[#dfe7e3]">{label}</p><p className="text-xs text-[#84938d]">{detail}</p></div><span className="text-xs text-[#84938d]">{time}</span></div>;
}
