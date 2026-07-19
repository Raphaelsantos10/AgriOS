import type { AutomationRule, AutomationRun } from "../../features/automation/types/automation";

const sampleValues: Record<string, number> = {
  "Humidade do solo": 17,
  "Velocidade do vento": 29,
  NDVI: 0.48,
};

function compare(value: number, operator: AutomationRule["operator"], threshold: number) {
  if (operator === "<") return value < threshold;
  if (operator === ">") return value > threshold;
  if (operator === "<=") return value <= threshold;
  if (operator === ">=") return value >= threshold;
  return value === threshold;
}

export function executeAutomation(rule: AutomationRule): AutomationRun {
  const currentValue = sampleValues[rule.metric] ?? rule.threshold;
  const matched = rule.status === "active" && compare(currentValue, rule.operator, rule.threshold);
  return {
    id: crypto.randomUUID(),
    ruleId: rule.id,
    ruleName: rule.name,
    status: rule.status !== "active" ? "skipped" : matched ? "success" : "skipped",
    message: rule.status !== "active"
      ? "Regra ignorada porque está pausada."
      : matched
        ? `${rule.actionLabel} executada: ${rule.metric} = ${currentValue}${rule.unit === "índice" ? "" : rule.unit}.`
        : `Condição não atingida: ${rule.metric} = ${currentValue}${rule.unit === "índice" ? "" : rule.unit}.`,
    executedAt: new Date().toISOString(),
  };
}
