import { z } from "zod";
import { isValidBrazilianPhone } from "./br-phone.ts";

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
