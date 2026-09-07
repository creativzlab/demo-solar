"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Component as BudgetButton } from "@/components/ui/button";
import styles from "./faqs-component.module.css";

const faqItems = [
  {
    id: "item-1",
    question: "O investimento inicial é alto?",
    answer: "O sistema de energia solar pode ser parcelado em até 72 vezes. Em muitos casos, as parcelas são mais baixas que o valor da sua conta de luz, permitindo economia desde o primeiro mês.",
  },
  {
    id: "item-2",
    question: "Quanto tempo demora para o sistema de energia solar começar a gerar economia?",
    answer: "Após a instalação, que leva poucos dias, o sistema começa a gerar economia imediatamente. Em menos de 30 dias, você verá uma redução significativa na sua conta de luz.",
  },
  {
    id: "item-3",
    question: "E se houver algum problema com o sistema?",
    answer: "Oferecemos garantia de até 25 anos nos módulos fotovoltaicos e até 12 anos nos inversores e microinversores. Nosso suporte pós-venda premiado garante que você terá assistência rápida e eficiente, sempre que necessário.",
  },
  {
    id: "item-4",
    question: "A instalação vai danificar ou prejudicar a estética da minha casa?",
    answer: "Não. Garantimos uma instalação limpa e discreta, com toda a fiação interna em eletrodutos de PVC rígido, harmonizando os componentes com a estética da sua casa, sem deixar cabos ou quaisquer outros dispositivos visíveis que possam influenciar na estética.",
  },
  {
    id: "item-5",
    question: "Preciso de manutenção frequente no sistema?",
    answer: "A manutenção é mínima. Basta realizar uma limpeza periódica dos painéis para garantir a máxima eficiência. Fora isso, o sistema funciona de maneira autônoma e quase sem intervenção.",
  },
] as const;

type FAQsProps = {
  onRequestQuote: () => void;
};

export default function FAQs({ onRequestQuote }: FAQsProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <section className={styles.section} id="faq">
      <div className={styles.layout}>
        <div className={styles.intro} data-reveal>
          <span className={styles.tag}><i aria-hidden="true" />Dúvidas frequentes</span>
          <h2>Perguntas frequentes</h2>
          <p>Respostas diretas para você decidir com segurança se a energia solar faz sentido para o seu imóvel.</p>
          <BudgetButton title="Solicitar Orçamento Grátis" className={styles.cta} onClick={onRequestQuote} />
        </div>

        <div className={styles.accordion} data-reveal="soft">
          {faqItems.map((item, index) => {
            const isOpen = openItem === item.id;
            const triggerId = `faq-trigger-${item.id}`;
            const answerId = `faq-answer-${item.id}`;

            return (
              <article className={`${styles.item} ${isOpen ? styles.open : ""}`.trim()} key={item.id}>
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenItem(isOpen ? null : item.id)}
                  >
                    <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.question}>{item.question}</span>
                    <span className={styles.chevron}><ChevronDown aria-hidden="true" /></span>
                  </button>
                </h3>
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={styles.answerGrid}
                  aria-hidden={!isOpen}
                >
                  <div className={styles.answerInner}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
