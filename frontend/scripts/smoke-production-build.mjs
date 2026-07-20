import { preview } from "vite";

const host = "127.0.0.1";
const port = 4173;
const origin = `http://${host}:${port}`;

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
  const indexResponse = await assertResponse("/", "text/html");
  const html = await indexResponse.text();

  if (!html.includes('id="root"')) {
    throw new Error("A página de produção não contém o elemento #root.");
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

  console.log(
    `Smoke test aprovado: página inicial e ${new Set(assetPaths).size} assets carregados.`,
  );
} finally {
  await server.close();
}
