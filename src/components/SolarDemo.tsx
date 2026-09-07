"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import {
  Activity,
  BadgeCheck,
  Clock3,
  FileText,
  HeartHandshake,
  House,
  Menu,
  ShieldCheck,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { HeroBackgroundVideo } from "@/components/HeroBackgroundVideo";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { Component as BudgetButton } from "@/components/ui/button";
import { SolarBenefitCard } from "@/components/ui/card-17";
import FAQs from "@/components/ui/faqs-component";
import { MarqueeAnimation } from "@/components/ui/marquee-effect";
import { MinimalFooter } from "@/components/ui/minimal-footer";
import LogoScroller, { type CertificationLogo } from "@/components/ui/logo-scroller";
import { ProcessTimeline, type ProcessTimelineItem } from "@/components/ui/process-timeline";
import TestimonialCarousel from "@/components/ui/profile-card-testimonial-carousel";
import TubesCursor from "@/components/ui/tubes-cursor";

const QuoteFunnel = dynamic(
  () => import("@/components/QuoteFunnel").then((module) => module.QuoteFunnel),
  { ssr: false },
);

const trustItems = [
  [BadgeCheck, "100% certificados"],
  [HeartHandshake, "Satisfação garantida"],
  [Clock3, "Orçamento no mesmo dia"],
  [ShieldCheck, "25 anos de garantia"],
] as const satisfies ReadonlyArray<readonly [LucideIcon, string]>;

const certificationLogos = [
  { src: "/images/certifications/crea.png", alt: "CREA" },
  { src: "/images/certifications/inmetro.png", alt: "Inmetro" },
  { src: "/images/certifications/abnt.png", alt: "ABNT" },
  { src: "/images/certifications/iec.png", alt: "IEC" },
  { src: "/images/certifications/light.png", alt: "Light" },
] as const satisfies readonly CertificationLogo[];

function RefundIcon() {
  return <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M5.671 4.257c3.928-3.219 9.733-2.995 13.4.672 3.905 3.905 3.905 10.237 0 14.142-3.905 3.905-10.237 3.905-14.142 0A9.993 9.993 0 0 1 2.25 9.767l.077-.313 1.934.51a8 8 0 1 0 3.053-4.45l-.221.166 1.017 1.017-4.596 1.06 1.06-4.596 1.096 1.096zM13 6v2h2.5v2H10a.5.5 0 0 0-.09.992L10 11h4a2.5 2.5 0 1 1 0 5h-1v2h-2v-2H8.5v-2H14a.5.5 0 0 0 .09-.992L14 13h-4a2.5 2.5 0 1 1 0-5h1V6h2z" />
  </svg>;
}

const economyBenefits = [
  {
    icon: <RefundIcon />,
    text: "Retorno sobre o investimento entre 2 e 5 anos",
    imageUrl: "/images/roof-solar.webp",
  },
  {
    icon: <ShieldCheck />,
    text: "Livre de aumentos de energia e tarifas extras",
    imageUrl: "/images/hero-solar.webp",
  },
  {
    icon: <House />,
    text: "Valorização do imóvel",
    imageUrl: "/images/team-solar.webp",
  },
] as const;

const processSteps: ProcessTimelineItem[] = [
  {
    id: "projeto",
    tag: "Etapa 01",
    title: "Projeto",
    description: "Elaboramos um projeto customizado para atender à sua necessidade.",
    icon: FileText,
  },
  {
    id: "homologacao",
    tag: "Etapa 02",
    title: "Homologação",
    description: "Cuidamos de todo o processo de legalização junto à distribuidora.",
    icon: BadgeCheck,
  },
  {
    id: "instalacao",
    tag: "Etapa 03",
    title: "Instalação",
    description: "Instalamos o sistema utilizando os equipamentos mais atuais do mercado.",
    icon: Zap,
  },
  {
    id: "manutencao",
    tag: "Etapa 04",
    title: "Manutenção",
    description: "Oferecemos assinatura opcional de manutenção preventiva para seu sistema.",
    icon: Wrench,
  },
  {
    id: "monitoramento",
    tag: "Etapa 05",
    title: "Monitoramento",
    description: "Monitoramos a geração à distância para prevenção e segurança.",
    icon: Activity,
  },
];

const financingBanks = [
  { key: "bv", label: "Banco BV", src: "/images/banks/bv.webp" },
  { key: "solfacil", label: "Solfácil", src: "/images/banks/solfacil.png" },
  { key: "bb", label: "Banco do Brasil", src: "/images/banks/banco-do-brasil.png" },
  { key: "sicoob", label: "Sicoob", src: "/images/banks/sicoob.webp" },
  { key: "itau", label: "Itaú", src: "/images/banks/itau.webp" },
  { key: "santander", label: "Santander", src: "/images/banks/santander.webp" },
  { key: "caixa", label: "Caixa Econômica Federal", src: "/images/banks/caixa.png" },
] as const;

