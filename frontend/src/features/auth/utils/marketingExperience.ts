export type JourneyStage = {
  id: "observe" | "plan" | "execute" | "prove";
  number: string;
  label: string;
  title: string;
  text: string;
  action: string;
};

export type FarphaPlan = "Free" | "Plus" | "Pro";
export const SELECTED_PLAN_KEY = "farpha-selected-plan";

export function saveSelectedPlan(storage: Pick<Storage, "setItem" | "removeItem">, plan?: FarphaPlan) {
  if (plan) storage.setItem(SELECTED_PLAN_KEY, plan);
  else storage.removeItem(SELECTED_PLAN_KEY);
}

export function readSelectedPlan(storage: Pick<Storage, "getItem">): FarphaPlan | undefined {
  const value = storage.getItem(SELECTED_PLAN_KEY);
  return value === "Free" || value === "Plus" || value === "Pro" ? value : undefined;
}

export const publicNavigation = [
  { label: "Soluções", href: "#solucoes" },
  { label: "Mapa", href: "#mapa" },
  { label: "Como funciona", href: "#jornada" },
  { label: "Resultados", href: "#resultados" },
  { label: "Planos", href: "#planos" },
  { label: "Contacto", href: "#contactos" },
] as const;

export const journeyStages: JourneyStage[] = [
  { id: "observe", number: "01", label: "Observe", title: "Compreenda o que está a acontecer.", text: "Clima, solo, risco, satélite e ocorrências reunidos no contexto de cada talhão.", action: "Explorar as camadas do mapa" },
  { id: "plan", number: "02", label: "Planeie", title: "Transforme sinais em prioridades.", text: "Rega, calendário e recomendações ajudam a preparar o trabalho antes de entrar no campo.", action: "Conhecer o planeamento" },
  { id: "execute", number: "03", label: "Execute", title: "Leve a decisão até à equipa.", text: "Missões e ordens de trabalho ligam responsável, prazo, recursos, custo e localização.", action: "Ver o fluxo operacional" },
  { id: "prove", number: "04", label: "Comprove", title: "Guarde o resultado e a evidência.", text: "Custos, produtividade, documentos, rastreabilidade e obrigações permanecem organizados.", action: "Ver resultados ilustrativos" },
];

export function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function animatedResult(target: number, progress: number) {
  return Math.round(target * clampProgress(progress));
}

export function validateInteractiveDestinations(items: ReadonlyArray<{ label: string; href: string }>) {
  return items.every((item) => item.label.trim().length > 0 && /^#[a-z][a-z0-9-]*$/.test(item.href));
}
