import type { ComplianceObligation, ComplianceProfile, ComplianceSummary, ObligationStatus } from "../types/compliance";

export const EMPTY_COMPLIANCE_PROFILE: ComplianceProfile = {
  holderName: "",
  municipality: "",
  professionalActivity: true,
  receivesSupport: false,
  sellsProduction: true,
  usesProfessionalPlantProtection: false,
  capturesWater: false,
  hasLivestock: false,
  hasWorkers: false,
  integratedProduction: false,
  updatedAt: "",
};

type Rule = Omit<ComplianceObligation, "status" | "reason"> & {
  evaluate: (profile: ComplianceProfile) => Pick<ComplianceObligation, "status" | "reason">;
};

const checkedAt = "2026-07-20";
const result = (status: ObligationStatus, reason: string) => ({ status, reason });

const rules: Rule[] = [
  { id: "tax", area: "Fiscal e social", title: "Atividade, faturação e contribuições", description: "Confirmar o enquadramento nas Finanças, faturação, impostos e Segurança Social.", authority: "Autoridade Tributária / Segurança Social", sourceUrl: "https://www.gov.pt/servicos/abrir-atividade-nas-financas", sourceCheckedAt: checkedAt, evaluate: (p) => p.professionalActivity ? result("applicable", "Foi indicada atividade agrícola profissional.") : result("review", "Confirme se existe venda, prestação de serviços ou outro rendimento sujeito a enquadramento.") },
  { id: "parcel", area: "Exploração", title: "Parcelário e culturas", description: "Manter localização, caracterização das parcelas e culturas coerentes com os registos oficiais quando exigido.", authority: "IFAP", sourceUrl: "https://agricultura.gov.pt/portal/informacao-sip", sourceCheckedAt: checkedAt, evaluate: (p) => p.sellsProduction || p.receivesSupport ? result("applicable", "A exploração vende produção ou recebe apoios.") : result("review", "Confirme o enquadramento da exploração e eventuais alterações no parcelário.") },
  { id: "support", area: "Apoios", title: "Pedido Único e compromissos PEPAC", description: "Controlar candidatura, elegibilidade, compromissos, condicionalidade e evidências.", authority: "IFAP", sourceUrl: "https://www.ifap.pt/portal/pedido-unico", sourceCheckedAt: checkedAt, evaluate: (p) => p.receivesSupport ? result("applicable", "Foi indicado o recebimento ou candidatura a apoios.") : result("not_applicable", "Não foram indicados apoios; reavalie antes de uma candidatura.") },
  { id: "field-book", area: "Registos", title: "Caderno de campo", description: "Registar operações, fertilização, tratamentos, rega, colheitas e outros elementos exigidos pelo regime aplicável.", authority: "DGADR / IFAP", sourceUrl: "https://www.dgadr.gov.pt/pt/producao-integrada/caderno-de-campo", sourceCheckedAt: checkedAt, evaluate: (p) => p.integratedProduction ? result("applicable", "Foi indicada Produção Integrada.") : result("review", "O conteúdo obrigatório depende dos regimes, apoios e operações da exploração.") },
  { id: "plant-protection", area: "Fitofármacos", title: "Aplicação de produtos fitofarmacêuticos", description: "Confirmar habilitação, produto autorizado, registo da aplicação, armazenamento e inspeção do equipamento.", authority: "DGAV", sourceUrl: "https://www.dgav.pt/medicamentos/conteudo/produtos-fitofarmaceuticos/uso-sustentavel-dos-produtos-fitofarmaceuticos/", sourceCheckedAt: checkedAt, evaluate: (p) => p.usesProfessionalPlantProtection ? result("applicable", "Foi indicado uso profissional de produtos fitofarmacêuticos.") : result("not_applicable", "Não foi indicado uso profissional; reavalie se a prática mudar.") },
  { id: "water", area: "Água e ambiente", title: "Captação e utilização de água", description: "Confirmar título, licença ou autorização, condições de medição e obrigações associadas no SILiAmb.", authority: "APA", sourceUrl: "https://apambiente.pt/agua/licenciamento-online", sourceCheckedAt: checkedAt, evaluate: (p) => p.capturesWater ? result("applicable", "Foi indicada captação própria de água.") : result("not_applicable", "Não foi indicada captação própria de água.") },
  { id: "food", area: "Segurança alimentar", title: "Produção primária e rastreabilidade", description: "Manter registos de produção, higiene, tratamentos, lotes, destinatários e eventual retirada.", authority: "DGAV", sourceUrl: "https://www.dgav.pt/alimentos/conteudo/generos-alimenticios/iniciar-uma-empresa-alimentar/producao-primaria-inicio-e-desenvolvimento-da-atividade/", sourceCheckedAt: checkedAt, evaluate: (p) => p.sellsProduction ? result("applicable", "Foi indicada comercialização da produção.") : result("not_applicable", "Foi indicado autoconsumo ou ausência de venda.") },
  { id: "livestock", area: "Pecuária", title: "Registo, sanidade e movimentação animal", description: "Confirmar registo da exploração e animais, movimentações, medicamentos, mortalidade e obrigações sanitárias.", authority: "DGAV / IFAP", sourceUrl: "https://www.dgav.pt/animais/conteudo/identificacao-registo-e-movimentacao-animal/", sourceCheckedAt: checkedAt, evaluate: (p) => p.hasLivestock ? result("applicable", "Foi indicada a presença de animais na exploração.") : result("not_applicable", "Não foram indicados animais.") },
  { id: "workers", area: "Trabalho", title: "Trabalhadores, seguros e segurança", description: "Confirmar vínculos, comunicações, contribuições, seguro e medidas de segurança e saúde no trabalho.", authority: "ACT / Segurança Social", sourceUrl: "https://www.gov.pt/guias/contratar-trabalhadores", sourceCheckedAt: checkedAt, evaluate: (p) => p.hasWorkers ? result("applicable", "Foi indicada a existência de trabalhadores.") : result("not_applicable", "Não foram indicados trabalhadores; confirme também trabalho sazonal.") },
];

export function evaluateComplianceProfile(profile: ComplianceProfile): ComplianceObligation[] {
  return rules.map(({ evaluate, ...rule }) => ({ ...rule, ...evaluate(profile) }));
}

export function summarizeObligations(items: ComplianceObligation[]): ComplianceSummary {
  return items.reduce<ComplianceSummary>((summary, item) => ({ ...summary, [item.status]: summary[item.status] + 1 }), { applicable: 0, review: 0, not_applicable: 0 });
}
