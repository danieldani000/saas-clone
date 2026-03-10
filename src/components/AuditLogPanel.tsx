import { db } from "@/lib/db";

export async function AuditLogPanel({ workspaceId }: { workspaceId?: string }) {
  const logs = await db.auditLog.findMany({
    where: workspaceId ? { workspaceId } : undefined,
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <section>
      <h2>Audit logs (latest 20)</h2>
      {logs.length === 0 ? (
        <p>No audit logs yet.</p>
      ) : (
        <ul>
          {logs.map((l) => (
            <li key={l.id}>
              <code>{l.createdAt.toISOString()}</code> — <b>{l.event}</b> — {l.level}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
