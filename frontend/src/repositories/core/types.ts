export type RepositoryError = {
  message: string;
  code?: string;
  details?: string;
};

export type RepositoryResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: RepositoryError };

export function toRepositoryError(error: unknown): RepositoryError {
  if (error && typeof error === "object") {
    const candidate = error as {
      message?: unknown;
      code?: unknown;
      details?: unknown;
    };

    return {
      message:
        typeof candidate.message === "string"
          ? candidate.message
          : "Ocorreu um erro inesperado.",
      code: typeof candidate.code === "string" ? candidate.code : undefined,
      details:
        typeof candidate.details === "string" ? candidate.details : undefined,
    };
  }

  return {
    message: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
  };
}

export function unwrapRepositoryResult<T>(result: RepositoryResult<T>): T {
  if (result.ok) return result.data;

  const error = new Error(result.error.message) as Error & {
    code?: string;
    details?: string;
  };
  error.code = result.error.code;
  error.details = result.error.details;
  throw error;
}
