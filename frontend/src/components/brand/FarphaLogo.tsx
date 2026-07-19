import { farphaLogo, farphaSymbol } from "../../assets/brand";

type FarphaLogoProps = {
  compact?: boolean;
  className?: string;
  eager?: boolean;
};

export default function FarphaLogo({
  compact = false,
  className = "",
  eager = false,
}: FarphaLogoProps) {
  return (
    <img
      src={compact ? farphaSymbol : farphaLogo}
      alt={compact ? "Símbolo FARPHA" : "FARPHA — Intelligence for Agriculture"}
      draggable={false}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`select-none object-contain ${className}`}
    />
  );
}
