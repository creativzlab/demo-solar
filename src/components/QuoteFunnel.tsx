"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleHelp, LockKeyhole, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Component as BudgetButton } from "@/components/ui/button";
import SoftBlurIn from "@/components/ui/soft-blur-in";
import { SnappySlider } from "@/components/ui/snappy-slider";
import { formatBrazilianNationalPhone, isValidBrazilianPhone } from "@/lib/br-phone";
import { solarTips, type SolarTip } from "@/lib/solar-tips";

type InstallationTimeline = "Imediatamente" | "Até 30 dias" | "De 31 a 90 dias" | "De 3 a 6 meses" | "Estou pesquisando";

type LeadDraft = {
  propertyType?: "Casa" | "Empresa / Condomínio";
  monthlyBill?: number;
  roofType?: "Colonial" | "Metálica" | "Fibrocimento" | "Laje" | "Outro / Não Sei";
  neighborhood?: string;
  installationTimeline?: InstallationTimeline;
  name?: string;
  phone?: string;
  website?: string;
};

const billSnapValues = [400, 800, 1200, 1800, 2500, 5000] as const;

const installationTimelineOptions: ReadonlyArray<{ value: InstallationTimeline; label: string }> = [
  { value: "Imediatamente", label: "Imediatamente" },
  { value: "Até 30 dias", label: "Nos próximos 30 dias" },
  { value: "De 31 a 90 dias", label: "Dentro de 1 a 3 meses" },
  { value: "De 3 a 6 meses", label: "Dentro de 4 a 6 meses" },
  { value: "Estou pesquisando", label: "Ainda estou apenas pesquisando" },
];

const roofOptions = [
  { value: "Colonial", image: "/images/roofs/colonial.avif", alt: "Telhado colonial de cerâmica" },
  { value: "Metálica", image: "/images/roofs/metalica.avif", alt: "Telhado metálico" },
  { value: "Fibrocimento", image: "/images/roofs/fibrocimento.avif", alt: "Telhado de fibrocimento" },
  { value: "Laje", image: "/images/roofs/laje.avif", alt: "Cobertura em laje" },
  { value: "Outro / Não Sei", image: null, alt: "Outro tipo de telhado" },
] as const;

const propertyCards = [
  { value: "Casa", label: "Minha Casa", image: "/images/funnel/casa-orange.gif", iconClass: "visual-choice__icon--house" },
  { value: "Empresa / Condomínio", label: "Minha Empresa", image: "/images/funnel/empresa-orange.gif", iconClass: "visual-choice__icon--company" },
] as const;

const phoneErrorMessage = "Digite um celular com DDD e o 9, ou um telefone fixo com DDD.";

