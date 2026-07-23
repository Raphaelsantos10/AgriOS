import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const documents = [
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "docs/DOCUMENTATION_INDEX.md",
  "docs/PRE_PUBLICATION_MASTER_PLAN.md",
  "docs/MODULE_MATURITY_MATRIX.md",
  "docs/USER_GUIDE.md",
  "docs/ADMIN_GUIDE.md",
  "docs/TECHNICAL_OVERVIEW.md",
  "docs/PUBLIC_DEMO_GUIDE.md",
  "docs/ARCHIVE_POLICY.md",
  "docs/brand/FARPHA_IDENTITY_GOVERNANCE.md",
];

let checkedLinks = 0;
const broken = [];
for (const document of documents) {
  const absoluteDocument = resolve(repositoryRoot, document);
  const content = await readFile(absoluteDocument, "utf8");
  const links = [...content.matchAll(/!?\[[^\]]*]\(([^)]+)\)/g)].map((match) => match[1]);
  for (const rawTarget of links) {
    if (/^(?:https?:|mailto:|#)/i.test(rawTarget)) continue;
    const target = rawTarget.split("#")[0];
    if (!target) continue;
    checkedLinks += 1;
    const absoluteTarget = resolve(dirname(absoluteDocument), decodeURIComponent(target));
    try {
      await access(absoluteTarget);
    } catch {
      broken.push(`${document} → ${rawTarget}`);
    }
  }
}

if (broken.length) {
  throw new Error(`Ligações documentais inválidas:\n- ${broken.join("\n- ")}`);
}

console.log(`Documentação aprovada: ${documents.length} documentos e ${checkedLinks} ligações locais verificadas.`);
