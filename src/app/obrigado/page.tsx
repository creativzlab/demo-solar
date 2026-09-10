import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  MessageCircleMore,
  SunMedium,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import BrandedVideoPlayer from "@/components/ui/branded-video-player";
import TestimonialCarousel from "@/components/ui/profile-card-testimonial-carousel";
import TubesCursor from "@/components/ui/tubes-cursor";
import styles from "./obrigado.module.css";

export const metadata: Metadata = {
  title: "Solicitação recebida | Demanda Infinita",
  description: "Entenda os próximos passos da sua análise de energia solar.",
};

const temporaryVslUrl =
  "https://res.cloudinary.com/hm2xwqag/video/upload/v1787095160/Video_Institucional_-_Tela_de_Obrigado_Fict%C3%ADcia_sk7coc.mp4";

export default function ThankYouPage() {
  const vslUrl = process.env.NEXT_PUBLIC_DSI_VSL_URL?.trim() || temporaryVslUrl;

  return (
    <main className={styles.page}>
      <div className={styles.ambientLight} aria-hidden="true" />
      <TubesCursor />

      <section className={styles.hero} aria-labelledby="thank-you-heading">
        <div className={styles.heroCopy} data-reveal="hero">
          <span className={styles.successMark} aria-hidden="true">
            <Check size={27} strokeWidth={3} />
          </span>
          <p className={styles.eyebrow}>Solicitação confirmada</p>
          <h1 id="thank-you-heading">
            Recebemos sua solicitação de <span>orçamento.</span>
          </h1>
          <p className={styles.subheadline}>
            Por favor, assista ao vídeo abaixo para saber os próximos passos.
          </p>
        </div>

        <div className={styles.vslStage} data-reveal="soft" data-reveal-delay="1">
          <div className={styles.energyLine} aria-hidden="true" />
          <div
            className={styles.vslFrame}
            data-testid="vsl-player"
            data-vsl-state={vslUrl ? "ready" : "awaiting-source"}
          >
            <div className={styles.vslTopbar}>
              <span><i aria-hidden="true" /> Vídeo de orientação</span>
              <span>Assista antes da nossa conversa</span>
            </div>

            <div className={styles.vslMedia}>
              <BrandedVideoPlayer
                src={vslUrl}
                poster="/images/hero-solar.webp"
                title="Vídeo com os próximos passos da análise solar"
              />
            </div>

            <div className={styles.vslCaption}>
              <span><SunMedium size={17} aria-hidden="true" /> Informação clara para uma decisão segura</span>
              <span>Energia solar, sem complicação</span>
            </div>
          </div>
        </div>

        <aside className={styles.phoneNotice} data-reveal="soft" data-reveal-delay="2">
          <MessageCircleMore aria-hidden="true" />
          <div>
            <strong>Mantenha seu WhatsApp por perto.</strong>
            <span>Nossa equipe pode chamar para confirmar os dados da sua análise.</span>
          </div>
        </aside>

      </section>

      <TestimonialCarousel className={styles.socialProof} variant="thank-you" />

      <footer className={styles.footer} role="contentinfo" data-reveal="soft">
        <BrandMark inverse />
        <p>Energia inteligente começa com uma decisão bem informada.</p>
        <nav aria-label="Links legais">
          <Link href="/privacidade">Privacidade</Link>
          <Link href="/termos">Termos</Link>
        </nav>
      </footer>
    </main>
  );
}
