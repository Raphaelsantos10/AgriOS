import { execFile } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");

const normalize = (path) => path.replaceAll("\\", "/");
const exists = async (path) => access(path).then(() => true).catch(() => false);

const requiredFiles = [
  ".github/dependabot.yml",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/feature_request.yml",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/workflows/ci.yml",
  ".github/workflows/codeql.yml",
  ".github/workflows/release.yml",
  ".github/workflows/repository-audit.yml",
  ".gitattributes",
  ".gitignore",
  "CONTRIBUTING.md",
  "RENOMEAR_REPOSITORIO_FARPHA.txt",
  "README.md",
  "SECURITY.md",
  "CHANGELOG.md",
  "database/FARPHA_SUPABASE_BOOTSTRAP_V1.sql",
  "database/SPRINT_106_7_SELF_SERVICE_AUTH.sql",
  "database/SPRINT_107_SECURITY_STABILIZATION.sql",
  "database/SPRINT_107_6_FARPHA_INTELLIGENCE.sql",
  "database/migrations/20260721_create_billing.sql",
  "docs/PRE_PUBLICATION_MASTER_PLAN.md",
  "docs/MODULE_MATURITY_MATRIX.md",
  "docs/PUBLIC_DEMO_GUIDE.md",
  "docs/USER_GUIDE.md",
  "docs/ADMIN_GUIDE.md",
  "docs/TECHNICAL_OVERVIEW.md",
  "docs/screenshots/manifest.json",
  "docs/DOCUMENTATION_INDEX.md",
  "docs/ARCHIVE_POLICY.md",
  "docs/brand/FARPHA_IDENTITY_GOVERNANCE.md",
  "docs/security/REPOSITORY_SECURITY_BASELINE.md",
  "docs/sprints/SPRINT_107_7_ASSISTENTE_RESILIENTE.md",
  "docs/sprints/SPRINT_107_8_AUDITORIA_REPOSITORIO.md",
  "docs/sprints/SPRINT_107_9_IDENTIDADE_REPOSITORIO.md",
  "docs/sprints/SPRINT_108_MATRIZ_MATURIDADE.md",
  "docs/sprints/SPRINT_109_DOCUMENTACAO_PUBLICA.md",
  "COMO_INSTALAR_SPRINT_107_9.txt",
  "ATUALIZAR_GITHUB_SPRINT_107_9.txt",
  "frontend/scripts/check-brand-consistency.mjs",
  "frontend/scripts/check-module-maturity.mjs",
  "frontend/scripts/check-documentation-media.mjs",
  "frontend/scripts/check-documentation-links.mjs",
  "frontend/scripts/capture-product-screenshots.mjs",
  "COMO_INSTALAR_SPRINT_108.txt",
  "ATUALIZAR_GITHUB_SPRINT_108.txt",
  "COMO_INSTALAR_SPRINT_109.txt",
  "ATUALIZAR_GITHUB_SPRINT_109.txt",
  "supabase/functions/farpha-intelligence/index.ts",
];

const missing = [];
for (const file of requiredFiles) {
  if (!(await exists(join(repositoryRoot, file)))) missing.push(file);
}
if (missing.length) {
  throw new Error(`Ficheiros estruturais ausentes:\n- ${missing.join("\n- ")}`);
}

const ignoredDirectories = new Set([".git", "node_modules", "dist", "coverage"]);
async function listSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) return [];
      return listSourceFiles(join(directory, entry.name));
    }
    return [normalize(relative(repositoryRoot, join(directory, entry.name)))];
  }));
  return nested.flat();
}

let trackedFiles;
try {
  const { stdout } = await execFileAsync(
    "git",
    ["-C", repositoryRoot, "ls-files"],
    { encoding: "utf8" },
  );
  trackedFiles = stdout.split(/\r?\n/).filter(Boolean).map(normalize);
} catch {
  trackedFiles = await listSourceFiles(repositoryRoot);
}

const sourceFiles = await listSourceFiles(repositoryRoot);
const privateOrGenerated = (file) =>
  file.startsWith("frontend/node_modules/")
  || file.startsWith("frontend/dist/")
  || /(^|\/)\.env(?:\.local|\.production|\.development)?$/.test(file)
  || file.endsWith(".pem")
  || file.endsWith(".p12")
  || file.endsWith(".key");
const auditedFiles = [...new Set([...trackedFiles, ...sourceFiles])]
  .filter((file) => !privateOrGenerated(file))
  .sort();

const forbiddenTracked = trackedFiles.filter((file) =>
  privateOrGenerated(file),
);
if (forbiddenTracked.length) {
  throw new Error(`Ficheiros que não podem ser versionados:\n- ${forbiddenTracked.join("\n- ")}`);
}

const gitignore = await readFile(join(repositoryRoot, ".gitignore"), "utf8");
for (const requiredRule of ["node_modules/", "dist/", ".env", ".env.*", "coverage/"]) {
  if (!gitignore.split(/\r?\n/).includes(requiredRule)) {
    throw new Error(`Regra obrigatória ausente no .gitignore: ${requiredRule}`);
  }
}

const readableExtensions = /\.(?:js|jsx|mjs|cjs|ts|tsx|json|md|txt|yml|yaml|sql|html|css)$/i;
const secretPatterns = [
  { name: "chave OpenAI", pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
  { name: "token Supabase pessoal", pattern: /\bsbp_[A-Za-z0-9]{20,}\b/g },
  { name: "token GitHub", pattern: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g },
  { name: "chave privada", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
];

const findings = [];
for (const file of auditedFiles.filter((path) => readableExtensions.test(path))) {
  const absolute = join(repositoryRoot, file);
  if (!(await exists(absolute))) continue;
  const content = await readFile(absolute, "utf8");
  for (const { name, pattern } of secretPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) findings.push(`${file}: possível ${name}`);
  }
}
if (findings.length) {
  throw new Error(`Possíveis segredos encontrados:\n- ${findings.join("\n- ")}`);
}

const sprintFiles = auditedFiles.filter((file) => file.startsWith("docs/sprints/"));
if (sprintFiles.length < 80) {
  throw new Error(`Histórico incompleto: apenas ${sprintFiles.length} documentos de sprint.`);
}

const changelog = await readFile(join(repositoryRoot, "CHANGELOG.md"), "utf8");
const changelogLines = changelog.split(/\r?\n/).length;
for (const historicalMarker of [
  "Sprint 107.9",
  "Sprint 107.8",
  "Sprint 107.7",
  "Sprint 35",
  "Sprint 72",
]) {
  if (!changelog.includes(historicalMarker)) {
    throw new Error(`Histórico do CHANGELOG incompleto: falta ${historicalMarker}.`);
  }
}
if (changelogLines < 1_400) {
  throw new Error(`CHANGELOG possivelmente truncado: apenas ${changelogLines} linhas.`);
}

console.log(
  `Repositório aprovado: ${requiredFiles.length} ficheiros estruturais, `
  + `${auditedFiles.length} ficheiros auditados, ${sprintFiles.length} documentos de sprint, `
  + `${changelogLines} linhas de histórico e nenhum segredo evidente.`,
);
