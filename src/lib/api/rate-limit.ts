import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const redis = new Redis(redisUrl);

const WINDOW_SECONDS = Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 60);
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX || 120);

export async function checkRateLimit(keyId: string) {
  const nowWindow = Math.floor(Date.now() / 1000 / WINDOW_SECONDS);
  const redisKey = `rl:${keyId}:${nowWindow}`;

  const count = await redis.incr(redisKey);
  if (count === 1) {
    await redis.expire(redisKey, WINDOW_SECONDS + 5);
  }

  return {
    allowed: count <= MAX_REQUESTS,
    count,
    limit: MAX_REQUESTS,
    windowSeconds: WINDOW_SECONDS
  };
}
