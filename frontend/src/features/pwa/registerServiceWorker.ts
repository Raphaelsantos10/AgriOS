export function registerFarphaServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (import.meta.env.DEV) {
    void navigator.serviceWorker.getRegistrations().then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())));
    if ("caches" in window) void caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("farpha-pwa-")).map((key) => caches.delete(key))));
    return;
  }
  window.addEventListener("load", () => { navigator.serviceWorker.register("/sw.js").catch((error: unknown) => console.error("Falha ao registar o modo offline FARPHA", error)); });
}
