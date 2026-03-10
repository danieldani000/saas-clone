export function KpiRow({ total, done, failed }: { total: number; done: number; failed: number }) {
  const successRate = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="kpis">
      <div className="card"><h4>Total runs</h4><div className="value">{total}</div></div>
      <div className="card"><h4>Done</h4><div className="value">{done}</div></div>
      <div className="card"><h4>Failed</h4><div className="value">{failed}</div></div>
      <div className="card"><h4>Success rate</h4><div className="value">{successRate}%</div></div>
    </div>
  );
}
