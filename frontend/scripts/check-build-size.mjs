import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const assetsDirectory = fileURLToPath(new URL("../dist/assets/", import.meta.url));
const maximumJavaScriptBytes = 1050 * 1024;

const assetNames = await readdir(assetsDirectory);
const javascriptAssets = assetNames.filter((name) => name.endsWith(".js"));

if (javascriptAssets.length === 0) {
  throw new Error("Nenhum bundle JavaScript foi encontrado em dist/assets.");
}

const assets = await Promise.all(
  javascriptAssets.map(async (name) => ({
    name,
    bytes: (await stat(join(assetsDirectory, name))).size,
  })),
);

const oversizedAssets = assets.filter(
  ({ bytes }) => bytes > maximumJavaScriptBytes,
);

if (oversizedAssets.length > 0) {
  const details = oversizedAssets
    .map(({ name, bytes }) => `${name}: ${(bytes / 1024).toFixed(1)} KiB`)
    .join("\n");

  throw new Error(
    `Bundles acima do limite de 1050 KiB:\n${details}`,
  );
}

const largestAsset = assets.toSorted((a, b) => b.bytes - a.bytes)[0];

console.log(
  `Limite de bundle aprovado. Maior JavaScript: ${largestAsset.name} (${(
    largestAsset.bytes / 1024
  ).toFixed(1)} KiB).`,
);
