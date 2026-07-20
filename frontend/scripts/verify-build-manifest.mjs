import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const distDirectory = fileURLToPath(new URL("../dist/", import.meta.url));
const manifestPath = join(distDirectory, "build-manifest.json");

const listFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(path) : [path];
    }),
  );

  return nested.flat();
};

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

if (manifest.schemaVersion !== 1 || manifest.algorithm !== "sha256") {
  throw new Error("Formato do manifesto do build não suportado.");
}

const actualPaths = (await listFiles(distDirectory))
  .filter((path) => path !== manifestPath)
  .map((path) => relative(distDirectory, path).split(sep).join("/"))
  .sort((a, b) => a.localeCompare(b));
const expectedPaths = manifest.files
  .map((file) => file.path)
  .sort((a, b) => a.localeCompare(b));

const missingPaths = expectedPaths.filter((path) => !actualPaths.includes(path));
const unexpectedPaths = actualPaths.filter((path) => !expectedPaths.includes(path));

if (missingPaths.length || unexpectedPaths.length) {
  throw new Error(
    [
      missingPaths.length ? `Ficheiros ausentes: ${missingPaths.join(", ")}` : null,
      unexpectedPaths.length
        ? `Ficheiros inesperados: ${unexpectedPaths.join(", ")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

let totalBytes = 0;

for (const expected of manifest.files) {
  const path = join(distDirectory, expected.path);
  const [contents, metadata] = await Promise.all([readFile(path), stat(path)]);
  const sha256 = createHash("sha256").update(contents).digest("hex");

  if (metadata.size !== expected.bytes) {
    throw new Error(`Tamanho inválido: ${expected.path}.`);
  }

  if (sha256 !== expected.sha256) {
    throw new Error(`Hash SHA-256 inválido: ${expected.path}.`);
  }

  totalBytes += metadata.size;
}

if (manifest.fileCount !== manifest.files.length || manifest.totalBytes !== totalBytes) {
  throw new Error("Totais do manifesto não correspondem ao build.");
}

console.log(
  `Integridade aprovada: ${manifest.fileCount} ficheiros e ${manifest.totalBytes} bytes verificados.`,
);
