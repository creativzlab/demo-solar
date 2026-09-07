import "server-only";

import { createHash } from "node:crypto";
import { approvedDsiWebhookUrl } from "@/lib/dsi-webhook";
import { LeadInput, toGhlPayload } from "@/lib/lead-schema";

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

export async function sendLeadToDsi(input: LeadInput) {
  if (!process.env.GHL_DEMANDA_INFINITA_WEBHOOK_URL?.trim()) {
    return { delivered: false, demoMode: true };
  }

  const webhookUrl = approvedDsiWebhookUrl(process.env.GHL_DEMANDA_INFINITA_WEBHOOK_URL);

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toGhlPayload(input)),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`DSI webhook returned ${response.status}`);
  }

  return { delivered: true, demoMode: false };
}
