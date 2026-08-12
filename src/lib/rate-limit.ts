const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

/**
 * In-memory sliding-window limiter. Fine for a single dev/local instance;
 * swap for Upstash Redis (per bao-mat-CHUAN-OWASP.md RULE-16) once this
 * runs on serverless with multiple instances.
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}

export function getClientIp(request: Request): string {
  const realIp = (request as unknown as { headers: Headers }).headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwardedFor = (request as unknown as { headers: Headers }).headers.get(
    "x-forwarded-for",
  );
  if (forwardedFor) {
    const hops = forwardedFor.split(",").map((h) => h.trim());
    return hops[hops.length - 1] || "unknown";
  }

  return "unknown";
}
