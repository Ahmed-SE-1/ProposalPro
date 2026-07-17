// lib/queryTracker.ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

function getDateKey(date: Date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Har successful generation ke baad ye call karein (proposal/email/cover-letter routes se)
export async function trackQuery() {
  const key = `query_count:${getDateKey(new Date())}`;
  await redis.incr(key);
  await redis.expire(key, 60 * 60 * 24 * 90); // 90 din baad auto-cleanup
}

// Admin dashboard ke liye — last N din ka daily breakdown
export async function getDailyStats(days: number) {
  const today = new Date();
  const keys: string[] = [];
  const dateLabels: string[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const label = getDateKey(d);
    keys.push(`query_count:${label}`);
    dateLabels.push(label);
  }

  const counts = await Promise.all(keys.map((k) => redis.get<number>(k)));

  const stats = dateLabels.map((date, i) => ({
    date,
    count: counts[i] || 0,
  }));

  return stats.reverse(); // oldest -> newest
}