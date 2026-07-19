type Props = {
  farms: number;
  fields: number;
  area: number;
};

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-[#a8b5af]">
        <span>{label}</span>
        <span className="font-bold text-white">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-white/8">
        <div className="h-full rounded-full bg-gradient-to-r from-[#5f9912] to-[#9cdf28]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function LivingFarmScore({ farms, fields, area }: Props) {
  const dataCompleteness = Math.min(96, 48 + fields * 5 + farms * 3);
  const score = Math.round((84 + 79 + 81 + dataCompleteness) / 4);

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0b171a] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9cdf28]">Living Farm</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-black text-white">{score}</p>
          <p className="text-sm text-[#8d9c95]">Índice operacional preliminar</p>
        </div>
        <div className="text-right text-xs text-[#8d9c95]">
          <p>{farms} exploração(ões)</p>
          <p>{fields} talhão(ões)</p>
          <p>{area.toFixed(1)} ha</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        <Metric label="Solo e ambiente" value={84} />
        <Metric label="Água e rega" value={79} />
        <Metric label="Resiliência operacional" value={81} />
        <Metric label="Completude dos dados" value={dataCompleteness} />
      </div>
      <p className="mt-4 text-[11px] leading-5 text-[#718079]">
        Este índice é interno e demonstrativo. Será substituído gradualmente por dados reais dos motores ambiental, hídrico, incêndio e biodiversidade.
      </p>
    </section>
  );
}
