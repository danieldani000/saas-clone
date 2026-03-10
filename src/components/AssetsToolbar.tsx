"use client";

import { useState } from "react";

export function AssetsToolbar() {
  const [q, setQ] = useState("");
  return (
    <div className="section" style={{ marginBottom: 12 }}>
      <div className="assetsToolbar">
        <input className="input" placeholder="Search assets, campaigns, tags..." value={q} onChange={(e)=>setQ(e.target.value)} />
        <select className="input"><option>All types</option><option>Image</option><option>Video</option><option>Text</option></select>
        <select className="input"><option>Newest</option><option>Most used</option><option>Best CTR</option></select>
        <button className="btn">Export</button>
      </div>
    </div>
  );
}
