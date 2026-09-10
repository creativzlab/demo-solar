import assert from "node:assert/strict";
import test from "node:test";
import type { LeadInput } from "../src/lib/lead-schema.ts";
import { normalizeBrazilianPhone, qualifySolarLead } from "../src/lib/solar-qualification.ts";

const baseLead: LeadInput = {
  name: "Lead Demonstração",
  phone: "(11) 99999-9999",
  neighborhood: "Centro",
  propertyType: "Casa",
  monthlyBill: 400,
  roofType: "Outro / Não Sei",
  installationTimeline: "Estou pesquisando",
  consent: true,
  startedAt: Date.now(),
  website: "",
};

test("classifica um projeto imediato e de alto consumo como quente", () => {
  const result = qualifySolarLead({
    ...baseLead,
    propertyType: "Empresa / Condomínio",
    monthlyBill: 2_000,
    roofType: "Metálica",
    installationTimeline: "Imediatamente",
  });

  assert.deepEqual(result, { score: 90, temperature: "Quente", qualified: true });
});

test("mantém um visitante em pesquisa e com baixo consumo na triagem", () => {
  assert.deepEqual(qualifySolarLead(baseLead), { score: 20, temperature: "Frio", qualified: false });
});

test("normaliza telefones brasileiros para E.164", () => {
  assert.equal(normalizeBrazilianPhone("(11) 99999-9999"), "+5511999999999");
  assert.equal(normalizeBrazilianPhone("+55 11 99999-9999"), "+5511999999999");
});
