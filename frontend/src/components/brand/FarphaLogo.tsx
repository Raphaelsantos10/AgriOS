import { farphaSymbolOfficialDark } from "../../assets/brand";

type FarphaLogoProps = { compact?: boolean; className?: string; eager?: boolean; inverse?: boolean; prominent?: boolean };

export default function FarphaLogo({ compact = false, className = "", eager = false, inverse = false, prominent = false }: FarphaLogoProps) {
  return (
    <span role="img" aria-label={compact ? "Símbolo FARPHA" : "FARPHA — Intelligence for Agriculture"} className={`inline-flex shrink-0 items-center gap-2.5 text-left ${className}`}>
      <span className="grid aspect-square h-full min-h-8 shrink-0 overflow-hidden rounded-[28%] bg-[#06100c] shadow-sm"><img src={farphaSymbolOfficialDark} alt="" loading={eager ? "eager" : "lazy"} className="h-full w-full scale-[1.55] object-cover object-center"/></span>
      {!compact && <span className="leading-none"><strong className={`block whitespace-nowrap font-black tracking-[-.035em] ${prominent ? "text-3xl" : "text-[18px]"} ${inverse ? "text-white" : "text-[#173c2a]"}`}>FARPHA</strong><small className={`mt-1 block whitespace-nowrap font-bold uppercase tracking-[.14em] ${prominent ? "text-[9px]" : "text-[7px]"} ${inverse ? "text-emerald-100/55" : "text-[#60806b]"}`}>Intelligence for Agriculture</small></span>}
    </span>
  );
}
