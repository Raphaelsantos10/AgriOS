import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const distDirectory = fileURLToPath(new URL("../dist/", import.meta.url));
const manifestPath = join(distDirectory, "build-manifest.json");

const listFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(path) : [path];
    }),
  );

  return files.flat();
};

const paths = (await listFiles(distDirectory))
  .filter((path) => path !== manifestPath)
  .sort((a, b) => a.localeCompare(b));

const files = await Promise.all(
  paths.map(async (path) => {
    const [contents, metadata] = await Promise.all([readFile(path), stat(path)]);

    return {
      path: relative(distDirectory, path).split(sep).join("/"),
      bytes: metadata.size,
      sha256: createHash("sha256").update(contents).digest("hex"),
    };
  }),
);

const manifest = {
  schemaVersion: 1,
  algorithm: "sha256",
  fileCount: files.length,
  totalBytes: files.reduce((total, file) => total + file.bytes, 0),
  files,
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `Manifesto do build criado: ${manifest.fileCount} ficheiros, ${manifest.totalBytes} bytes.`,
);
