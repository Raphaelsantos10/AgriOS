import type { ComplianceDocument, StoredComplianceDocument } from "../types/compliance";

const DB_NAME = "farpha-compliance-documents";
const STORE_NAME = "documents";
const DB_VERSION = 1;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => { const database = request.result; if (!database.objectStoreNames.contains(STORE_NAME)) database.createObjectStore(STORE_NAME, { keyPath: "id" }); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Não foi possível abrir o armazenamento documental local."));
  });
}

async function transaction<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore, resolve: (value: T) => void, reject: (reason?: unknown) => void) => void): Promise<T> {
  const database = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, mode);
    operation(tx.objectStore(STORE_NAME), resolve, reject);
    tx.oncomplete = () => database.close();
    tx.onerror = () => { database.close(); reject(new Error("A operação documental local falhou.")); };
  });
}

export function listComplianceDocuments(): Promise<ComplianceDocument[]> {
  return transaction("readonly", (store, resolve, reject) => { const request = store.getAll(); request.onsuccess = () => resolve((request.result as StoredComplianceDocument[]).map(({ file, ...metadata }) => { void file; return metadata; })); request.onerror = () => reject(request.error); });
}

export function getComplianceDocument(id: string): Promise<StoredComplianceDocument | null> {
  return transaction("readonly", (store, resolve, reject) => { const request = store.get(id); request.onsuccess = () => resolve((request.result as StoredComplianceDocument | undefined) ?? null); request.onerror = () => reject(request.error); });
}

export function saveComplianceDocument(document: StoredComplianceDocument): Promise<void> {
  return transaction("readwrite", (store, resolve, reject) => { const request = store.put(document); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); });
}

export function deleteComplianceDocument(id: string): Promise<void> {
  return transaction("readwrite", (store, resolve, reject) => { const request = store.delete(id); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); });
}

export async function downloadComplianceDocument(id: string): Promise<void> {
  const document = await getComplianceDocument(id); if (!document) throw new Error("Documento não encontrado neste dispositivo.");
  const url = URL.createObjectURL(document.file); const link = window.document.createElement("a"); link.href = url; link.download = document.fileName; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
