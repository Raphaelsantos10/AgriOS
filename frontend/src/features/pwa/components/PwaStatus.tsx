import { useEffect, useState } from "react";
import { Download, WifiOff, X } from "lucide-react";
import { canOfferInstall, getPwaCapability, offlineAvailabilityMessage } from "../utils/pwa";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export default function PwaStatus() {
  const [online, setOnline] = useState(() => navigator.onLine); const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null); const [dismissed, setDismissed] = useState(false);
  useEffect(() => { const onOnline = () => setOnline(true); const onOffline = () => setOnline(false); const onPrompt = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPromptEvent); }; window.addEventListener("online", onOnline); window.addEventListener("offline", onOffline); window.addEventListener("beforeinstallprompt", onPrompt); return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); window.removeEventListener("beforeinstallprompt", onPrompt); }; }, []);
  const capability = getPwaCapability({ hasServiceWorker: "serviceWorker" in navigator, displayModeStandalone: window.matchMedia("(display-mode: standalone)").matches, navigatorStandalone: Boolean((navigator as Navigator & { standalone?: boolean }).standalone), online });
  async function install() { if (!prompt) return; await prompt.prompt(); const choice = await prompt.userChoice; if (choice.outcome === "accepted") setPrompt(null); }
  if (online && (!canOfferInstall(capability, Boolean(prompt)) || dismissed)) return null;
  return <aside className={`fixed bottom-4 right-4 z-[2000] flex max-w-sm items-center gap-3 rounded-2xl border p-4 shadow-2xl ${online ? "border-emerald-300 bg-white text-slate-800" : "border-amber-300 bg-amber-50 text-amber-950"}`} role="status">{online ? <Download className="shrink-0 text-emerald-700"/> : <WifiOff className="shrink-0"/>}<div><p className="text-sm font-black">{online ? "Instalar FARPHA" : "Sem ligação à Internet"}</p><p className="mt-1 text-xs">{online ? "Use como aplicação no telemóvel ou computador." : offlineAvailabilityMessage(capability)}</p></div>{online && <button type="button" onClick={() => void install()} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-black text-white">Instalar</button>}<button type="button" onClick={() => setDismissed(true)} aria-label="Fechar aviso" className="rounded-lg p-1"><X size={16}/></button></aside>;
}
