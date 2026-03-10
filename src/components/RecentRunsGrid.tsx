import type { AgentRun, Agent } from "@prisma/client";
import { StatusBadge } from "@/components/StatusBadge";

type RunWithAgent = AgentRun & { agent: Agent };

export function RecentRunsGrid({ runs }: { runs: RunWithAgent[] }) {
  return (
    <section className="section" id="runs">
      <div className="sectionHead"><h2 style={{ margin: 0 }}>Recent runs</h2></div>

      {runs.length === 0 ? (
        <div className="emptyState">
          <h3>No runs yet</h3>
          <p>Create your first generation from the Generate Flow above.</p>
          <div className="actions"><a className="btnPrimary" href="#quick">Start now</a></div>
        </div>
      ) : (
        <div className="runGrid">
          {runs.map((r) => (
            <article key={r.id} className="runCard">
              <div className="runTop">
                <b>{r.agent.name}</b>
                <StatusBadge status={r.status} />
              </div>
              <div className="muted">Run ID: {r.id.slice(0, 12)}...</div>
              <div className="runActions">
                <a href={`/runs/${r.id}`} className="btnGhost">View details</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
