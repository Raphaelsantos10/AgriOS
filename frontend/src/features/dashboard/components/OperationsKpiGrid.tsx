import { BrainCircuit, CloudSun, Coins, RadioTower, Satellite, ShieldCheck, Tractor } from "lucide-react";
import StatCard from "./StatCard";

const items = [
  { label: "Satélites", value: "3", meta: "Online", icon: Satellite, trend: "up" as const, progress: 92 },
  { label: "Sensores", value: "123", meta: "98% ativos", icon: RadioTower, trend: "up" as const, progress: 98 },
  { label: "Máquinas", value: "8", meta: "6 operando", icon: Tractor, trend: "neutral" as const, progress: 75 },
  { label: "IA", value: "3", meta: "Recomendações", icon: BrainCircuit, trend: "neutral" as const, progress: 64 },
  { label: "Clima", value: "Ideal", meta: "Pulverização", icon: CloudSun, trend: "up" as const, progress: 84 },
  { label: "Saúde geral", value: "87%", meta: "+4% esta semana", icon: ShieldCheck, trend: "up" as const, progress: 87 },
  { label: "Custos hoje", value: "€2.156", meta: "↓ 8% vs. ontem", icon: Coins, trend: "down" as const, progress: 58 },
];

export default function OperationsKpiGrid() {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">{items.map((item) => <StatCard key={item.label} {...item} />)}</div>;
}