export function SolarDemo() {
  const [funnelOpen, setFunnelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const openFunnel = useCallback(() => {
    setMenuOpen(false);
    setFunnelOpen(true);
  }, []);

  return (
    <>
      <TubesCursor />
      <main id="top">
        <section className="hero shell">
          <header className="site-header" data-reveal="hero">
            <a href="#top" className="brand-link"><BrandMark inverse hideIcon /></a>
            <nav className={menuOpen ? "is-open" : ""} aria-label="Navegação principal">
              <div className="nav-links">
                <a href="#economia" onClick={() => setMenuOpen(false)}>Economia</a>
              <a href="#processo" onClick={() => setMenuOpen(false)}>Como funciona</a>
              <a href="#por-que" onClick={() => setMenuOpen(false)}>Por que escolher</a>
              <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre nós</a>
              </div>
              <BudgetButton title="Solicitar Orçamento Grátis" size="sm" className="budget-button--header" onClick={openFunnel} />
            </nav>
            <button className="menu-button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuOpen((value) => !value)}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </header>
          <HeroBackgroundVideo />
          <div className="hero-scrim" />
          <div className="hero-content" data-reveal="hero-soft" data-reveal-delay="1">
            <div className="hero-copy">
              <h1>Economize até 95% na sua conta de luz</h1>
              <p className="hero-subtitle">Com <strong>mais de 300 instalações realizadas</strong>, garantimos máxima eficiência energética em <strong>menos de 30 dias</strong>, sem que você precise levantar um dedo.</p>
              <div className="hero-actions">
                <BudgetButton title="Solicitar Orçamento Grátis" className="budget-button--hero" onClick={openFunnel} />
                <a className="text-link text-link--light" href="#processo">Ver como funciona</a>
              </div>
            </div>
            <div className="hero-calculator">
              <SavingsCalculator variant="hero" />
            </div>
          </div>
          <div className="trust-strip trust-strip--hero" aria-label="Diferenciais demonstrativos" data-reveal="soft" data-reveal-delay="2">
            {trustItems.map(([Icon, label]) => <div key={label}><Icon size={20} /><span>{label}</span></div>)}
          </div>
        </section>

        <LogoScroller logos={certificationLogos} />

        <section className="economy-section shell" id="economia">
          <div className="economy-section__heading" data-reveal>
            <a className="economy-tag" href="#economia"><span aria-hidden="true" />Economia</a>
            <div className="economy-section__copy-grid">
              <h2>Os preços de energia estão mais altos que nunca e só tendem a aumentar.</h2>
              <p>Com painéis solares, <strong>você pode economizar até 95% na sua conta de luz.</strong></p>
            </div>
          </div>
          <div className="economy-card-grid" aria-label="Benefícios da energia solar" data-reveal="soft">
            {economyBenefits.map((benefit) => <SolarBenefitCard {...benefit} key={benefit.text} />)}
          </div>
          <BudgetButton title="Solicitar Orçamento Grátis" className="budget-button--economy" onClick={openFunnel} data-reveal />
        </section>

        <MarqueeAnimation>Economize até 95% na sua conta de luz.</MarqueeAnimation>

        <section className="process-section" id="processo">
          <div className="process-section__inner shell">
            <div className="process-section__layout">
              <div className="process-section__copy" data-reveal>
                <a className="economy-tag" href="#processo"><span aria-hidden="true" />Como funciona</a>
                <h2>Processo rápido e sem estresse</h2>
              </div>
              <ProcessTimeline items={processSteps} />
            </div>
            <BudgetButton title="Solicitar Orçamento Grátis" className="budget-button--process budget-button--process-timeline" onClick={openFunnel} data-reveal />
          </div>
        </section>

        <TestimonialCarousel onRequestQuote={openFunnel} />

        <MarqueeAnimation testId="scroll-marquee-process-end">Economize até 95% na sua conta de luz.</MarqueeAnimation>

        <section id="financiamento" className="financing-section">
          <div className="financing-section__inner shell">
            <div className="financing-section__heading" data-reveal>
              <h2>Economize hoje, <strong>pague em até 72x</strong></h2>
              <p>Oferecemos condições de financiamento flexíveis para que você transforme a despesa da conta de luz em um investimento para o futuro.</p>
            </div>

            <div className="bank-grid" aria-label="Instituições financeiras exibidas de forma ilustrativa" data-reveal="soft">
              {financingBanks.map((bank) => (
                <div className={`bank-logo bank-logo--${bank.key}`} key={bank.key}>
                  <Image
                    className="bank-logo__image"
                    src={bank.src}
                    alt={bank.label}
                    fill
                    sizes="(max-width: 760px) 45vw, (max-width: 1100px) 23vw, 12vw"
                  />
                </div>
              ))}
            </div>

            <div className="financing-highlight" data-reveal>
              Em muitos casos, as parcelas são menores que a sua conta de luz,<br />
              garantindo economia desde o primeiro mês.
            </div>

            <BudgetButton title="Solicitar Orçamento Grátis" className="budget-button--financing" onClick={openFunnel} data-reveal />
          </div>
        </section>

        <FAQs onRequestQuote={openFunnel} />
      </main>

      <MinimalFooter />
      {funnelOpen ? <QuoteFunnel open onClose={() => setFunnelOpen(false)} /> : null}
    </>
  );
}
