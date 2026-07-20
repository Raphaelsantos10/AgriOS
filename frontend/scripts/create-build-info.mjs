import { readFile, writeFile } from "node:fs/promises";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const outputUrl = new URL("../dist/build-info.json", import.meta.url);

const buildInfo = {
  application: "FARPHA",
  version: packageJson.version,
  commit: process.env.GITHUB_SHA ?? "local",
  runId: process.env.GITHUB_RUN_ID ?? null,
  node: process.version,
  environment: process.env.CI ? "ci" : "local",
};

await writeFile(outputUrl, `${JSON.stringify(buildInfo, null, 2)}\n`);

console.log(
  `Build identificado: FARPHA ${buildInfo.version}, commit ${buildInfo.commit.slice(0, 7)}, ${buildInfo.node}.`,
);
