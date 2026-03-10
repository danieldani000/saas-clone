export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const cls = s === "done" ? "badge success" : s === "failed" ? "badge danger" : "badge";
  return <span className={cls}>{status}</span>;
}
