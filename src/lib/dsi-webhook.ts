import { createHash, timingSafeEqual } from "node:crypto";

export const DSI_LOCATION_ID = "ahAjUrjJqfj6IS2nDuNE";
export const DSI_LOCATION_NAME = "Demanda Solar Infinita";
export const DSI_WORKFLOW_ID = "2a34b652-3e7f-46af-bf88-e5268bca5262";
export const DSI_PIPELINE_ID = "oEBrYv2LW4kZJpT14lga";
export const DSI_PIPELINE_STAGE_ID = "967077dc-31b7-413f-975d-7c35b1e525ec";

const GHL_WEBHOOK_HOST = "services.leadconnectorhq.com";
const APPROVED_DSI_WEBHOOK_SHA256 = "79ad830f4deb9cc382a7dbb2423df6034a622bdf455c0f061a83fd64e015e46f";
const DSI_WEBHOOK_PATH = new RegExp(
  `^/hooks/${DSI_LOCATION_ID}/webhook-trigger/[A-Za-z0-9-]+$`,
);

export function isDsiWebhookDestination(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === GHL_WEBHOOK_HOST &&
      url.port === "" &&
      url.username === "" &&
      url.password === "" &&
      url.search === "" &&
      url.hash === "" &&
      DSI_WEBHOOK_PATH.test(url.pathname)
    );
  } catch {
    return false;
  }
}

export function approvedDsiWebhookUrl(value: string | undefined) {
  const webhookUrl = value?.trim();
  if (!webhookUrl) {
    throw new Error("DSI webhook is not configured");
  }

  if (!isDsiWebhookDestination(webhookUrl)) {
    throw new Error("Webhook destination is not the DSI subaccount");
  }

  const receivedHash = Buffer.from(createHash("sha256").update(webhookUrl).digest("hex"));
  const approvedHash = Buffer.from(APPROVED_DSI_WEBHOOK_SHA256);
  if (receivedHash.length !== approvedHash.length || !timingSafeEqual(receivedHash, approvedHash)) {
    throw new Error("Webhook is not the approved DSI workflow");
  }

  return webhookUrl;
}
