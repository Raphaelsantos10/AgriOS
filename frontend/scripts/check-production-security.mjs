import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
await access("dist/_headers"); const headers = await readFile("dist/_headers", "utf8");
for (const required of ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy", "Strict-Transport-Security"]) if (!headers.includes(required)) throw new Error(`Cabeçalho de segurança ausente: ${required}`);
async function files(directory) { const entries = await readdir(directory, { withFileTypes: true }); const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)])); return nested.flat(); }
const readable = (await files("dist")).filter((file) => /\.(?:js|html|json|css|txt|webmanifest)$/.test(file)); const forbidden = [/service_role/i, /SUPABASE_SERVICE_ROLE/i, /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/];
for (const file of readable) { const content = await readFile(file, "utf8"); for (const pattern of forbidden) if (pattern.test(content)) throw new Error(`Possível segredo administrativo encontrado no build: ${file}`); }
const edgePath = "../supabase/functions/farpha-intelligence/index.ts";
await access(edgePath);
const edge = await readFile(edgePath, "utf8");
for (const required of [
  "auth.getUser",
  "OPENAI_API_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "FARPHA_ALLOWED_ORIGINS",
  "FARPHA_AI_REQUESTS_PER_HOUR",
  "https://api.openai.com/v1/responses",
]) if (!edge.includes(required)) throw new Error(`Proteção ausente na Edge Function: ${required}`);
const publicEnvironments = [
  await readFile(".env.example", "utf8"),
  await readFile("../.env.example", "utf8"),
].join("\n");
for (const privateName of ["OPENAI_API_KEY", "SUPABASE_SERVICE_ROLE_KEY"]) {
  if (publicEnvironments.includes(privateName)) throw new Error(`${privateName} não pode existir nos ficheiros públicos de ambiente.`);
}
console.log(`Segurança aprovada: ${readable.length} ficheiros do build, cabeçalhos, autenticação da Edge Function e separação de Secrets verificadas.`);
