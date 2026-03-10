"use client";

import { useState } from "react";
import type { Output } from "@prisma/client";

export function DeletedAssetRow({ asset }: { asset: Output }) {
  const [restored, setRestored] = useState(false);

  async function restore() {
    const res = await fetch(`/api/v1/assets/${asset.id}/restore`, { method: "POST" });
    if (res.ok) setRestored(true);
  }

  if (restored) return null;

  return (
    <tr>
      <td><code>{asset.id.slice(0, 10)}...</code></td>
      <td>{asset.kind}</td>
      <td>{asset.uri?.split("/").pop()}</td>
      <td>{asset.deletedAt ? new Date(asset.deletedAt).toLocaleString() : "-"}</td>
      <td><button className="btnGhost" onClick={restore}>Restore</button></td>
    </tr>
  );
}
