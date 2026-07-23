import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(scriptDirectory, "..");
const appSource = await readFile(resolve(frontendRoot, "src/app/App.tsx"), "utf8");
const registrySource = await readFile(
  resolve(frontendRoot, "src/features/diagnostics/data/moduleMaturity.ts"),
  "utf8",
);

const appRoutes = [...appSource.matchAll(/path="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((route) => route !== "*");
const records = [...registrySource.matchAll(
  /^\s*\{ id: "([^"]+)", label: "([^"]+)", route: (null|"[^"]+"), status: "(real|partial|demonstrative|planned)"/gm,
)].map((match) => ({
  id: match[1],
  label: match[2],
  route: match[3] === "null" ? null : match[3].slice(1, -1),
  status: match[4],
}));

if (records.length !== 44) {
  throw new Error(`Matriz incompleta: esperados 44 módulos, encontrados ${records.length}.`);
}
const duplicates = records
  .map((record) => record.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);
if (duplicates.length) throw new Error(`IDs duplicados na matriz: ${duplicates.join(", ")}`);

const registeredRoutes = records.flatMap((record) => record.route ? [record.route] : []);
const missingRoutes = appRoutes.filter((route) => !registeredRoutes.includes(route));
const unknownRoutes = registeredRoutes.filter((route) => !appRoutes.includes(route));
if (missingRoutes.length || unknownRoutes.length) {
  throw new Error(
    `Cobertura de rotas inválida. Em falta: ${missingRoutes.join(", ") || "nenhuma"}. `
    + `Desconhecidas: ${unknownRoutes.join(", ") || "nenhuma"}.`,
  );
}

for (const evidence of ["intelligenceMockData", "precisionMockData", "Regras seed"]) {
  if (!registrySource.includes(evidence)) {
    throw new Error(`A matriz não declara a fonte demonstrativa: ${evidence}.`);
  }
}

const counts = records.reduce((result, record) => {
  result[record.status] += 1;
  return result;
}, { real: 0, partial: 0, demonstrative: 0, planned: 0 });

console.log(
  `Maturidade aprovada: ${records.length} módulos, ${appRoutes.length} rotas cobertas, `
  + `${counts.real} reais, ${counts.partial} parciais, `
  + `${counts.demonstrative} demonstrativos e ${counts.planned} planeados.`,
);
