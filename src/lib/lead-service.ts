import "server-only";

import { createHash } from "node:crypto";

const recentSubmissions = new Map<string, number>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 60 * 1000;
const MAX_RECENT_SUBMISSIONS = 2_500;
let nextCleanupAt = 0;

export function requestFingerprint(ip: string, userAgent: string, phone: string) {
  const secret = process.env.LEAD_FORM_SECRET ?? "demo-local-only";
  return createHash("sha256")
    .update(`${ip}|${userAgent}|${phone}|${secret}`)
    .digest("hex");
}
export function isRateLimited(fingerprint: string) {
  const now = Date.now();
  const lastSubmission = recentSubmissions.get(fingerprint);

  if (now >= nextCleanupAt) {
    for (const [key, timestamp] of recentSubmissions) {
      if (now - timestamp > RATE_WINDOW_MS) recentSubmissions.delete(key);
    }
    nextCleanupAt = now + CLEANUP_INTERVAL_MS;
  }

  if (lastSubmission && now - lastSubmission < RATE_WINDOW_MS) return true;

  if (recentSubmissions.size >= MAX_RECENT_SUBMISSIONS) {
    const oldestFingerprint = recentSubmissions.keys().next().value;
    if (oldestFingerprint) recentSubmissions.delete(oldestFingerprint);
  }

  recentSubmissions.set(fingerprint, now);
  return false;
}

export async function acceptDemoLead() {
  return { delivered: false, demoMode: true };
}
