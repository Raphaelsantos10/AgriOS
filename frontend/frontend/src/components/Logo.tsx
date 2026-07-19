import FarphaLogo from "./brand/FarphaLogo";

type LogoProps = {
  compact?: boolean;
  className?: string;
};

export default function Logo({ compact = false, className = "" }: LogoProps) {
  return (
    <FarphaLogo
      compact={compact}
      eager
      className={className || (compact ? "h-10 w-10" : "h-16 w-auto")}
    />
  );
}
