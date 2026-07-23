import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(scriptsDirectory, "..");
const packageJson = JSON.parse(await readFile(resolve(frontendRoot, "package.json"), "utf8"));

const validationSteps = [
  "check:toolchain",
  "verify:repository",
  "verify:brand",
  "verify:maturity",
  "verify:docs",
  "verify:media",
  "check:public-entry",
  "test",
  "lint",
  "build",
  "verify:pwa",
  "verify:security",
  "verify:dist",
  "smoke:prod",
].filter((step) => packageJson.scripts?.[step]);

const npmCli = process.env.npm_execpath;
if (!npmCli) {
  throw new Error("Não foi possível localizar o executor do npm.");
}

console.log(`Validação FARPHA: ${validationSteps.length} etapas.`);

for (const [index, step] of validationSteps.entries()) {
  console.log(`\n[${index + 1}/${validationSteps.length}] npm run ${step}`);
  const result = spawnSync(process.execPath, [npmCli, "run", step], {
    cwd: frontendRoot,
    env: process.env,
    stdio: "inherit",
    windowsHide: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    console.error(`\nValidação interrompida na etapa: ${step}`);
    process.exit(result.status ?? 1);
  }
}

console.log("\nVALIDAÇÃO FARPHA CONCLUÍDA COM SUCESSO.");
