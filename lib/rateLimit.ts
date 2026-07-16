// lib/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// ─── Rate Limiting (Device + IP based, per day) ──────────
const deviceLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(4, '24 h'),
  prefix: 'device_limit',
});

const ipLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(8, '24 h'),
  prefix: 'ip_limit',
});

export async function checkRateLimit(fingerprint: string, ip: string) {
  const [deviceResult, ipResult] = await Promise.all([
    deviceLimiter.limit(fingerprint || 'unknown-device'),
    ipLimiter.limit(ip || 'unknown-ip'),
  ]);

  if (!deviceResult.success) {
    return { allowed: false, reason: 'device', resetAt: deviceResult.reset };
  }
  if (!ipResult.success) {
    return { allowed: false, reason: 'ip', resetAt: ipResult.reset };
  }
  return { allowed: true };
}

// ─── Concurrent Request Queue (Gemini API ko overload hone se bachane ke liye) ──
const MAX_CONCURRENT = 10;
let activeRequests = 0;
const queue: (() => void)[] = [];

function processQueue() {
  if (queue.length === 0 || activeRequests >= MAX_CONCURRENT) return;

  const next = queue.shift();
  if (next) {
    activeRequests++;
    next();
  }
}

export function addToQueue<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const task = async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        activeRequests--;
        processQueue();
      }
    };

    queue.push(task);
    processQueue();
  });
}