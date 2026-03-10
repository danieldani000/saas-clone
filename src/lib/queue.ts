import { Queue } from "bullmq";

const connection = {
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
};

export const runsQueue = new Queue("agent-runs", { connection });
