import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
await access("dist/_headers"); const headers = await readFile("dist/_headers", "utf8");
for (const required of ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy", "Strict-Transport-Security"]) if (!headers.includes(required)) throw new Error(`Cabeçalho de segurança ausente: ${required}`);
async function files(directory) { const entries = await readdir(directory, { withFileTypes: true }); const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)])); return nested.flat(); }
const readable = (await files("dist")).filter((file) => /\.(?:js|html|json|css|txt|webmanifest)$/.test(file)); const forbidden = [/service_role/i, /SUPABASE_SERVICE_ROLE/i, /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/];
for (const file of readable) { const content = await readFile(file, "utf8"); for (const pattern of forbidden) if (pattern.test(content)) throw new Error(`Possível segredo administrativo encontrado no build: ${file}`); }
console.log(`Segurança do build aprovada: ${readable.length} ficheiros verificados e cabeçalhos presentes.`);
