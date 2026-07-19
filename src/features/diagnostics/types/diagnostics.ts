export type DiagnosticStatus = "operational" | "warning" | "error" | "pending";

export type DiagnosticCategory = "core" | "data" | "integration";

export type DiagnosticItem = {
  id: string;
  label: string;
  description: string;
  category: DiagnosticCategory;
  status: DiagnosticStatus;
  latencyMs?: number;
  details?: string;
  checkedAt: string;
};

export type DiagnosticReport = {
  status: DiagnosticStatus;
  items: DiagnosticItem[];
  startedAt: string;
  finishedAt: string;
  durationMs: number;
};
