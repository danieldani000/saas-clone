import "@/components/dashboard.css";

export default function LoadingDashboard() {
  return (
    <main className="shell">
      <aside className="sidebar" />
      <div className="main">
        <div className="skeleton skTitle" />
        <div className="kpis">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card"><div className="skeleton skLine" /></div>)}
        </div>
        <section className="section"><div className="skeleton skBlock" /></section>
      </div>
    </main>
  );
}
