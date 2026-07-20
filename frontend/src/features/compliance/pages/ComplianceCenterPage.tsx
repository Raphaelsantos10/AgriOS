import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ExternalLink, FileCheck2, HelpCircle, Save, ShieldCheck } from "lucide-react";
import Button from "../../../design-system/components/Button";
import Card from "../../../design-system/components/Card";
import { readComplianceProfile, saveComplianceProfile } from "../services/complianceStorage";
import type { ComplianceProfile, ObligationStatus } from "../types/compliance";
import { EMPTY_COMPLIANCE_PROFILE, evaluateComplianceProfile, summarizeObligations } from "../utils/complianceProfile";

const inputClass = "h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100";
const questions: Array<{ key: keyof ComplianceProfile; label: string; help: string }> = [
  { key: "professionalActivity", label: "Atividade agrícola profissional", help: "Exerce atividade por conta própria ou através de empresa." },
  { key: "receivesSupport", label: "Recebe ou candidata-se a apoios", help: "Inclui Pedido Único e intervenções PEPAC." },
  { key: "sellsProduction", label: "Comercializa a produção", help: "Venda a consumidores, cooperativas ou outros operadores." },
  { key: "usesProfessionalPlantProtection", label: "Usa fitofármacos profissionais", help: "Aplicação própria ou através de prestador de serviços." },
  { key: "capturesWater", label: "Possui captação própria de água", help: "Furo, poço ou captação superficial usada na exploração." },
  { key: "hasLivestock", label: "Possui animais", help: "Animais de produção ou outra atividade pecuária." },
  { key: "hasWorkers", label: "Possui trabalhadores", help: "Inclui trabalhadores permanentes ou sazonais." },
  { key: "integratedProduction", label: "Pratica Produção Integrada", help: "Regime certificado ou compromisso equivalente." },
];

const statusUi: Record<ObligationStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  applicable: { label: "Aplicável", className: "border-red-200 bg-red-50 text-red-800", icon: AlertTriangle },
  review: { label: "Confirmar", className: "border-amber-200 bg-amber-50 text-amber-900", icon: HelpCircle },
  not_applicable: { label: "Não aplicável", className: "border-emerald-200 bg-emerald-50 text-emerald-800", icon: CheckCircle2 },
};

export default function ComplianceCenterPage() {
  const [profile, setProfile] = useState<ComplianceProfile>(() => readComplianceProfile() ?? EMPTY_COMPLIANCE_PROFILE);
  const [savedMessage, setSavedMessage] = useState("");
  const obligations = useMemo(() => evaluateComplianceProfile(profile), [profile]);
  const summary = useMemo(() => summarizeObligations(obligations), [obligations]);
  function updateText(key: "holderName" | "municipality", value: string) { setProfile((current) => ({ ...current, [key]: value })); setSavedMessage(""); }
  function updateFlag(key: keyof ComplianceProfile, value: boolean) { setProfile((current) => ({ ...current, [key]: value })); setSavedMessage(""); }
  function save() { const saved = saveComplianceProfile(profile); setProfile(saved); setSavedMessage("Perfil guardado neste dispositivo. A matriz foi atualizada."); }

  return <div className="mx-auto max-w-[1400px] space-y-6">
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">Sprint 74 · Obrigações agrícolas</p><h1 className="mt-1 text-3xl font-black">Centro de Obrigações</h1><p className="mt-2 max-w-3xl text-sm text-slate-600">Perfil inicial da exploração e matriz orientadora baseada em fontes públicas portuguesas.</p></div><Button onClick={save}><Save size={18}/> Guardar perfil</Button></header>
    <Card className="border-amber-200 bg-amber-50 p-5"><p className="flex items-start gap-3 text-sm text-amber-950"><ShieldCheck className="shrink-0"/><span><b>Ferramenta de apoio, não parecer jurídico.</b> “Aplicável” significa que o tema requer atenção; não prova incumprimento nem substitui IFAP, DGAV, APA, Finanças, Segurança Social ou aconselhamento técnico.</span></p></Card>
    <section className="grid gap-4 sm:grid-cols-3"><Card className="p-5"><p className="text-sm font-semibold text-slate-500">Aplicáveis</p><p className="mt-2 text-3xl font-black text-red-700">{summary.applicable}</p></Card><Card className="p-5"><p className="text-sm font-semibold text-slate-500">A confirmar</p><p className="mt-2 text-3xl font-black text-amber-700">{summary.review}</p></Card><Card className="p-5"><p className="text-sm font-semibold text-slate-500">Não aplicáveis</p><p className="mt-2 text-3xl font-black text-emerald-700">{summary.not_applicable}</p></Card></section>
    <Card className="p-5"><h2 className="text-xl font-black">Perfil da exploração</h2><p className="mt-1 text-sm text-slate-500">Não introduza NIF, palavras-passe ou outros dados sensíveis. Este perfil fica no armazenamento local do navegador.</p><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="grid gap-1 text-sm font-semibold">Titular ou designação<input className={inputClass} maxLength={120} value={profile.holderName} onChange={(event) => updateText("holderName", event.target.value)} placeholder="Ex.: Quinta do Vale"/></label><label className="grid gap-1 text-sm font-semibold">Concelho<input className={inputClass} maxLength={80} value={profile.municipality} onChange={(event) => updateText("municipality", event.target.value)} placeholder="Ex.: Évora"/></label></div><div className="mt-5 grid gap-3 md:grid-cols-2">{questions.map((question) => <label key={question.key} className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 hover:border-emerald-300"><input type="checkbox" className="mt-1 size-4 accent-emerald-700" checked={Boolean(profile[question.key])} onChange={(event) => updateFlag(question.key, event.target.checked)}/><span><b className="text-sm">{question.label}</b><span className="mt-1 block text-xs text-slate-500">{question.help}</span></span></label>)}</div>{savedMessage && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{savedMessage}</p>}{profile.updatedAt && <p className="mt-3 text-xs text-slate-500">Última gravação: {new Date(profile.updatedAt).toLocaleString("pt-PT")}</p>}</Card>
    <Card className="overflow-hidden"><div className="border-b border-slate-200 p-5"><h2 className="flex items-center gap-2 text-xl font-black"><FileCheck2 className="text-emerald-700"/> Matriz inicial</h2><p className="mt-1 text-sm text-slate-500">A fonte e a data de verificação acompanham cada tema. As próximas sprints acrescentarão prazos, documentos e evidências.</p></div><div className="divide-y divide-slate-100">{obligations.map((item) => { const ui = statusUi[item.status]; const Icon = ui.icon; return <article key={item.id} className="grid gap-4 p-5 lg:grid-cols-[150px_1fr_220px]"><div><span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${ui.className}`}><Icon size={14}/>{ui.label}</span><p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{item.area}</p></div><div><h3 className="font-black">{item.title}</h3><p className="mt-1 text-sm text-slate-600">{item.description}</p><p className="mt-2 text-xs font-semibold text-slate-500">Motivo: {item.reason}</p></div><div className="text-sm"><p className="font-bold">{item.authority}</p><p className="mt-1 text-xs text-slate-500">Fonte verificada em {new Date(`${item.sourceCheckedAt}T12:00:00`).toLocaleDateString("pt-PT")}</p><a className="mt-2 inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline" href={item.sourceUrl} target="_blank" rel="noreferrer">Abrir fonte oficial <ExternalLink size={14}/></a></div></article>; })}</div></Card>
  </div>;
}
