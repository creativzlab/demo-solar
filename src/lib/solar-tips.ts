export type SolarTip = {
  title: string;
  body: string;
  emphasis: string;
};

export const solarTips: readonly SolarTip[] = [
  {
    title: "Conta de luz muito mais leve",
    body: "Com energia solar, você pode reduzir bastante o valor pago todos os meses.",
    emphasis: "É mais dinheiro sobrando no seu bolso.",
  },
  {
    title: "Mais proteção contra aumentos",
    body: "Quando a tarifa de energia sobe, quem produz a própria energia sente menos esse impacto.",
    emphasis: "Você ganha mais previsibilidade no orçamento.",
  },
  {
    title: "Economia por muitos anos",
    body: "Um sistema solar pode continuar gerando energia e economia por décadas.",
    emphasis: "Você investe uma vez e aproveita o benefício por muito tempo.",
  },
  {
    title: "Seu imóvel ganha mais valor",
    body: "Energia solar é uma melhoria que deixa sua casa ou empresa mais moderna e econômica.",
    emphasis: "Além de economizar, você valoriza seu patrimônio.",
  },
  {
    title: "Mais liberdade para consumir energia",
    body: "Ar-condicionado, máquinas, equipamentos e eletrônicos pesam menos no bolso quando você gera parte da própria energia.",
    emphasis: "Mais conforto sem tanto medo da conta no fim do mês.",
  },
  {
    title: "Um investimento que trabalha por você",
    body: "Enquanto houver sol, seu sistema continua produzindo energia e ajudando a reduzir seus gastos.",
    emphasis: "Seu telhado passa a gerar economia todos os dias.",
  },
] as const;
