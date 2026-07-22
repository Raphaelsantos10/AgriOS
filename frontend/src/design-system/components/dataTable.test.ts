import { describe, expect, it } from "vitest";
import type { DataColumn } from "./DataTable";
type Row = { id: string; name: string };
describe("contrato da DataTable", () => { it("aceita colunas reutilizáveis e chaves estáveis", () => { const rows: Row[] = [{ id: "1", name: "Quinta Norte" }]; const columns: DataColumn<Row>[] = [{ id: "name", header: "Nome", cell: row => row.name }]; expect(columns[0].cell(rows[0])).toBe("Quinta Norte"); expect(rows.map(row => row.id)).toEqual(["1"]); }); });
