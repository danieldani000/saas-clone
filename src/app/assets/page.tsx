export const dynamic = "force-dynamic";
import "@/components/dashboard.css";
import { AssetsToolbar } from "@/components/AssetsToolbar";
import { AssetCard } from "@/components/AssetCard";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/PageHeader";

export default async function AssetsPage() {
  const outputs = await db.output.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 60 });

  return (
    <main style={{ padding: 24 }}>
      <PageHeader
        title="Assets Library"
        subtitle="Manage generated images/videos/templates with search and quick actions."
        actions={[
          { label: "Trash", href: "/assets/trash" },
          { label: "Folders" },
          { label: "Create collection", primary: true }
        ]}
      />
      <AssetsToolbar />

      {outputs.length === 0 ? (
        <section className="section">
          <div className="emptyState">
            <h3>No assets yet</h3>
            <p>Run your first generation in Studio to populate this library.</p>
            <div className="actions">
              <a className="btnPrimary" href="/studio">Open studio</a>
              <a className="btnGhost" href="/dashboard#quick">Use template</a>
            </div>
          </div>
        </section>
      ) : (
        <div className="masonry">
          {outputs.map((o) => (
            <AssetCard key={o.id} output={o} />
          ))}
        </div>
      )}
    </main>
  );
}
