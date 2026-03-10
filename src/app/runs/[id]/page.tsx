export const dynamic = "force-dynamic";
import { db } from "@/lib/db";

export default async function RunDetailPage({ params }: { params: { id: string } }) {
  const run = await db.agentRun.findUnique({
    where: { id: params.id },
    include: { steps: true, outputs: true, agent: true }
  });

  if (!run) return <main style={{ padding: 24 }}>Run not found</main>;

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", display: "grid", gap: 12 }}>
      <h1>Run {run.id}</h1>
      <p>Status: <b>{run.status}</b></p>
      <p>Agent: <b>{run.agent.name}</b></p>

      <h3>Input</h3>
      <pre>{JSON.stringify(run.input, null, 2)}</pre>

      <h3>Output</h3>
      <pre>{JSON.stringify(run.output, null, 2)}</pre>

      <h3>Generated assets</h3>
      <pre>{JSON.stringify(run.outputs, null, 2)}</pre>
    </main>
  );
}
