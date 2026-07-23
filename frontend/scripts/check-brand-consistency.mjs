import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(scriptDirectory, "..");
const repositoryRoot = resolve(frontendRoot, "..");

const read = (path) => readFile(join(repositoryRoot, path), "utf8");
const exists = (path) => access(join(repositoryRoot, path)).then(() => true).catch(() => false);
const requireText = (content, expected, file) => {
  if (!content.includes(expected)) {
    throw new Error(`${file} não contém a identidade obrigatória: ${expected}`);
  }
};

const [indexHtml, manifestText, packageText, logoComponent, publicEntry] = await Promise.all([
  read("frontend/index.html"),
  read("frontend/public/manifest.webmanifest"),
  read("frontend/package.json"),
  read("frontend/src/components/brand/FarphaLogo.tsx"),
  read("frontend/src/features/auth/PublicEntry.tsx"),
]);

requireText(indexHtml, '<html lang="pt-PT">', "frontend/index.html");
requireText(indexHtml, "<title>FARPHA — Intelligence for Agriculture</title>", "frontend/index.html");
requireText(indexHtml, 'name="description" content="FARPHA', "frontend/index.html");

const manifest = JSON.parse(manifestText);
if (
  manifest.short_name !== "FARPHA"
  || manifest.lang !== "pt-PT"
  || !String(manifest.name).startsWith("FARPHA")
  || manifest.theme_color !== "#166534"
) {
  throw new Error("O manifesto PWA não respeita a identidade FARPHA aprovada.");
}
for (const icon of manifest.icons ?? []) {
  if (!(await exists(`frontend/public${icon.src}`))) {
    throw new Error(`Ícone PWA ausente: ${icon.src}`);
  }
}

const packageJson = JSON.parse(packageText);
if (packageJson.name !== "farpha-frontend") {
  throw new Error("O pacote principal deve chamar-se farpha-frontend.");
}

requireText(logoComponent, "farphaSymbolOfficialDark", "FarphaLogo.tsx");
requireText(logoComponent, "Intelligence for Agriculture", "FarphaLogo.tsx");
requireText(publicEntry, 'from "./MarketingSiteV4"', "PublicEntry.tsx");

const forbiddenLegacyFiles = [
  "frontend/src/features/auth/MarketingSiteV2.tsx",
  "frontend/src/features/auth/MarketingSiteV3.tsx",
  "frontend/src/assets/react.svg",
  "frontend/src/assets/vite.svg",
  "frontend/src/assets/hero.png",
  "frontend/src/assets/brand/farpha-logo.png",
  "frontend/src/assets/brand/farpha-symbol.png",
];
const legacyStillPresent = [];
for (const file of forbiddenLegacyFiles) {
  if (await exists(file)) legacyStillPresent.push(file);
}
if (legacyStillPresent.length) {
  throw new Error(`Recursos legados ainda presentes:\n- ${legacyStillPresent.join("\n- ")}`);
}

for (const officialAsset of [
  "frontend/src/assets/brand/farpha-logo-official-dark.png",
  "frontend/src/assets/brand/farpha-symbol-official-dark.png",
  "design/assets/farpha-logo-transparent-master.png",
  "design/assets/farpha-symbol-transparent-master.png",
]) {
  if (!(await exists(officialAsset))) {
    throw new Error(`Ativo oficial FARPHA ausente: ${officialAsset}`);
  }
}

console.log("Identidade FARPHA aprovada: marca, manifesto, entrada pública e ativos oficiais consistentes.");
