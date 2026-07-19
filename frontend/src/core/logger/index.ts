type LogPayload = unknown[];

export const logger = {
  info: (...payload: LogPayload) => console.info("[FARPHA]", ...payload),
  warn: (...payload: LogPayload) => console.warn("[FARPHA]", ...payload),
  error: (...payload: LogPayload) => console.error("[FARPHA]", ...payload),
};
