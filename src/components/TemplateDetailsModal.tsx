"use client";

import { useState } from "react";

export function TemplateDetailsModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="btnGhost" onClick={() => setOpen(true)}>Preview template</button>
      {open && (
        <div className="modalBackdrop" onClick={() => setOpen(false)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="sectionHead">
              <h2 style={{ margin: 0 }}>UGC Product Video Template</h2>
              <button className="btnGhost" onClick={() => setOpen(false)}>Close</button>
            </div>
            <p className="muted">High-converting structure inspired by top-performing ad creatives.</p>
            <div className="quickGrid">
              <article className="quickCard"><h3>Hook</h3><p>Strong scroll-stopping opener for first 2 seconds.</p></article>
              <article className="quickCard"><h3>Body</h3><p>Problem/solution + social proof + feature highlight.</p></article>
              <article className="quickCard"><h3>CTA</h3><p>Clear conversion-oriented close.</p></article>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button className="btn">Use template</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
