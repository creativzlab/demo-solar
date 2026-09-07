"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Component as BudgetButton } from "@/components/ui/button";
import styles from "./profile-card-testimonial-carousel.module.css";

interface Testimonial {
  id: string;
  title: string;
  quote: string;
  name: string;
  context: string;
  projectImage: string;
  portraitOffset: string;
}

const testimonials: Testimonial[] = [
  {
    id: "qualidade",
    title: "Qualidade incomparável",
    quote: "Empresa de qualidade incomparável, equipe nota 10 e com ótimo custo benefício.",
    name: "Rafael Monteiro",
    context: "Cliente residencial — relato demonstrativo",
    projectImage: "/images/testimonial-project-03.webp",
    portraitOffset: "0%",
  },
  {
    id: "confianca",
    title: "Empresa de confiança e bom serviço.",
    quote: "Empresa de confiança e bom serviço. Já é a segunda vez que a contrato e tudo funciona dentro do acordado.",
    name: "Marcos Almeida",
    context: "Cliente residencial — relato demonstrativo",
    projectImage: "/images/testimonial-project-02.webp",
    portraitOffset: "-40%",
  },
  {
    id: "recomendo",
    title: "Super recomendo!",
    quote: "Não tive problemas em nenhuma etapa do processo, das diversas cotações até a instalação final. Microgeração funcionando perfeitamente. Super recomendo!",
    name: "Daniel Souza",
    context: "Cliente residencial — relato demonstrativo",
    projectImage: "/images/testimonial-project-01.webp",
    portraitOffset: "-80%",
  },
];

function GoogleIcon() {
  return (
    <svg className={styles.googleMark} viewBox="0 0 18 18" role="img" aria-label="Google">
      <path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.909c1.702-1.567 2.683-3.874 2.683-6.614Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.468-.806 5.957-2.181l-2.91-2.258c-.805.54-1.835.859-3.047.859-2.344 0-4.328-1.585-5.037-3.714H.956v2.332A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.963 10.706A5.41 5.41 0 0 1 3.681 9c0-.592.102-1.168.282-1.706V4.962H.956A9 9 0 0 0 0 9c0 1.45.347 2.824.956 4.038l3.007-2.332Z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.507.454 3.441 1.346l2.581-2.58C13.464.892 11.43 0 9 0A9 9 0 0 0 .956 4.962l3.007 2.332C4.672 5.165 6.656 3.58 9 3.58Z" />
    </svg>
  );
}

interface TestimonialCarouselProps {
  className?: string;
  onRequestQuote?: () => void;
  variant?: "default" | "thank-you";
}

export function TestimonialCarousel({
  className = "",
  onRequestQuote,
  variant = "default",
}: TestimonialCarouselProps) {
  const isThankYou = variant === "thank-you";

  const renderTestimonialSet = (duplicate = false) => (
    <div
      className={styles.cardSet}
      aria-hidden={duplicate || undefined}
      data-testid={duplicate ? undefined : "testimonial-card-set"}
    >
      {testimonials.map((testimonial) => (
        <article className={styles.card} key={`${duplicate ? "duplicate-" : ""}${testimonial.id}`}>
          <div className={styles.portrait}>
            <Image
              src={testimonial.projectImage}
              alt={isThankYou
                ? `Projeto solar de ${testimonial.name}`
                : `Projeto solar associado ao depoimento demonstrativo de ${testimonial.name}`}
              fill
              sizes="(max-width: 760px) 104px, 142px"
            />
          </div>

          <div className={styles.content}>
            <div className={styles.reviewHeader}>
              <div className={styles.authorIdentity}>
                <span
                  className={styles.avatar}
                  role="img"
                  aria-label={isThankYou ? `Cliente ${testimonial.name}` : `Retrato ilustrativo de ${testimonial.name}`}
                >
                  <Image
                    src="/images/testimonial-avatars-v1.webp"
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="170px"
                    style={{ transform: `translateX(${testimonial.portraitOffset})` }}
                  />
                </span>
                <div className={styles.authorCopy}>
                  <strong>{testimonial.name}</strong>
                  <span>{isThankYou ? "Avaliação no Google" : testimonial.context}</span>
                </div>
              </div>
              <GoogleIcon />
            </div>

            <blockquote className={styles.quote}>
              <h3>“{testimonial.title}”</h3>
              <p>{testimonial.quote}</p>
            </blockquote>

            <div className={styles.ratingRow}>
              <span className={styles.rating} aria-label={isThankYou ? "Avaliação: 5 de 5 estrelas" : "Avaliação demonstrativa: 5 de 5 estrelas"}>
                <span aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => <Star key={index} size={13} fill="currentColor" />)}
                </span>
                <strong>5,0</strong>
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <section
      id="clientes"
      className={`${styles.section} ${className}`.trim()}
      aria-labelledby="testimonials-heading"
      data-viewport-animate
    >
      <div className={styles.shell}>
        <header className={styles.header} data-reveal>
          <a className={`economy-tag ${styles.tag}`} href="#clientes"><span aria-hidden="true" />{isThankYou ? "Resultados" : "Cliente"}</a>
          <h2 id="testimonials-heading">
            {isThankYou ? <>Quem já produz a própria energia <strong>confirma</strong></> : <>O que <strong>nossos clientes</strong> dizem</>}
          </h2>
        </header>

        <div
          className={styles.carousel}
          role="region"
          aria-label={isThankYou ? "Avaliações de clientes no Google" : "Depoimentos demonstrativos"}
          data-reveal="soft"
        >
          <div className={styles.viewport}>
            <div
              className={styles.track}
              data-testid="testimonial-marquee"
            >
              {renderTestimonialSet()}
              {renderTestimonialSet(true)}
            </div>
          </div>
        </div>

        {onRequestQuote && (
          <BudgetButton title="Solicitar Orçamento Grátis" className={styles.cta} onClick={onRequestQuote} data-reveal />
        )}
      </div>
    </section>
  );
}

export default TestimonialCarousel;
