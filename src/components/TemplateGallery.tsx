const CATEGORIES = ["UGC", "Product photo", "Static ads", "Video ads", "Lifestyle", "Fashion"];

export function TemplateGallery() {
  return (
    <section className="section">
      <div className="sectionHead">
        <h2 style={{ margin: 0 }}>Discover templates</h2>
        <button className="btnGhost">See more</button>
      </div>
      <div className="tabsRow">
        {CATEGORIES.map((c, i) => (
          <button key={c} className={`tabBtn ${i === 0 ? "active" : ""}`}>{c}</button>
        ))}
      </div>
      <div className="quickGrid">
        {Array.from({ length: 12 }).map((_, i) => (
          <article key={i} className="quickCard">
            <div className="thumb" />
            <h3>Template #{i + 1}</h3>
            <p>Ready-to-use workflow for creatives and ads.</p>
            <span className="tag">Popular</span>
          </article>
        ))}
      </div>
    </section>
  );
}
