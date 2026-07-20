import { preview } from "vite";

const host = "127.0.0.1";
const port = 4173;
const origin = `http://${host}:${port}`;
const applicationRoutes = [
  "/",
  "/centro-operacoes",
  "/exploracoes",
  "/diagnostico",
  "/rota-inexistente-smoke",
];

const server = await preview({
  preview: {
    host,
    port,
    strictPort: true,
  },
});

const assertResponse = async (path, expectedContentType) => {
  const response = await fetch(new URL(path, origin));

  if (!response.ok) {
    throw new Error(`${path} respondeu com HTTP ${response.status}.`);
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes(expectedContentType)) {
    throw new Error(
      `${path} devolveu ${contentType || "sem content-type"}; esperado ${expectedContentType}.`,
    );
  }

  return response;
};

try {
  const routePages = await Promise.all(
    applicationRoutes.map(async (route) => ({
      route,
      html: await (await assertResponse(route, "text/html")).text(),
    })),
  );

  for (const { route, html } of routePages) {
    if (!html.includes('id="root"')) {
      throw new Error(`${route} não contém o elemento React #root.`);
    }
  }

  const html = routePages[0].html;

  const entryScript = html.match(/src="(\/assets\/[^"?#]+\.js)"/)?.[1];

  if (!entryScript) {
    throw new Error("A página inicial não contém o JavaScript principal.");
  }

  for (const { route, html: routeHtml } of routePages.slice(1)) {
    if (!routeHtml.includes(`src="${entryScript}"`)) {
      throw new Error(`${route} não devolveu o mesmo ponto de entrada da aplicação.`);
    }
  }

  const assetPaths = [
    ...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+\.(?:js|css))"/g),
  ].map((match) => match[1]);

  if (assetPaths.length === 0) {
    throw new Error("A página de produção não referencia JavaScript ou CSS.");
  }

  await Promise.all(
    [...new Set(assetPaths)].map((path) =>
      assertResponse(
        path,
        path.endsWith(".js") ? "text/javascript" : "text/css",
      ),
    ),
  );

  const buildInfoResponse = await assertResponse(
    "/build-info.json",
    "application/json",
  );
  const buildInfo = await buildInfoResponse.json();

  if (
    buildInfo.application !== "FARPHA" ||
    typeof buildInfo.version !== "string" ||
    typeof buildInfo.commit !== "string" ||
    typeof buildInfo.node !== "string"
  ) {
    throw new Error("build-info.json não contém a identificação obrigatória.");
  }

  console.log(
    `Smoke test aprovado: ${applicationRoutes.length} rotas, ${new Set(assetPaths).size} assets e build identificado.`,
  );
} finally {
  await server.close();
}
