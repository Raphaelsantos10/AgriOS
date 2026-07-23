import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isCaptureSizeValid, minimumCaptureDimensions } from "./lib/documentation-media-rules.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
const screenshotsDirectory = join(repositoryRoot, "docs/screenshots");
const manifest = JSON.parse(await readFile(join(screenshotsDirectory, "manifest.json"), "utf8"));
const readme = await readFile(join(repositoryRoot, "README.md"), "utf8");

if (!Array.isArray(manifest.images) || manifest.images.length < 2) {
  throw new Error("São necessárias pelo menos duas capturas reais documentadas.");
}

for (const image of manifest.images) {
  if (!/^[a-z0-9-]+\.(?:png|jpg|jpeg|webp)$/i.test(image.file)) {
    throw new Error(`Nome de captura inválido: ${image.file}`);
  }
  if (!image.title || !image.capturedAt || !image.source) {
    throw new Error(`Metadados incompletos da captura: ${image.file}`);
  }
  const content = await readFile(join(screenshotsDirectory, image.file));
  if (image.file.endsWith(".png")) {
    const pngSignature = content.subarray(0, 8).toString("hex");
    if (pngSignature !== "89504e470d0a1a0a") throw new Error(`PNG inválido: ${image.file}`);
    const width = content.readUInt32BE(16);
    const height = content.readUInt32BE(20);
    if (!isCaptureSizeValid(image.file, width, height)) {
      const minimum = minimumCaptureDimensions(image.file);
      throw new Error(
        `Captura ${minimum.profile} demasiado pequena: ${image.file} (${width}x${height}); `
        + `mínimo ${minimum.width}x${minimum.height}.`,
      );
    }
  }
  if (image.featured && !readme.includes(`docs/screenshots/${image.file}`)) {
    throw new Error(`A captura em destaque não está no README: ${image.file}`);
  }
}

console.log(`Media aprovada: ${manifest.images.length} capturas reais documentadas e referenciadas.`);
