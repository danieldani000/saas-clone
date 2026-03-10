export function PlansCredits() {
  return (
    <section className="section" id="plans">
      <div className="sectionHead"><h2 style={{ margin: 0 }}>Plans & Credits</h2></div>
      <div className="quickGrid">
        <article className="quickCard">
          <h3>Free</h3>
          <p>100 credits / month. Great for tests.</p>
          <span className="tag">Current</span>
        </article>
        <article className="quickCard">
          <h3>Pro</h3>
          <p>2,000 credits / month. For active creators.</p>
          <button className="btn" style={{ marginTop: 8 }}>Upgrade</button>
        </article>
        <article className="quickCard">
          <h3>Growth</h3>
          <p>10,000 credits / month. Teams and scale.</p>
          <button className="btn" style={{ marginTop: 8 }}>Contact sales</button>
        </article>
      </div>
    </section>
  );
}
