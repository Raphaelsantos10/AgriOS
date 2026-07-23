import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { canOfferInstall, getPwaCapability } from "../utils/pwa";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export default function PwaStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    const onPrompt = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPromptEvent); };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, []);
  const capability = getPwaCapability({
    hasServiceWorker: "serviceWorker" in navigator,
    displayModeStandalone: window.matchMedia("(display-mode: standalone)").matches,
    navigatorStandalone: Boolean((navigator as Navigator & { standalone?: boolean }).standalone),
    online,
  });
  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") setPrompt(null);
  }
  if (!online || !canOfferInstall(capability, Boolean(prompt))) return null;
  return <button type="button" onClick={() => void install()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#173c2a]/15 bg-white px-4 text-sm font-black text-[#173c2a] transition hover:border-[#568020] hover:bg-[#f3f7ed]" aria-label="Instalar FARPHA neste dispositivo"><Download size={17}/>Instalar</button>;
}
