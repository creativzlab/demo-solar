import { z } from "zod";
import { isValidBrazilianPhone, normalizeBrazilianPhone } from "./br-phone.ts";

export const propertyTypes = ["Casa", "Empresa / Condomínio"] as const;
export const roofTypes = ["Colonial", "Metálica", "Fibrocimento", "Laje", "Outro / Não Sei"] as const;
export const installationTimelines = ["Imediatamente", "Até 30 dias", "De 31 a 90 dias", "De 3 a 6 meses", "Estou pesquisando"] as const;

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().refine(isValidBrazilianPhone, {
    message: "Informe um telefone brasileiro válido com DDD.",
  }),
  neighborhood: z.string().trim().min(2).max(100),
  propertyType: z.enum(propertyTypes),
  monthlyBill: z.number().int().min(400).max(5000),
  roofType: z.enum(roofTypes),
  installationTimeline: z.enum(installationTimelines),
  consent: z.literal(true),
  startedAt: z.number().int().positive(),
  website: z.string().max(0).optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;

export function normalizePhone(phone: string) {
  return normalizeBrazilianPhone(phone);
}

export function monthlyBillRange(monthlyBill: number) {
  if (monthlyBill < 300) return "Menos de R$ 300";
  if (monthlyBill < 600) return "Entre R$ 300 e R$ 600";
  if (monthlyBill < 1000) return "Entre R$ 600 e R$ 1.000";
  if (monthlyBill < 2000) return "Entre R$ 1.000 e R$ 2.000";
  if (monthlyBill < 5000) return "Entre R$ 2.000 e R$ 5.000";
  return "Mais de R$ 5.000";
}

export function installationTimelineCode(timeline: LeadInput["installationTimeline"]) {
  return {
    "Imediatamente": "immediately",
    "Até 30 dias": "0_30_days",
    "De 31 a 90 dias": "31_90_days",
    "De 3 a 6 meses": "91_180_days",
    "Estou pesquisando": "researching",
  }[timeline];
}

export function scoreLead(input: LeadInput) {
  let score = 20;

  if (input.monthlyBill >= 2000) score += 25;
  else if (input.monthlyBill >= 1200) score += 20;
  else if (input.monthlyBill >= 800) score += 15;
  else score += 5;

  if (input.propertyType === "Empresa / Condomínio") score += 10;
  if (input.roofType !== "Outro / Não Sei") score += 10;
  if (input.neighborhood.length >= 2) score += 20;

  if (input.installationTimeline === "Imediatamente") score += 25;
  else if (input.installationTimeline === "Até 30 dias") score += 20;
  else if (input.installationTimeline === "De 31 a 90 dias") score += 15;
  else if (input.installationTimeline === "De 3 a 6 meses") score += 8;

  return Math.min(score, 100);
}

export function toGhlPayload(input: LeadInput) {
  const segment = input.propertyType === "Casa" ? "Residencial" : "Comercial";
  const [firstName, ...lastNameParts] = input.name.trim().split(/\s+/);

  return {
    data: {
      name: input.name,
      first_name: firstName,
      last_name: lastNameParts.join(" "),
      phone: normalizePhone(input.phone),
      neighborhood: input.neighborhood,
      segment,
      property_type: input.propertyType,
      monthly_bill: String(input.monthlyBill),
      monthly_bill_range: monthlyBillRange(input.monthlyBill),
      roof_type: input.roofType,
      installation_timeline: input.installationTimeline,
      installation_timeline_code: installationTimelineCode(input.installationTimeline),
      qualification_score: String(scoreLead(input)),
      source_detail: "Demo Solar | CreativzLab",
      integration_schema: "demo-solar-creativzlab-v1",
      consent: true,
    },
  };
}
