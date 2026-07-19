import { Bot, Send } from "lucide-react";
import { useState } from "react";

const answers: Record<string, string> = {
  regar: "O Talhão Norte deve ser regado amanhã às 06:30. A FARPHA prevê uma necessidade de 31 m³ durante 42 minutos.",
  ndvi: "A redução de NDVI no Talhão Sul está concentrada no setor sudoeste e coincide com baixa condutividade do solo.",
  colher: "A melhor janela prevista para o Pomar Leste começa em 9 dias, com 84% de confiança.",
  incendio: "O risco atual está controlado, mas vento e secura superficial justificam nova avaliação ao final da tarde.",
};

export default function IntelligenceAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("Pergunte sobre rega, NDVI, colheita ou risco de incêndio.");

  function ask() {
    const normalized = question.toLowerCase();
    const key = Object.keys(answers).find((item) => normalized.includes(item));
    setAnswer(key ? answers[key] : "Ainda não tenho dados suficientes para responder com segurança. Abra o talhão e complete o perfil ambiental.");
    setQuestion("");
  }

  return (
    <aside className="rounded-2xl border border-[#9cdf28]/20 bg-[linear-gradient(145deg,rgba(156,223,40,0.10),rgba(11,23,26,0.95)_45%)] p-5">
      <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#9cdf28] text-[#071014]"><Bot size={21}/></span><div><h2 className="font-black text-white">Assistente FARPHA</h2><p className="text-xs text-[#92a099]">Consulta operacional baseada nos dados desta exploração</p></div></div>
      <div className="mt-5 min-h-28 rounded-2xl border border-white/10 bg-[#071114]/80 p-4 text-sm leading-6 text-[#d2dbd6]">{answer}</div>
      <div className="mt-3 flex gap-2"><input value={question} onChange={(event)=>setQuestion(event.target.value)} onKeyDown={(event)=>{ if(event.key === "Enter") ask(); }} placeholder="Ex.: Quando devo regar?" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#071114] px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#65736c] focus:border-[#9cdf28]/50"/><button type="button" onClick={ask} className="grid h-11 w-11 place-items-center rounded-xl bg-[#9cdf28] text-[#071014]"><Send size={17}/></button></div>
    </aside>
  );
}
