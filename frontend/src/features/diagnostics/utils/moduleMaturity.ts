import type { ModuleMaturity, ModuleMaturityStatus } from "../types/moduleMaturity";

export const maturityLabels: Record<ModuleMaturityStatus, string> = {
  real: "Real",
  partial: "Parcial",
  demonstrative: "Demonstrativo",
  planned: "Planeado",
};

export const maturityDescriptions: Record<ModuleMaturityStatus, string> = {
  real: "Fluxo ligado à fonte declarada; ainda sujeito a configuração e validação operacional.",
  partial: "Fluxo utilizável, mas com persistência, integração ou validação ainda incompleta.",
  demonstrative: "Experiência visível com dados simulados ou sem motor de produção.",
  planned: "Funcionalidade documentada no roadmap, sem implementação operacional.",
};

export function countMaturity(items: ModuleMaturity[]) {
  return items.reduce<Record<ModuleMaturityStatus, number>>(
    (counts, item) => ({ ...counts, [item.status]: counts[item.status] + 1 }),
    { real: 0, partial: 0, demonstrative: 0, planned: 0 },
  );
}

export function filterMaturity(
  items: ModuleMaturity[],
  status: ModuleMaturityStatus | "all",
  query: string,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-PT");
  return items.filter((item) => {
    if (status !== "all" && item.status !== status) return false;
    if (!normalizedQuery) return true;
    return [item.label, item.source, item.evidence, item.limitation, item.nextStep]
      .some((value) => value.toLocaleLowerCase("pt-PT").includes(normalizedQuery));
  });
}

export function maturityCsv(items: ModuleMaturity[]) {
  const escape = (value: string | null) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = items.map((item) => [
    item.label,
    item.route,
    maturityLabels[item.status],
    item.persistence,
    item.validation,
    item.source,
    item.evidence,
    item.limitation,
    item.nextStep,
  ].map(escape).join(";"));
  return [
    "Módulo;Rota;Estado;Persistência;Validação;Fonte;Evidência;Limitação;Próximo passo",
    ...rows,
  ].join("\n");
}
