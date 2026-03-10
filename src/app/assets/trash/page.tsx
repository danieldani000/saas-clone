export const dynamic = "force-dynamic";
import "@/components/dashboard.css";
import { db } from "@/lib/db";
import { DeletedAssetRow } from "@/components/DeletedAssetRow";

export default async function AssetsTrashPage() {
  const deleted = await db.output.findMany({
    where: { NOT: { deletedAt: null } },
    orderBy: { deletedAt: "desc" },
    take: 100
  });

  return (
    <main style={{ padding: 24 }}>
      <div className="topbar" style={{ marginBottom: 10 }}>
        <h1 style={{ margin: 0 }}>Trash</h1>
        <div className="actions"><a className="btnGhost" href="/assets">Back to Assets</a></div>
      </div>
      <section className="section">
        {deleted.length === 0 ? (
          <p className="muted">Trash is empty.</p>
        ) : (
          <table className="table">
            <thead><tr><th>ID</th><th>Kind</th><th>Name</th><th>Deleted at</th><th>Action</th></tr></thead>
            <tbody>
              {deleted.map((a) => (
                <DeletedAssetRow key={a.id} asset={a} />
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
