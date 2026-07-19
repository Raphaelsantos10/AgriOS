type Props = {
  date: string;
  onChange: (value: string) => void;
};

export default function DigitalTwinTimeline({ date, onChange }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b171a] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9cdf28]">Linha temporal</p>
          <h2 className="mt-1 font-black text-white">Memória da exploração</h2>
        </div>
        <label className="flex items-center gap-3 text-sm text-[#a7b5ae]">
          Data de referência
          <input
            type="date"
            value={date}
            onChange={(event) => onChange(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#071215] px-3 py-2 text-white outline-none focus:border-[#9cdf28]/60"
          />
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="rounded-lg bg-[#9cdf28] px-3 py-1.5 text-xs font-black text-[#061014]">2026</span>
        <div className="relative h-2 flex-1 rounded-full bg-white/8">
          <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[#5f9912] to-[#9cdf28]" />
          <span className="absolute left-[62%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#061014] bg-[#d6a72c]" />
        </div>
        <span className="text-xs font-semibold text-[#8d9c95]">Hoje</span>
      </div>
      <p className="mt-3 text-xs text-[#718079]">
        Nesta fundação, a data prepara a interface para fotografias, eventos, satélite e histórico GIS. A filtragem temporal real será ligada progressivamente.
      </p>
    </div>
  );
}
