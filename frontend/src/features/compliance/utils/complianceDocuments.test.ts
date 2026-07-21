import { describe, expect, it } from "vitest";
import type { ComplianceDocument } from "../types/compliance";
import { documentValidity, MAX_DOCUMENT_SIZE, summarizeDocumentValidity, validateComplianceFile } from "./complianceDocuments";

const document = (expiresAt: string): ComplianceDocument => ({ id: expiresAt || "none", obligationId: "water", title: "Licença", category: "licence", issuer: "APA", reference: "", issuedAt: "", expiresAt, fileName: "licenca.pdf", mimeType: "application/pdf", size: 100, checksum: "abc", addedAt: "2026-07-20" });

describe("documentos de conformidade", () => {
  it("aceita apenas formatos seguros e ficheiros até 5 MB", () => {
    expect(validateComplianceFile({ type: "application/pdf", size: 200 })).toBeNull();
    expect(validateComplianceFile({ type: "text/html", size: 200 })).toContain("Formato");
    expect(validateComplianceFile({ type: "application/pdf", size: MAX_DOCUMENT_SIZE + 1 })).toContain("5 MB");
  });
  it("distingue documento expirado, próximo do prazo e válido", () => {
    expect(documentValidity(document("2026-07-19"), "2026-07-20")).toBe("expired");
    expect(documentValidity(document("2026-08-01"), "2026-07-20")).toBe("expiring");
    expect(documentValidity(document("2027-01-01"), "2026-07-20")).toBe("valid");
  });
  it("resume todos os documentos incluindo os sem validade", () => {
    const summary = summarizeDocumentValidity([document(""), document("2026-07-19"), document("2027-01-01")], "2026-07-20");
    expect(summary).toEqual({ valid: 1, expiring: 0, expired: 1, no_expiry: 1 });
  });
});
