import { readFile } from "node:fs/promises";

const packageUrl = new URL("../package.json", import.meta.url);
const nodeVersionUrl = new URL("../.nvmrc", import.meta.url);

const packageJson = JSON.parse(await readFile(packageUrl, "utf8"));
const nodeVersion = (await readFile(nodeVersionUrl, "utf8")).trim();

const extractMajor = (version, dependencyName) => {
  const match = version?.match(/\d+/);

  if (!match) {
    throw new Error(`Versão inválida para ${dependencyName}: ${version}`);
  }

  return Number(match[0]);
};

const typescriptVersion = packageJson.devDependencies?.typescript;
const nodeTypesVersion = packageJson.devDependencies?.["@types/node"];
const typescriptMajor = extractMajor(typescriptVersion, "typescript");
const nodeTypesMajor = extractMajor(nodeTypesVersion, "@types/node");
const nodeMajor = extractMajor(nodeVersion, ".nvmrc");

if (typescriptMajor !== 6) {
  throw new Error(
    `TypeScript ${typescriptMajor} não foi aprovado. Mantenha a linha 6 enquanto typescript-eslint não suportar a próxima versão.`,
  );
}

if (nodeTypesMajor !== nodeMajor) {
  throw new Error(
    `@types/node ${nodeTypesMajor} não corresponde ao Node ${nodeMajor} definido em .nvmrc.`,
  );
}

console.log(
  `Toolchain aprovada: TypeScript ${typescriptMajor}, Node ${nodeMajor} e @types/node ${nodeTypesMajor}.`,
);
