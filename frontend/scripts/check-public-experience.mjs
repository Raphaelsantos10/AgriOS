import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/features/auth/PublicEntry.tsx", import.meta.url), "utf8");

if (!source.includes('import MarketingSiteV4 from "./MarketingSiteV4"')) {
  throw new Error("A entrada pública não está ligada ao MarketingSiteV4.");
}

if (!source.includes("<MarketingSiteV4") || source.includes("MarketingSiteV3")) {
  throw new Error("A entrada pública ainda referencia uma experiência anterior.");
}

console.log("Entrada pública aprovada: MarketingSiteV4 ativo.");
