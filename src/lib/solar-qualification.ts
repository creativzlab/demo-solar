import type { LeadInput } from "./lead-schema.ts";

export type LeadTemperature = "Quente" | "Morno" | "Frio";

export function qualifySolarLead(lead: LeadInput) {
  const billScore = lead.monthlyBill >= 1_800 ? 40 : lead.monthlyBill >= 1_200 ? 35 : lead.monthlyBill >= 800 ? 25 : 15;
  const timelineScore: Record<LeadInput["installationTimeline"], number> = {
    Imediatamente: 30,
    "Até 30 dias": 25,
    "De 31 a 90 dias": 15,
    "De 3 a 6 meses": 8,
    "Estou pesquisando": 0,
  };
  const propertyScore = lead.propertyType === "Empresa / Condomínio" ? 10 : 5;
  const roofScore = lead.roofType === "Outro / Não Sei" ? 0 : 10;
  const score = billScore + timelineScore[lead.installationTimeline] + propertyScore + roofScore;
  const temperature: LeadTemperature = score >= 60 ? "Quente" : score >= 40 ? "Morno" : "Frio";

  return { score, temperature, qualified: score >= 40 };
}

export function normalizeBrazilianPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `+${digits.startsWith("55") ? digits : `55${digits}`}`;
}
