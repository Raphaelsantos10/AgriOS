import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(scriptDirectory, "..");
const repositoryRoot = resolve(frontendRoot, "..");
const outputDirectory = resolve(repositoryRoot, "docs/screenshots");
const baseUrl = "http://127.0.0.1:4179";
const npmCli = process.env.npm_execpath;

if (!npmCli) throw new Error("Execute através de npm run screenshots:capture.");
await mkdir(outputDirectory, { recursive: true });

const server = spawn(process.execPath, [
  npmCli,
  "run",
  "dev",
  "--",
  "--host",
  "127.0.0.1",
  "--port",
  "4179",
  "--strictPort",
], {
  cwd: frontendRoot,
  env: {
    ...process.env,
    VITE_AUTH_REQUIRED: "false",
    VITE_GOOGLE_AUTH_ENABLED: "false",
    VITE_MICROSOFT_AUTH_ENABLED: "false",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // O servidor ainda está a iniciar.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error("O servidor Vite não ficou disponível para as capturas.");
}

async function launchChrome() {
  try {
    return await chromium.launch({ channel: "chrome", headless: true });
  } catch (channelError) {
    try {
      return await chromium.launch({ headless: true });
    } catch {
      throw new Error(
        `Google Chrome/Chromium não encontrado. Instale o Chrome e repita npm run screenshots:capture. `
        + `Detalhe: ${channelError instanceof Error ? channelError.message : "indisponível"}`,
      );
    }
  }
}

const generated = [];
let browser;
try {
  await waitForServer();
  browser = await launchChrome();

  const publicContext = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const publicPage = await publicContext.newPage();
  await publicPage.goto(baseUrl, { waitUntil: "networkidle" });
  await publicPage.screenshot({ path: resolve(outputDirectory, "public-home-desktop.png"), fullPage: false });
  generated.push(["public-home-desktop.png", "Página institucional FARPHA — desktop"]);

  await publicPage.goto(`${baseUrl}/#entrar`, { waitUntil: "networkidle" });
  await publicPage.screenshot({ path: resolve(outputDirectory, "login-desktop.png"), fullPage: false });
  generated.push(["login-desktop.png", "Autenticação FARPHA — entrar"]);

  await publicPage.goto(`${baseUrl}/#criar-conta`, { waitUntil: "networkidle" });
  await publicPage.screenshot({ path: resolve(outputDirectory, "signup-desktop.png"), fullPage: false });
  generated.push(["signup-desktop.png", "Autenticação FARPHA — criar conta"]);
  await publicContext.close();

  const appContext = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  await appContext.addInitScript(() => localStorage.setItem("farpha-local-access", "active-107.2"));
  const appPage = await appContext.newPage();
  await appPage.goto(baseUrl, { waitUntil: "networkidle" });
  await appPage.screenshot({ path: resolve(outputDirectory, "dashboard-desktop.png"), fullPage: false });
  generated.push(["dashboard-desktop.png", "Centro de Operações FARPHA — desktop"]);

  await appPage.goto(`${baseUrl}/diagnostico`, { waitUntil: "networkidle" });
  const maturityHeading = appPage.getByRole("heading", { name: "Profundidade operacional dos módulos" });
  await maturityHeading.scrollIntoViewIfNeeded();
  await appPage.screenshot({ path: resolve(outputDirectory, "maturity-diagnostics.png"), fullPage: false });
  generated.push(["maturity-diagnostics.png", "Diagnóstico — matriz de maturidade"]);
  await appContext.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
  await mobilePage.screenshot({ path: resolve(outputDirectory, "public-home-mobile.png"), fullPage: false });
  generated.push(["public-home-mobile.png", "Página institucional FARPHA — mobile"]);
  await mobileContext.close();

  const manifestPath = resolve(outputDirectory, "manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const preserved = manifest.images.filter((image) => !generated.some(([file]) => file === image.file));
  const now = new Date().toISOString();
  manifest.version = now;
  manifest.images = [
    ...preserved,
    ...generated.map(([file, title]) => ({
      file,
      title,
      capturedAt: now,
      source: "Captura automatizada da aplicação local através de Playwright e Google Chrome",
      featured: false,
    })),
  ];
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`${generated.length} capturas atuais guardadas em docs/screenshots.`);
} finally {
  if (browser) await browser.close();
  server.kill("SIGTERM");
}
