"use client";

import { useState } from "react";
import type { Output } from "@prisma/client";
import { getPreviewFromMetadata } from "@/lib/assets/preview";

export function AssetCard({ output }: { output: Output }) {
  const [open, setOpen] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [duplicated, setDuplicated] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const kind = output.kind || "asset";
  const title = output.uri?.split("/").pop() || `asset-${output.id.slice(0, 8)}`;
  const preview = getPreviewFromMetadata(output.metadata as any);

  async function duplicateAsset() {
    setDuplicating(true);
    setDuplicated(false);
    const res = await fetch(`/api/v1/assets/${output.id}/duplicate`, { method: "POST" });
    setDuplicating(false);
    if (res.ok) setDuplicated(true);
  }

  async function deleteAsset() {
    setDeleting(true);
    const res = await fetch(`/api/v1/assets/${output.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      setDeleted(true);
      setShowUndo(true);
    }
  }

  async function undoDelete() {
    const res = await fetch(`/api/v1/assets/${output.id}/restore`, { method: "POST" });
    if (res.ok) {
      setDeleted(false);
      setShowUndo(false);
    }
  }

  if (deleted && !showUndo) return null;

  return (
    <>
      {deleted && showUndo ? (
        <article className="assetCard premium" style={{ padding: 12 }}>
          <div className="muted">Asset deleted.</div>
          <div style={{ marginTop: 8 }}><button className="btnGhost" onClick={undoDelete}>Undo</button></div>
        </article>
      ) : (
      <article className="assetCard premium">
        {preview.kind === "image" ? (
          <img src={preview.src} className="assetThumbMedia" alt={title} />
        ) : preview.kind === "video" ? (
          <video src={preview.src} className="assetThumbMedia" muted playsInline controls={false} />
        ) : (
          <div className="assetThumb" style={{ height: 160 + ((output.version % 4) * 30) }} />
        )}

        <div style={{ padding: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <b>{title}</b>
            <span className="tag">{kind}</span>
          </div>
          <div className="muted">Version {output.version} • {new Date(output.createdAt).toLocaleString()}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btnGhost" onClick={() => setOpen(true)}>Open</button>
            <button className="btnGhost" onClick={duplicateAsset} disabled={duplicating}>{duplicating ? "Duplicating..." : "Duplicate"}</button>
            <button className="btnGhost" onClick={deleteAsset} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</button>
          </div>
          {duplicated && <div className="muted" style={{ marginTop: 6 }}>Duplicated successfully.</div>}
        </div>
      </article>
      )}

      {open && (
        <div className="modalBackdrop" onClick={() => setOpen(false)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="sectionHead">
              <h2 style={{ margin: 0 }}>{title}</h2>
              <button className="btnGhost" onClick={() => setOpen(false)}>Close</button>
            </div>
            {preview.kind === "image" ? (
              <img src={preview.src} style={{ width: "100%", borderRadius: 12, border: "1px solid #e8eaf2" }} alt={title} />
            ) : preview.kind === "video" ? (
              <video src={preview.src} style={{ width: "100%", borderRadius: 12, border: "1px solid #e8eaf2" }} controls />
            ) : (
              <div className="section"><p className="muted">No preview available for this asset.</p></div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
