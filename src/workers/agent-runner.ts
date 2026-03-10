import { Worker } from "bullmq";
import { db } from "@/lib/db";
import { executeAgent } from "@/lib/providers/engine";

type RunJob = { runId: string };

const worker = new Worker<RunJob>(
  "agent-runs",
  async (job) => {
    const run = await db.agentRun.findUnique({ where: { id: job.data.runId }, include: { agent: true } });
    if (!run) return;

    await db.agentRun.update({
      where: { id: run.id },
      data: { status: "running", startedAt: new Date() }
    });

    try {
      await db.agentRunStep.create({
        data: { runId: run.id, stepKey: "execute", status: "running", payload: undefined }
      });

      const result = await executeAgent(run.agent.slug, (run.input as Record<string, unknown>) || {});

      await db.output.create({
        data: {
          workspaceId: run.workspaceId,
          runId: run.id,
          kind: result.kind,
          uri: `internal://runs/${run.id}/result.${result.kind === "text" ? "txt" : "json"}`,
          metadata: result.data
        }
      });

      await db.usageEvent.create({
        data: {
          workspaceId: run.workspaceId,
          runId: run.id,
          metric: "credits",
          value: 1
        }
      });

      await db.agentRunStep.create({
        data: { runId: run.id, stepKey: "execute", status: "done", payload: result.data }
      });

      await db.agentRun.update({
        where: { id: run.id },
        data: {
          status: "done",
          output: result.data,
          finishedAt: new Date()
        }
      });
    } catch (error) {
      await db.agentRun.update({
        where: { id: run.id },
        data: {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown worker error",
          finishedAt: new Date()
        }
      });
    }
  },
  { connection: { url: process.env.REDIS_URL || "redis://127.0.0.1:6379" } }
);

worker.on("failed", (job, err) => {
  console.error("Run job failed", job?.id, err.message);
});
