import type { AutomationRule, AutomationRun } from "../types/automation";

const RULES_KEY = "farpha-automation-rules-v1";
const RUNS_KEY = "farpha-automation-runs-v1";

const seedRules: AutomationRule[] = [
  {
    id: "rule-soil-moisture",
    name: "Rega por humidade baixa",
    description: "Cria uma ordem de rega quando a humidade do solo fica abaixo do limite seguro.",
    status: "active",
    triggerType: "sensor",
    metric: "Humidade do solo",
    operator: "<",
    threshold: 20,
    unit: "%",
    actionType: "create-work-order",
    actionLabel: "Criar ordem de rega",
    fieldName: "Talhão Norte",
    lastRunAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    runCount: 18,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
  },
  {
    id: "rule-wind-spray",
    name: "Bloqueio de pulverização",
    description: "Notifica a equipa quando o vento ultrapassa o limite operacional.",
    status: "active",
    triggerType: "weather",
    metric: "Velocidade do vento",
    operator: ">",
    threshold: 25,
    unit: "km/h",
    actionType: "notify",
    actionLabel: "Notificar responsável",
    fieldName: "Toda a exploração",
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    runCount: 7,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11).toISOString(),
  },
  {
    id: "rule-ndvi-drop",
    name: "Queda de vigor vegetativo",
    description: "Regista um alerta quando o NDVI desce abaixo do valor definido.",
    status: "paused",
    triggerType: "satellite",
    metric: "NDVI",
    operator: "<",
    threshold: 0.52,
    unit: "índice",
    actionType: "log",
    actionLabel: "Registar alerta técnico",
    fieldName: "Talhão Sul",
    runCount: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
];

function parse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

export function loadAutomationRules(): AutomationRule[] {
  return parse(localStorage.getItem(RULES_KEY), seedRules);
}

export function saveAutomationRules(rules: AutomationRule[]) {
  localStorage.setItem(RULES_KEY, JSON.stringify(rules));
}

export function loadAutomationRuns(): AutomationRun[] {
  return parse(localStorage.getItem(RUNS_KEY), []);
}

export function saveAutomationRuns(runs: AutomationRun[]) {
  localStorage.setItem(RUNS_KEY, JSON.stringify(runs.slice(0, 30)));
}
