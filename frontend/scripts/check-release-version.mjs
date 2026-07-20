import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME;

if (!tag) {
  throw new Error("Informe a tag da release, por exemplo: v2.1.0.");
}

if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(tag)) {
  throw new Error(`Tag inválida: ${tag}. Use o formato v2.1.0.`);
}

const expectedTag = `v${packageJson.version}`;

if (tag !== expectedTag) {
  throw new Error(
    `A tag ${tag} não corresponde à versão ${packageJson.version}. Esperado: ${expectedTag}.`,
  );
}

console.log(`Release aprovada: ${tag} corresponde ao FARPHA ${packageJson.version}.`);
