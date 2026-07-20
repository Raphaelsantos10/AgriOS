import { access, readFile } from "node:fs/promises";
const required = ["dist/manifest.webmanifest", "dist/sw.js", "dist/icon-192.png", "dist/icon-512.png", "dist/index.html"];
await Promise.all(required.map((file) => access(file)));
const manifest = JSON.parse(await readFile("dist/manifest.webmanifest", "utf8")); const html = await readFile("dist/index.html", "utf8"); const worker = await readFile("dist/sw.js", "utf8");
if (manifest.display !== "standalone" || !Array.isArray(manifest.icons) || manifest.icons.length < 2) throw new Error("Manifesto PWA incompleto.");
if (!html.includes('rel="manifest"')) throw new Error("Manifesto não está ligado ao HTML.");
if (!worker.includes('addEventListener("fetch"') || !worker.includes("/index.html")) throw new Error("Service worker sem estratégia offline.");
console.log(`PWA aprovada: ${manifest.short_name}, ${manifest.icons.length} ícones, instalação standalone e fallback offline.`);
