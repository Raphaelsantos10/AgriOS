import type { ComplianceDocument } from "../types/compliance";

export const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;
export const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export function validateComplianceFile(file: Pick<File, "size" | "type">): string | null {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) return "Formato não permitido. Use PDF, JPEG, PNG ou WebP.";
  if (file.size <= 0) return "O ficheiro está vazio.";
  if (file.size > MAX_DOCUMENT_SIZE) return "O ficheiro ultrapassa o limite de 5 MB.";
  return null;
}

export type DocumentValidity = "valid" | "expiring" | "expired" | "no_expiry";
export function documentValidity(document: Pick<ComplianceDocument, "expiresAt">, today: string, warningDays = 30): DocumentValidity {
  if (!document.expiresAt) return "no_expiry";
  if (document.expiresAt < today) return "expired";
  const todayMs = new Date(`${today}T00:00:00Z`).getTime();
  const expiryMs = new Date(`${document.expiresAt}T00:00:00Z`).getTime();
  return expiryMs - todayMs <= warningDays * 86_400_000 ? "expiring" : "valid";
}

export function summarizeDocumentValidity(documents: ComplianceDocument[], today: string) {
  return documents.reduce<Record<DocumentValidity, number>>((summary, document) => ({ ...summary, [documentValidity(document, today)]: summary[documentValidity(document, today)] + 1 }), { valid: 0, expiring: 0, expired: 0, no_expiry: 0 });
}

export async function checksumFile(file: Blob): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, "0")).join("");
}
