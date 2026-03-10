type Level = "info" | "warn" | "error";

export function apiLog(level: Level, event: string, data: Record<string, unknown> = {}) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    ...data
  };
  // structured logs for ingestion
  console.log(JSON.stringify(payload));
}
