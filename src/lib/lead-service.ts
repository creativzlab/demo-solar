import "server-only";

import { createHash } from "node:crypto";
import type { LeadInput } from "./lead-schema";
import { normalizeBrazilianPhone, qualifySolarLead, type LeadTemperature } from "./solar-qualification";

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

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const LOCATION_ID = "zLW2KVtkyIj7fVOAeABX";
const PIPELINE_ID = "pvezKahdvq6niyouipfX";
const SURVEY_STAGE_ID = process.env.GHL_DEMANDA_INFINITA_SURVEY_STAGE_ID ?? "dd3f0404-1f19-476f-aea1-31198930101c";
const QUALIFIED_STAGE_ID = process.env.GHL_DEMANDA_INFINITA_QUALIFIED_STAGE_ID ?? "14733419-cb09-4d75-8e24-cdcd59f0f259";

const FIELD_IDS = {
  source: "PnmwtMhnkBf2tgWyz4Mc",
  propertyType: "AskfNbrOkMo2b4J6WRsL",
  monthlyBill: "lGuQJj2UkSwDiT3yqEsc",
  roofType: "eVVDtAlZkmNtJf7SOCac",
  neighborhood: "PmIIEfvB05RlHg27JzxM",
  installationTimeline: "sl3ImtljKRI3dhJ1cTV5",
  temperature: "kRtNSG3je7el4U0n47iV",
  score: "GpSIyULlDp6FBjaWYxor",
  journeyStatus: "4vf5UzkEDHuflW1cbsHP",
  aiSummary: "8EhMsplgzqYWQIKdlOHQ",
  consent: "FmKNRoUorloozeptYwXq",
} as const;

function splitName(name: string) {
  const [firstName, ...rest] = name.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") || undefined };
}

async function ghlRequest<T>(path: string, init: RequestInit = {}) {
  const token = process.env.GHL_DEMANDA_INFINITA_API_KEY;
  if (!token) throw new Error("GHL_DEMANDA_INFINITA_API_KEY is not configured");

  const response = await fetch(`${GHL_API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Version: "v3",
      ...init.headers,
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) throw new Error(`HighLevel ${response.status}: ${payload.message ?? "request failed"}`);
  return payload;
}

function leadSummary(lead: LeadInput, score: number, temperature: LeadTemperature) {
  return [
    `Survey Solar | ${temperature} (${score}/90)`,
    `Imóvel: ${lead.propertyType}`,
    `Conta: R$ ${lead.monthlyBill.toLocaleString("pt-BR")}/mês`,
    `Telhado: ${lead.roofType}`,
    `Bairro: ${lead.neighborhood}`,
    `Prazo: ${lead.installationTimeline}`,
    "Origem: demosolar.creativzlab.com",
  ].join("\n");
}

export async function acceptDemoLead(lead: LeadInput) {
  if (!process.env.GHL_DEMANDA_INFINITA_API_KEY) {
    if (process.env.NODE_ENV === "production") throw new Error("Demanda Infinita integration is not configured");
    return { delivered: false, demoMode: true };
  }

  const qualification = qualifySolarLead(lead);
  const summary = leadSummary(lead, qualification.score, qualification.temperature);
  const { firstName, lastName } = splitName(lead.name);
  const customFields = [
    { id: FIELD_IDS.source, fieldValue: "Website | Survey Solar" },
    { id: FIELD_IDS.propertyType, fieldValue: lead.propertyType },
    { id: FIELD_IDS.monthlyBill, fieldValue: String(lead.monthlyBill) },
    { id: FIELD_IDS.roofType, fieldValue: lead.roofType },
    { id: FIELD_IDS.neighborhood, fieldValue: lead.neighborhood },
    { id: FIELD_IDS.installationTimeline, fieldValue: lead.installationTimeline },
    { id: FIELD_IDS.temperature, fieldValue: qualification.temperature },
    { id: FIELD_IDS.score, fieldValue: String(qualification.score) },
    { id: FIELD_IDS.journeyStatus, fieldValue: "Survey concluída" },
    { id: FIELD_IDS.aiSummary, fieldValue: summary },
    { id: FIELD_IDS.consent, fieldValue: "Sim" },
  ];

  const contactResult = await ghlRequest<{ contact: { id: string } }>("/contacts/upsert", {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      name: lead.name,
      phone: normalizeBrazilianPhone(lead.phone),
      locationId: LOCATION_ID,
      source: "Demanda Infinita | Survey Solar",
      country: "BR",
      customFields,
    }),
  });
  const contactId = contactResult.contact.id;
  const tags = ["ds-origem-site", "ds-survey-concluida", `ds-lead-${qualification.temperature.toLowerCase()}`];
  await ghlRequest(`/contacts/${contactId}/tags`, { method: "POST", body: JSON.stringify({ tags }) });

  const query = new URLSearchParams({
    locationId: LOCATION_ID,
    pipelineId: PIPELINE_ID,
    contactId,
    status: "open",
    limit: "20",
    page: "1",
  });
  const existing = await ghlRequest<{ opportunities: Array<{ id: string }> }>(`/opportunities/search?${query}`);
  const opportunityBody = {
    pipelineId: PIPELINE_ID,
    pipelineStageId: qualification.qualified ? QUALIFIED_STAGE_ID : SURVEY_STAGE_ID,
    name: `Projeto Solar | ${lead.name}`,
    status: "open",
    monetaryValue: 0,
  };

  if (existing.opportunities[0]) {
    await ghlRequest(`/opportunities/${existing.opportunities[0].id}`, {
      method: "PUT",
      body: JSON.stringify(opportunityBody),
    });
  } else {
    await ghlRequest("/opportunities/", {
      method: "POST",
      body: JSON.stringify({ ...opportunityBody, locationId: LOCATION_ID, contactId }),
    });
  }

  await ghlRequest(`/contacts/${contactId}/notes`, {
    method: "POST",
    body: JSON.stringify({ title: "Survey Solar recebida", body: summary, color: "#F97316", pinned: true }),
  });

  return { delivered: true, demoMode: false, contactId };
}
