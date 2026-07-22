import { describe, expect, it } from "vitest";
import { paginationItems } from "./paginationUtils";
describe("paginação do Design System", () => { it("mostra todas as páginas em conjuntos pequenos", () => expect(paginationItems(2, 4)).toEqual([1, 2, 3, 4])); it("reduz conjuntos longos preservando início, contexto e fim", () => expect(paginationItems(10, 20)).toEqual([1, "ellipsis", 9, 10, 11, "ellipsis", 20])); it("normaliza páginas fora do intervalo", () => { expect(paginationItems(0, 10)).toContain(1); expect(paginationItems(99, 10)).toContain(10); }); });
