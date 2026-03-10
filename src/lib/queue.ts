import { Queue } from "bullmq";

let _runsQueue: Queue | null = null;

export function getRunsQueue(): Queue {
  if (!_runsQueue) {
    _runsQueue = new Queue("agent-runs", {
      connection: { url: process.env.REDIS_URL || "redis://127.0.0.1:6379" }
    });
  }
  return _runsQueue;
}

// Lazy proxy so importing this module doesn't connect to Redis at build time
export const runsQueue = {
  add: (...args: Parameters<Queue["add"]>) => getRunsQueue().add(...args)
};