export function QuoteFunnel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<LeadDraft>({ monthlyBill: 400, website: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [compactLayout, setCompactLayout] = useState(false);
  const startedAt = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const formScrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const totalSteps = 6;

  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const syncLayout = () => setCompactLayout(query.matches);

    syncLayout();
    query.addEventListener("change", syncLayout);
    return () => query.removeEventListener("change", syncLayout);
  }, []);

  useEffect(() => {
    if (!open) return;
    startedAt.current = Date.now();
    document.body.classList.add("modal-open");
    window.setTimeout(() => dialogRef.current?.focus(), 30);
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) formScrollRef.current?.scrollTo({ top: 0 });
  }, [open, step]);

  const progress = useMemo(() => ((step + 1) / totalSteps) * 100, [step]);

  if (!open) return null;

  function update<K extends keyof LeadDraft>(key: K, value: LeadDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function nextIf(value: unknown, message = "Escolha uma opção para continuar.") {
    if (!value) return setError(message);
    setStep((current) => Math.min(current + 1, totalSteps - 1));
  }

  function advanceCurrentStep() {
    if (step === 0) nextIf(draft.propertyType);
    if (step === 1) nextIf(draft.monthlyBill);
    if (step === 2) nextIf(draft.roofType);
    if (step === 3) nextIf(draft.neighborhood?.trim(), "Digite o bairro para continuar.");
    if (step === 4) nextIf(draft.installationTimeline);
  }

  function returnToPreviousStep() {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name?.trim()) {
      setError("Digite seu nome para receber o orçamento.");
      return;
    }
    if (!draft.phone?.trim() || !isValidBrazilianPhone(draft.phone)) {
      setError(phoneErrorMessage);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, consent: true, startedAt: startedAt.current }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string; demoMode?: boolean };
      if (!response.ok || !result.ok) throw new Error(result.message || "Não foi possível enviar.");
      sessionStorage.setItem("demoSolarMode", result.demoMode ? "local" : "integrated");
      router.push("/obrigado");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível enviar agora.");
      setSubmitting(false);
    }
  }

  return (
    <div className="funnel-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="funnel-dialog" role="dialog" aria-modal="true" aria-labelledby="funnel-title" tabIndex={-1} ref={dialogRef}>
        <button className="funnel-close" onClick={onClose} aria-label="Fechar formulário"><X size={20} /></button>

        {!compactLayout && (
          <FunnelTip
            tip={solarTips[step]}
            step={step}
            totalSteps={totalSteps}
            variant="panel"
          />
        )}

        <form className="funnel-form-panel" onSubmit={submit}>
        <div
          className="funnel-form-scroll"
          ref={formScrollRef}
          role="region"
          aria-label={`Conteúdo da etapa ${step + 1} de ${totalSteps}`}
          tabIndex={0}
        >

        {compactLayout && (
          <FunnelTip
            tip={solarTips[step]}
            step={step}
            totalSteps={totalSteps}
            variant="card"
          />
        )}

        {step === 0 && (
          <section key="funnel-step-0" className="funnel-step funnel-step--intro" data-reveal>
            <h2 id="funnel-title">Receba Seu Orçamento Gratuito!</h2>
            <p className="funnel-time">◷ Demora menos de 30 segundos</p>
            <FunnelProgress progress={progress} />
            <h3>Onde será a instalação?</h3>
            <div className="choice-grid choice-grid--two">
              {propertyCards.map(({ value, label, image, iconClass }) => (
                <button key={value} type="button" className={`visual-choice ${draft.propertyType === value ? "is-selected" : ""}`} onClick={() => update("propertyType", value)}>
                  <span className={`visual-choice__icon ${iconClass}`} aria-hidden="true">
                    <Image className="visual-choice__animated-icon" src={image} alt="" width={64} height={64} unoptimized />
                  </span>
                  <strong>{label}</strong>{draft.propertyType === value && <Check className="choice-check" size={18} />}
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 1 && (
          <section key="funnel-step-1" className="funnel-step funnel-step--bill" data-reveal>
            <h2 id="funnel-title">Qual o valor médio da sua conta de energia?</h2>
            <FunnelProgress progress={progress} />
            <p className="funnel-step-guidance">Arraste ou digite o valor aproximado.</p>
            <div className="funnel-bill-slider">
              <SnappySlider
                id="monthly-bill"
                label="Valor aproximado da conta"
                value={draft.monthlyBill ?? 400}
                values={[...billSnapValues]}
                min={400}
                max={5000}
                step={50}
                onChange={(value) => update("monthlyBill", value)}
              />
            </div>
          </section>
        )}

        {step === 2 && (
          <section key="funnel-step-2" className="funnel-step funnel-step--roof" data-reveal>
            <h2 id="funnel-title">Qual o tipo de telha da propriedade?</h2>
            <FunnelProgress progress={progress} />
            <div className="roof-grid">
              {roofOptions.map((option) => (
                <button type="button" key={option.value} className={`roof-choice ${draft.roofType === option.value ? "is-selected" : ""}`} onClick={() => update("roofType", option.value)}>
                  <span className="roof-choice__media" aria-hidden="true">
                    {option.image ? (
                      <Image src={option.image} alt={option.alt} fill sizes="(max-width: 640px) 42vw, 190px" />
                    ) : (
                      <CircleHelp />
                    )}
                  </span>
                  <strong>{option.value}</strong>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section key="funnel-step-3" className="funnel-step" data-reveal>
            <h2 id="funnel-title">Em que bairro está a propriedade?</h2>
            <FunnelProgress progress={progress} />
            <label className="field-label" htmlFor="neighborhood">Bairro</label>
            <input id="neighborhood" className="text-field text-field--line" value={draft.neighborhood ?? ""} onChange={(event) => update("neighborhood", event.target.value)} placeholder="Bairro" autoComplete="address-level3" autoFocus />
          </section>
        )}

        {step === 4 && (
          <section key="funnel-step-4" className="funnel-step funnel-step--timeline" data-reveal>
            <h2 id="funnel-title">Em quanto tempo você pretende instalar energia solar?</h2>
            <FunnelProgress progress={progress} />
            <div className="option-list">
              {installationTimelineOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={draft.installationTimeline === option.value ? "is-selected" : ""}
                  onClick={() => update("installationTimeline", option.value)}
                >
                  <span>{option.label}</span>
                  <i>{draft.installationTimeline === option.value && <Check size={15} />}</i>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 5 && (
          <section key="funnel-step-5" className="funnel-step funnel-step--contact" data-reveal>
            <h2 id="funnel-title">Para onde devemos enviar seu orçamento?</h2>
            <FunnelProgress progress={progress} />
            <div className="field-grid">
              <label>Nome<input className="text-field text-field--line" value={draft.name ?? ""} onChange={(event) => update("name", event.target.value)} placeholder="Nome" autoComplete="name" required /></label>
              <div className="contact-field">
                <label htmlFor="phone">Telefone / WhatsApp</label>
                <div className={`phone-field ${error === phoneErrorMessage ? "is-invalid" : ""}`}>
                  <span className="phone-prefix" aria-label="Código do Brasil mais cinquenta e cinco">+55</span>
                  <input
                    id="phone"
                    className="phone-input"
                    value={draft.phone ?? ""}
                    onChange={(event) => update("phone", formatBrazilianNationalPhone(event.target.value))}
                    placeholder="(00) 00000-0000"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={15}
                    aria-describedby="phone-hint"
                    aria-invalid={error === phoneErrorMessage}
                    required
                  />
                </div>
                <small id="phone-hint" className="field-hint">DDD + celular com 9 ou telefone fixo.</small>
              </div>
              <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} value={draft.website ?? ""} onChange={(event) => update("website", event.target.value)} autoComplete="off" /></label>
            </div>
            <p className="funnel-privacy"><LockKeyhole size={16} />Não faremos spam nem compartilharemos seus dados com ninguém.</p>
          </section>
        )}
        </div>
        <div className="funnel-panel-footer">
          <div className="funnel-error-slot" aria-live="polite">
            {error && <p className="funnel-error" role="alert">{error}</p>}
          </div>
          <FunnelActions
            back={step > 0 ? returnToPreviousStep : undefined}
            next={step < totalSteps - 1 ? advanceCurrentStep : undefined}
            submit={step === totalSteps - 1}
            submitting={submitting}
          />
        </div>
        </form>
      </div>
    </div>
  );
}

function FunnelProgress({ progress }: { progress: number }) {
  return <div className="funnel-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>;
}

function FunnelTip({
  tip,
  step,
  totalSteps,
  variant,
}: {
  tip: SolarTip;
  step: number;
  totalSteps: number;
  variant: "panel" | "card";
}) {
  return (
    <aside
      className={`funnel-tip funnel-tip--${variant}`}
      aria-label={`Dica solar ${step + 1} de ${totalSteps}`}
      aria-live="polite"
      data-testid="funnel-tip"
    >
      <div className="funnel-tip__glow" aria-hidden="true" />
      <div className="funnel-tip__content">
        <div className="funnel-tip__copy" key={`tip-copy-${step}`}>
          {variant === "panel" ? (
            <h2>
              <SoftBlurIn stagger={10}>
                {tip.title}
              </SoftBlurIn>
            </h2>
          ) : null}
          <p>{tip.body}</p>
        </div>
        {variant === "panel" ? (
          <div className="funnel-tip__visual" data-testid="funnel-tip-visual" aria-hidden="true">
            <Image
              src="/images/funnel/solar-panel-display.webp"
              alt=""
              width={1100}
              height={500}
              sizes="390px"
            />
          </div>
        ) : null}
      </div>
      <strong className="funnel-tip__emphasis" data-testid="funnel-tip-emphasis" key={`tip-emphasis-${step}`}>
        <SoftBlurIn delay={180} stagger={4}>
          {tip.emphasis}
        </SoftBlurIn>
      </strong>
      <div className="funnel-tip__footer" aria-label={`Etapa ${step + 1} de ${totalSteps}`}>
        <span>Etapa</span>
        <div className="funnel-tip__dots" aria-hidden="true">
          {Array.from({ length: totalSteps }, (_, index) => (
            <i key={index} className={index <= step ? "is-active" : undefined} />
          ))}
        </div>
        <strong>{String(step + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}</strong>
      </div>
    </aside>
  );
}

function FunnelActions({ back, next, submit = false, submitting = false }: { back?: () => void; next?: () => void; submit?: boolean; submitting?: boolean }) {
  return (
    <div className="funnel-actions">
      {back ? <button type="button" className="funnel-back" onClick={back} aria-label="Voltar"><ArrowLeft size={18} /></button> : null}
      {submit ? (
        <BudgetButton
          type="submit"
          title={submitting ? "Enviando..." : "Receber meu orçamento"}
          size="md"
          className="funnel-budget-button"
          disabled={submitting}
        />
      ) : (
        <button type="button" className="funnel-next" onClick={next}>Continuar <ArrowRight size={20} /></button>
      )}
    </div>
  );
}
