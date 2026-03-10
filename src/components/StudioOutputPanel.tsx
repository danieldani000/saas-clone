export function StudioOutputPanel() {
  return (
    <section className="studioOutput">
      <h3 style={{ marginTop: 0 }}>Latest outputs</h3>
      <div className="outputGrid">
        {Array.from({ length: 6 }).map((_, i) => (
          <article key={i} className="outputCard">
            <div className="outputThumb" />
            <div style={{ padding: 8 }}>
              <b>Output #{i + 1}</b>
              <div className="muted">Generated 2m ago</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
