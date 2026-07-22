import type { ReactNode } from "react";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import { Inbox } from "lucide-react";

export type DataColumn<T> = { id: string; header: string; cell: (row: T) => ReactNode; className?: string };
type Props<T> = { rows: T[]; columns: DataColumn<T>[]; rowKey: (row: T) => string; loading?: boolean; emptyTitle?: string; emptyDescription?: string; mobileCard?: (row: T) => ReactNode; caption?: string };
export default function DataTable<T>({ rows, columns, rowKey, loading, emptyTitle = "Nenhum registo encontrado", emptyDescription = "Altere os filtros ou adicione um novo registo.", mobileCard, caption }: Props<T>) {
  if (loading) return <LoadingState label="A carregar registos…"/>;
  if (!rows.length) return <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription}/>;
  return <>{mobileCard ? <div className="divide-y divide-[var(--farpha-border)] lg:hidden">{rows.map(row => <article key={rowKey(row)} className="p-4">{mobileCard(row)}</article>)}</div> : null}<div className={`${mobileCard ? "hidden lg:block" : "block"} overflow-x-auto`}><table className="w-full min-w-[760px] border-collapse text-left"><caption className="sr-only">{caption ?? "Tabela de dados"}</caption><thead className="bg-[var(--farpha-surface-muted)] text-xs uppercase tracking-wider text-[var(--farpha-text-muted)]"><tr>{columns.map(column => <th key={column.id} scope="col" className={`px-5 py-3 font-extrabold ${column.className ?? ""}`}>{column.header}</th>)}</tr></thead><tbody className="divide-y divide-[var(--farpha-border)]">{rows.map(row => <tr key={rowKey(row)} className="transition hover:bg-[var(--farpha-surface-muted)]">{columns.map(column => <td key={column.id} className={`px-5 py-4 align-middle ${column.className ?? ""}`}>{column.cell(row)}</td>)}</tr>)}</tbody></table></div></>;
}
